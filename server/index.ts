import express from 'express'
import cookieParser from 'cookie-parser'
import { randomUUID } from 'node:crypto'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadEnvFile } from 'node:process'
import { z } from 'zod'
import type { InStatement } from '@libsql/client'
import { aiService } from './ai.js'
import { createUser, ensureDatabase, getUserProfile, queryAll, queryOne, run, writeBatch } from './db.js'
import { createSessionToken, hashPassword, hashToken, verifyPassword } from './security.js'
import { sendPasswordResetEmail } from './email.js'
import { calculateSkillUpdate } from './progress.js'
import { evaluateIntegratedSummary, integratedSummaryTexts, publicIntegratedSummaryTexts } from './integratedSummary.js'

try { loadEnvFile() } catch { /* Environment variables may be supplied by the host. */ }

const app = express()
const port = Number(process.env.PORT || 4174)
const isProduction = process.env.NODE_ENV === 'production'

app.disable('x-powered-by')
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Referrer-Policy', 'same-origin')
  next()
})

const rateBuckets = new Map<string, { count: number; reset: number }>()
const rateLimit = (limit: number, windowMs: number): express.RequestHandler => (req, res, next) => {
  const key = `${req.ip}:${req.path}`
  const now = Date.now()
  const bucket = rateBuckets.get(key)
  if (!bucket || bucket.reset <= now) {
    rateBuckets.set(key, { count: 1, reset: now + windowMs })
    next()
    return
  }
  if (bucket.count >= limit) {
    res.status(429).json({ error: 'Too many requests. Please wait and try again.' })
    return
  }
  bucket.count++
  next()
}

const authLimit = rateLimit(20, 15 * 60_000)
const aiLimit = rateLimit(30, 60_000)
const asyncRoute = (fn: (req: express.Request, res: express.Response) => Promise<unknown>): express.RequestHandler =>
  (req, res, next) => { void Promise.resolve(fn(req, res)).catch(next) }

const auth: express.RequestHandler = (req, res, next) => {
  void (async () => {
    const token = req.cookies?.lexora_session
    if (!token) {
      res.status(401).json({ error: 'Authentication required' })
      return
    }
    const row = await queryOne<{ user_id: string }>(
      'SELECT user_id FROM sessions WHERE token_hash=? AND expires_at > ?',
      [hashToken(token), new Date().toISOString()],
    )
    if (!row) {
      res.status(401).json({ error: 'Session expired' })
      return
    }
    res.locals.userId = row.user_id
    next()
  })().catch(next)
}

async function setSession(res: express.Response, userId: string) {
  const session = createSessionToken()
  const expires = new Date(Date.now() + 30 * 86400000)
  await writeBatch([
    { sql: 'DELETE FROM sessions WHERE user_id=? OR expires_at <= ?', args: [userId, new Date().toISOString()] },
    { sql: 'INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)', args: [session.hash, userId, expires.toISOString()] },
  ])
  res.cookie('lexora_session', session.token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction,
    expires,
    path: '/',
  })
}

app.get('/api/health', asyncRoute(async (_req, res) => {
  await ensureDatabase()
  res.json({
    status: 'ok',
    database: process.env.TURSO_DATABASE_URL ? 'turso' : 'local-libsql',
    aiProvider: process.env.AI_PROVIDER || 'mock',
  })
}))

app.post('/api/auth/signup', authLimit, asyncRoute(async (req, res) => {
  const parsed = z.object({
    name: z.string().trim().min(2).max(60),
    email: z.string().email(),
    password: z.string().min(8).max(128),
  }).safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0].message })
    return
  }
  const email = parsed.data.email.toLowerCase()
  if (await queryOne('SELECT id FROM users WHERE email=?', [email])) {
    res.status(409).json({ error: 'An account with this email already exists.' })
    return
  }
  const id = await createUser(parsed.data.name, email, parsed.data.password)
  await setSession(res, id)
  res.status(201).json({ user: await getUserProfile(id) })
}))

app.post('/api/auth/login', authLimit, asyncRoute(async (req, res) => {
  const parsed = z.object({ email: z.string().email(), password: z.string().min(1) }).safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Enter a valid email and password.' })
    return
  }
  const row = await queryOne<{ id: string; password_hash: string; password_salt: string }>(
    'SELECT id,password_hash,password_salt FROM users WHERE email=?',
    [parsed.data.email.toLowerCase()],
  )
  if (!row || !verifyPassword(parsed.data.password, row.password_salt, row.password_hash)) {
    res.status(401).json({ error: 'Email or password is incorrect.' })
    return
  }
  await setSession(res, row.id)
  res.json({ user: await getUserProfile(row.id) })
}))

app.post('/api/auth/logout', auth, asyncRoute(async (req, res) => {
  const token = req.cookies?.lexora_session
  if (token) await run('DELETE FROM sessions WHERE token_hash=?', [hashToken(token)])
  res.clearCookie('lexora_session', { path: '/' })
  res.status(204).end()
}))

app.post('/api/auth/password-reset', authLimit, asyncRoute(async (req, res) => {
  const parsed = z.object({ email: z.string().email() }).safeParse(req.body)
  let devResetToken: string | undefined
  if (parsed.success) {
    const email = parsed.data.email.toLowerCase()
    const user = await queryOne<{ id: string }>('SELECT id FROM users WHERE email=?', [email])
    if (user) {
      const session = createSessionToken()
      devResetToken = session.token
      await writeBatch([
        { sql: 'DELETE FROM password_reset_tokens WHERE user_id=? OR expires_at<=?', args: [user.id, new Date().toISOString()] },
        { sql: 'INSERT INTO password_reset_tokens(token_hash,user_id,expires_at) VALUES(?,?,?)', args: [session.hash, user.id, new Date(Date.now() + 3600000).toISOString()] },
      ])
      await sendPasswordResetEmail(email, session.token)
    }
  }
  res.json({
    message: 'If that account exists, reset instructions have been sent.',
    ...(!isProduction && devResetToken ? { devResetToken } : {}),
  })
}))

app.post('/api/auth/password-reset/confirm', asyncRoute(async (req, res) => {
  const parsed = z.object({ token: z.string().min(20), password: z.string().min(8).max(128) }).safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'The reset link or password is invalid.' })
    return
  }
  const row = await queryOne<{ token_hash: string; user_id: string }>(
    'SELECT token_hash,user_id FROM password_reset_tokens WHERE token_hash=? AND used_at IS NULL AND expires_at>?',
    [hashToken(parsed.data.token), new Date().toISOString()],
  )
  if (!row) {
    res.status(400).json({ error: 'This reset link has expired or has already been used.' })
    return
  }
  const secured = hashPassword(parsed.data.password)
  await writeBatch([
    { sql: 'UPDATE users SET password_hash=?,password_salt=?,updated_at=CURRENT_TIMESTAMP WHERE id=?', args: [secured.hash, secured.salt, row.user_id] },
    { sql: 'UPDATE password_reset_tokens SET used_at=CURRENT_TIMESTAMP WHERE token_hash=?', args: [row.token_hash] },
    { sql: 'DELETE FROM sessions WHERE user_id=?', args: [row.user_id] },
  ])
  res.json({ message: 'Your password has been updated. You can now log in.' })
}))

app.get('/api/me', auth, asyncRoute(async (_req, res) => {
  res.json({ user: await getUserProfile(res.locals.userId) })
}))

app.patch('/api/me', auth, asyncRoute(async (req, res) => {
  const parsed = z.object({
    name: z.string().trim().min(2).max(60).optional(),
    dailyGoal: z.number().int().min(5).max(120).optional(),
    reminderEnabled: z.boolean().optional(),
  }).safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0].message })
    return
  }
  const updates: InStatement[] = []
  if (parsed.data.name) updates.push({ sql: 'UPDATE users SET name=?,updated_at=CURRENT_TIMESTAMP WHERE id=?', args: [parsed.data.name, res.locals.userId] })
  if (parsed.data.dailyGoal !== undefined) updates.push({ sql: 'UPDATE users SET daily_goal=?,updated_at=CURRENT_TIMESTAMP WHERE id=?', args: [parsed.data.dailyGoal, res.locals.userId] })
  if (parsed.data.reminderEnabled !== undefined) updates.push({ sql: 'UPDATE users SET daily_reminder=?,updated_at=CURRENT_TIMESTAMP WHERE id=?', args: [parsed.data.reminderEnabled ? 1 : 0, res.locals.userId] })
  if (updates.length) await writeBatch(updates)
  res.json({ user: await getUserProfile(res.locals.userId) })
}))

app.delete('/api/me', auth, asyncRoute(async (req, res) => {
  const parsed = z.object({ password: z.string().min(1) }).safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Enter your password to delete the account.' })
    return
  }
  const user = await queryOne<{ password_hash: string; password_salt: string }>(
    'SELECT password_hash,password_salt FROM users WHERE id=?', [res.locals.userId],
  )
  if (!user || !verifyPassword(parsed.data.password, user.password_salt, user.password_hash)) {
    res.status(403).json({ error: 'Password is incorrect.' })
    return
  }
  await run('DELETE FROM users WHERE id=?', [res.locals.userId])
  res.clearCookie('lexora_session', { path: '/' })
  res.status(204).end()
}))

app.post('/api/diagnostic', auth, asyncRoute(async (req, res) => {
  const parsed = z.object({ scores: z.record(z.string(), z.number().min(0).max(100)) }).safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid diagnostic scores.' })
    return
  }
  const values = Object.values(parsed.data.scores)
  const average = values.reduce((sum, value) => sum + value, 0) / Math.max(values.length, 1)
  const level = average >= 80 ? 'B2' : average >= 62 ? 'B1+' : 'B1'
  const statements: InStatement[] = Object.entries(parsed.data.scores).map(([key, value]) => ({
    sql: 'UPDATE user_skills SET score=? WHERE user_id=? AND skill_key=?',
    args: [Math.round(value), res.locals.userId, key],
  }))
  statements.push(
    { sql: 'UPDATE users SET level=?,level_progress=?,diagnostic_done=1,xp=xp+100 WHERE id=?', args: [level, Math.round(average), res.locals.userId] },
    { sql: 'INSERT INTO diagnostic_results(id,user_id,scores_json,estimated_level) VALUES(?,?,?,?)', args: [randomUUID(), res.locals.userId, JSON.stringify(parsed.data.scores), level] },
  )
  await writeBatch(statements)
  res.json({ user: await getUserProfile(res.locals.userId) })
}))

app.post('/api/attempts', auth, asyncRoute(async (req, res) => {
  const parsed = z.object({
    kind: z.string().min(1), title: z.string().min(1), skill: z.string().min(1),
    score: z.number().int().min(0).max(100), xp: z.number().int().min(0).max(1000),
    durationSeconds: z.number().int().min(0).default(0), mistakes: z.array(z.unknown()).default([]),
    outcomes: z.array(z.object({ skill: z.string().min(1), correct: z.boolean() })).default([]),
    topicId: z.string().optional(),
  }).safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid exercise result.' })
    return
  }
  const data = parsed.data
  const skill = await queryOne<{ score: number; attempts: number }>(
    'SELECT score,attempts FROM user_skills WHERE user_id=? AND skill_key=?',
    [res.locals.userId, data.skill],
  )
  const statements: InStatement[] = [{
    sql: 'INSERT INTO exercise_attempts(id,user_id,kind,title,skill_key,score,xp,duration_seconds,mistakes_json,outcomes_json) VALUES(?,?,?,?,?,?,?,?,?,?)',
    args: [randomUUID(), res.locals.userId, data.kind, data.title, data.skill, data.score, data.xp, data.durationSeconds, JSON.stringify(data.mistakes), JSON.stringify(data.outcomes)],
  }]
  if (skill) {
    const first = skill.attempts === 0 && skill.score === 0
    const next = calculateSkillUpdate(first ? data.score : skill.score, data.score)
    statements.push({
      sql: 'UPDATE user_skills SET score=?,delta=?,attempts=attempts+1 WHERE user_id=? AND skill_key=?',
      args: [next.score, first ? 0 : next.delta, res.locals.userId, data.skill],
    })
  }
  statements.push({ sql: 'UPDATE users SET xp=xp+?,last_practice_date=? WHERE id=?', args: [data.xp, new Date().toISOString().slice(0, 10), res.locals.userId] })
  if (data.topicId) statements.push({
    sql: 'INSERT INTO topic_progress(user_id,topic_id,progress,completed_at) VALUES(?,?,100,CURRENT_TIMESTAMP) ON CONFLICT(user_id,topic_id) DO UPDATE SET progress=100,completed_at=CURRENT_TIMESTAMP',
    args: [res.locals.userId, data.topicId],
  })
  await writeBatch(statements)
  res.status(201).json({ user: await getUserProfile(res.locals.userId), recommendation: await recommend(res.locals.userId) })
}))

app.put('/api/vocabulary/:wordId', auth, asyncRoute(async (req, res) => {
  const parsed = z.object({ status: z.enum(['known', 'weak', 'learning']) }).safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid vocabulary status.' })
    return
  }
  const wordId = String(req.params.wordId)
  const previous = await queryOne<{ status: string; mastery: number; interval_days: number }>(
    'SELECT status,mastery,interval_days FROM vocabulary_progress WHERE user_id=? AND word_id=?',
    [res.locals.userId, wordId],
  )
  const known = parsed.data.status === 'known'
  const interval = known ? Math.min(30, Math.max(3, (previous?.interval_days ?? 3) * 2)) : 1
  const mastery = known ? Math.min(100, (previous?.mastery ?? 50) + 15) : Math.max(10, (previous?.mastery ?? 50) - 10)
  const nextReview = new Date(Date.now() + interval * 86400000).toISOString()
  await run(
    'INSERT INTO vocabulary_progress(user_id,word_id,status,mastery,interval_days,next_review_at) VALUES(?,?,?,?,?,?) ON CONFLICT(user_id,word_id) DO UPDATE SET status=excluded.status,mastery=excluded.mastery,interval_days=excluded.interval_days,next_review_at=excluded.next_review_at,updated_at=CURRENT_TIMESTAMP',
    [res.locals.userId, wordId, parsed.data.status, mastery, interval, nextReview],
  )
  const aggregate = await queryOne<{ score: number | null }>('SELECT AVG(mastery) AS score FROM vocabulary_progress WHERE user_id=?', [res.locals.userId])
  const aggregateScore = Number(aggregate?.score ?? mastery)
  const statements: InStatement[] = [{
    sql: "UPDATE user_skills SET delta=ROUND(?-score),score=ROUND(score*.7+?*.3) WHERE user_id=? AND skill_key='vocabulary'",
    args: [aggregateScore, aggregateScore, res.locals.userId],
  }]
  if (known && previous?.status !== 'known') statements.push({ sql: 'UPDATE users SET xp=xp+5 WHERE id=?', args: [res.locals.userId] })
  await writeBatch(statements)
  res.json({ user: await getUserProfile(res.locals.userId) })
}))

app.post('/api/ai/essay', aiLimit, auth, asyncRoute(async (req, res) => {
  const parsed = z.object({ text: z.string().min(80).max(20000), prompt: z.string().max(2000).default('') }).safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Write at least 80 characters before requesting analysis.' })
    return
  }
  const result = await aiService.analyzeEssay(parsed.data.text, parsed.data.prompt)
  await run('INSERT INTO essays(id,user_id,prompt,content,analysis_json,score) VALUES(?,?,?,?,?,?)', [randomUUID(), res.locals.userId, parsed.data.prompt, parsed.data.text, JSON.stringify(result), result.overall])
  res.json(result)
}))

app.get('/api/essays', auth, asyncRoute(async (_req, res) => {
  const rows = await queryAll<{ id: string; prompt: string; score: number; analysis_json: string; created_at: string }>(
    'SELECT id,prompt,score,analysis_json,created_at FROM essays WHERE user_id=? ORDER BY created_at DESC LIMIT 20',
    [res.locals.userId],
  )
  res.json({ essays: rows.map((row) => {
    let summary = 'Essay feedback'
    try { summary = (JSON.parse(row.analysis_json) as { summary?: string }).summary || summary } catch { /* Legacy data fallback. */ }
    return { id: row.id, prompt: row.prompt || 'Untitled essay', score: row.score, createdAt: row.created_at, summary }
  }) })
}))

app.post('/api/ai/main-idea', aiLimit, auth, asyncRoute(async (req, res) => {
  const parsed = z.object({ answer: z.string().min(10).max(500), expected: z.string().min(1).max(1000) }).safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Write a complete one-sentence summary.' })
    return
  }
  res.json(await aiService.evaluateMainIdea(parsed.data.answer, parsed.data.expected))
}))

app.get('/api/integrated-summary/texts', auth, (_req, res) => {
  res.json({ texts: publicIntegratedSummaryTexts() })
})

app.post('/api/integrated-summary/evaluate', aiLimit, auth, asyncRoute(async (req, res) => {
  const parsed = z.object({ passageId: z.string().min(1), answer: z.string().min(50).max(5000) }).safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Write at least 50 characters before requesting an evaluation.' })
    return
  }
  const passage = integratedSummaryTexts.find((item) => item.id === parsed.data.passageId)
  if (!passage) {
    res.status(404).json({ error: 'Practice text not found.' })
    return
  }
  const baseline = evaluateIntegratedSummary(passage, parsed.data.answer)
  const result = await aiService.evaluateIntegratedSummary(passage, parsed.data.answer, baseline)
  await run('INSERT INTO integrated_summaries(id,user_id,passage_id,response,result_json,score) VALUES(?,?,?,?,?,?)', [randomUUID(), res.locals.userId, passage.id, parsed.data.answer, JSON.stringify(result), result.total])
  res.json(result)
}))

app.get('/api/recommendations', auth, asyncRoute(async (_req, res) => {
  res.json({ recommendation: await recommend(res.locals.userId) })
}))

async function recommend(userId: string) {
  const attempts = await queryAll<{ skill_key: string; mistakes_json: string }>(
    'SELECT skill_key,mistakes_json FROM exercise_attempts WHERE user_id=? ORDER BY created_at DESC LIMIT 20', [userId],
  )
  const counts = new Map<string, { count: number; skill: string }>()
  for (const attempt of attempts) {
    try {
      for (const mistake of JSON.parse(attempt.mistakes_json) as unknown[]) {
        if (typeof mistake !== 'string') continue
        const current = counts.get(mistake) ?? { count: 0, skill: attempt.skill_key }
        current.count++
        counts.set(mistake, current)
      }
    } catch { /* Ignore legacy malformed attempt metadata. */ }
  }
  const repeated = [...counts.entries()].sort((a, b) => b[1].count - a[1].count)[0]
  if (repeated && repeated[1].count >= 2) return {
    skill: repeated[1].skill,
    title: `Practice: ${repeated[0]}`,
    reason: `You have missed ${repeated[0].toLowerCase()} ${repeated[1].count} times in recent sessions.`,
  }
  const user = await queryOne<{ diagnostic_done: number }>('SELECT diagnostic_done FROM users WHERE id=?', [userId])
  if (!user?.diagnostic_done && attempts.length === 0) return {
    skill: 'grammar', title: 'Start with a short diagnostic',
    reason: 'Complete the diagnostic or a practice session to create your measured skill profile.',
  }
  const row = await queryOne<{ skill_key: string; label: string; score: number }>(
    "SELECT skill_key,label,score FROM user_skills WHERE user_id=? AND (attempts>0 OR (?=1 AND skill_key<>'integratedSummary')) ORDER BY score ASC LIMIT 1",
    [userId, user?.diagnostic_done ?? 0],
  )
  if (!row) return {
    skill: 'grammar', title: 'Start with a short diagnostic',
    reason: 'Complete the diagnostic or a practice session to create your measured skill profile.',
  }
  const titles: Record<string, string> = {
    complexGrammar: 'Mixed conditional sentences', writing: 'Sentence accuracy and coherence',
    vocabulary: 'Academic vocabulary review', reading: 'Reading inference', grammar: 'Articles in context',
    mainIdeas: 'Central idea summaries', integratedSummary: 'Integrated skills summary',
  }
  return { skill: row.skill_key, title: titles[row.skill_key] || row.label, reason: `${row.label} is currently your lowest measured skill at ${row.score}%.` }
}

if (!process.env.VERCEL) {
  const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')
  if (existsSync(dist)) {
    app.use(express.static(dist))
    app.get('*path', (_req, res) => res.sendFile(join(dist, 'index.html')))
  }
}

app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(error)
  res.status(500).json({
    error: error.message.includes('AI provider') ? 'AI feedback is temporarily unavailable. Try again shortly.' : 'Unexpected server error.',
  })
})

if (!process.env.VERCEL) {
  app.listen(port, '127.0.0.1', () => console.log(`MadeByAibek API ready at http://127.0.0.1:${port}`))
}

export default app
