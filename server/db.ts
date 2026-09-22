import { DatabaseSync } from 'node:sqlite'
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomUUID } from 'node:crypto'
import { hashPassword } from './security.js'
import { summarizeActivity } from './progress.js'

const here = dirname(fileURLToPath(import.meta.url))
const dataDir = join(here, '..', '.data')
mkdirSync(dataDir, { recursive: true })

export const db = new DatabaseSync(join(dataDir, 'lexora.db'))
db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;')

db.exec(`
  CREATE TABLE IF NOT EXISTS migrations (
    version INTEGER PRIMARY KEY,
    applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    password_salt TEXT NOT NULL,
    level TEXT NOT NULL DEFAULT 'B1',
    level_progress INTEGER NOT NULL DEFAULT 0 CHECK(level_progress BETWEEN 0 AND 100),
    xp INTEGER NOT NULL DEFAULT 0,
    streak INTEGER NOT NULL DEFAULT 1,
    daily_minutes INTEGER NOT NULL DEFAULT 0,
    daily_goal INTEGER NOT NULL DEFAULT 15,
    daily_reminder INTEGER NOT NULL DEFAULT 1,
    last_practice_date TEXT,
    diagnostic_done INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS user_skills (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_key TEXT NOT NULL,
    label TEXT NOT NULL,
    score INTEGER NOT NULL CHECK(score BETWEEN 0 AND 100),
    delta INTEGER NOT NULL DEFAULT 0,
    color TEXT NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY(user_id, skill_key)
  );

  CREATE TABLE IF NOT EXISTS exercise_attempts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    kind TEXT NOT NULL,
    title TEXT NOT NULL,
    skill_key TEXT NOT NULL,
    score INTEGER NOT NULL,
    xp INTEGER NOT NULL,
    duration_seconds INTEGER NOT NULL DEFAULT 0,
    mistakes_json TEXT NOT NULL DEFAULT '[]',
    outcomes_json TEXT NOT NULL DEFAULT '[]',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS vocabulary_progress (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    word_id TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('known','weak','learning')),
    mastery INTEGER NOT NULL DEFAULT 0,
    interval_days INTEGER NOT NULL DEFAULT 1,
    next_review_at TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(user_id, word_id)
  );

  CREATE TABLE IF NOT EXISTS topic_progress (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic_id TEXT NOT NULL,
    progress INTEGER NOT NULL DEFAULT 0,
    completed_at TEXT,
    PRIMARY KEY(user_id, topic_id)
  );

  CREATE TABLE IF NOT EXISTS diagnostic_results (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    scores_json TEXT NOT NULL,
    estimated_level TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS essays (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    prompt TEXT NOT NULL DEFAULT '',
    content TEXT NOT NULL,
    analysis_json TEXT NOT NULL,
    score REAL NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS integrated_summaries (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    passage_id TEXT NOT NULL,
    response TEXT NOT NULL,
    result_json TEXT NOT NULL,
    score REAL NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS password_reset_tokens (
    token_hash TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TEXT NOT NULL,
    used_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_attempts_user_date ON exercise_attempts(user_id, created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON sessions(expires_at);
  INSERT OR IGNORE INTO migrations(version) VALUES (1);
`)

const userColumns=db.prepare('PRAGMA table_info(users)').all() as {name:string}[]
if(!userColumns.some(column=>column.name==='daily_goal'))db.exec('ALTER TABLE users ADD COLUMN daily_goal INTEGER NOT NULL DEFAULT 15')
if(!userColumns.some(column=>column.name==='daily_reminder'))db.exec('ALTER TABLE users ADD COLUMN daily_reminder INTEGER NOT NULL DEFAULT 1')
if(!userColumns.some(column=>column.name==='last_practice_date'))db.exec('ALTER TABLE users ADD COLUMN last_practice_date TEXT')
const attemptColumns=db.prepare('PRAGMA table_info(exercise_attempts)').all() as {name:string}[]
if(!attemptColumns.some(column=>column.name==='outcomes_json'))db.exec("ALTER TABLE exercise_attempts ADD COLUMN outcomes_json TEXT NOT NULL DEFAULT '[]'")
db.prepare('INSERT OR IGNORE INTO migrations(version) VALUES (5)').run()
const demoResetApplied=db.prepare('SELECT version FROM migrations WHERE version=6').get()
if(!demoResetApplied){
  db.exec('BEGIN')
  try{db.prepare('DELETE FROM users WHERE email=?').run('maya@lexora.demo');db.prepare('INSERT INTO migrations(version) VALUES (6)').run();db.exec('COMMIT')}catch(error){db.exec('ROLLBACK');throw error}
}

const skillDefaults = [
  ['grammar','Grammar',72,4,'#627b62'], ['complexGrammar','Complex grammar',48,2,'#8c6b4c'],
  ['vocabulary','Vocabulary',67,6,'#65758b'], ['reading','Reading',81,3,'#6f6685'],
  ['writing','Writing',59,5,'#9a655c'], ['mainIdeas','Main ideas',74,4,'#6c827c'],
  ['integratedSummary','Integrated summary',0,0,'#7b6d58'],
] as const

if(!db.prepare('SELECT version FROM migrations WHERE version=7').get()){
  db.prepare(`INSERT OR IGNORE INTO user_skills(user_id,skill_key,label,score,delta,color) SELECT id,'integratedSummary','Integrated summary',0,0,'#7b6d58' FROM users`).run()
  db.prepare('INSERT INTO migrations(version) VALUES (7)').run()
}

export function createUser(name: string, email: string, password: string) {
  const id = randomUUID(); const secured = hashPassword(password)
  db.prepare(`INSERT INTO users(id,name,email,password_hash,password_salt,level,level_progress,xp,streak,daily_minutes,diagnostic_done)
    VALUES(?,?,?,?,?,?,?,?,?,?,?)`).run(id,name,email,secured.hash,secured.salt,'B1',0,0,0,0,0)
  const insertSkill = db.prepare('INSERT INTO user_skills(user_id,skill_key,label,score,delta,color) VALUES(?,?,?,?,?,?)')
  for (const [key,label,_score,_delta,color] of skillDefaults) insertSkill.run(id,key,label,0,0,color)
  return id
}

if (!db.prepare('SELECT id FROM users WHERE email = ?').get('maya@lexora.demo')) createUser('Maya','maya@lexora.demo','lexora')

export function getUserProfile(userId: string) {
  const user = db.prepare('SELECT id,name,email,level,xp,daily_goal,daily_reminder,diagnostic_done FROM users WHERE id=?').get(userId) as Record<string, unknown> | undefined
  if (!user) return null
  const skills = db.prepare('SELECT skill_key,label,score,delta,color,attempts FROM user_skills WHERE user_id=? ORDER BY rowid').all(userId) as Record<string, unknown>[]
  const activities = db.prepare('SELECT id,kind,title,score,xp,created_at FROM exercise_attempts WHERE user_id=? ORDER BY created_at DESC LIMIT 8').all(userId) as Record<string, unknown>[]
  const vocab = db.prepare('SELECT word_id,status,mastery,next_review_at FROM vocabulary_progress WHERE user_id=?').all(userId) as {word_id:string,status:'known'|'weak'|'learning',mastery:number,next_review_at:string}[]
  const topics = db.prepare('SELECT topic_id,progress FROM topic_progress WHERE user_id=?').all(userId) as {topic_id:string,progress:number}[]
  const attemptLedger=db.prepare('SELECT created_at,duration_seconds,xp FROM exercise_attempts WHERE user_id=?').all(userId) as {created_at:string,duration_seconds:number,xp:number}[]
  const activity=summarizeActivity(attemptLedger)
  const diagnostic=db.prepare('SELECT scores_json FROM diagnostic_results WHERE user_id=? ORDER BY created_at DESC LIMIT 1').get(userId) as {scores_json:string}|undefined
  let diagnosticScores:Record<string,number>={}
  try{diagnosticScores=diagnostic?JSON.parse(diagnostic.scores_json) as Record<string,number>:{} }catch{/* Ignore legacy malformed diagnostics. */}
  const skillProfiles=skills.map(s=>({key:s.skill_key,label:s.label,score:s.score,delta:s.delta,color:s.color,attempts:s.attempts,assessed:Number(s.attempts)>0||Object.hasOwn(diagnosticScores,String(s.skill_key))||Boolean(s.skill_key!=='integratedSummary'&&user.diagnostic_done&&!diagnostic)}))
  const assessedScores=skillProfiles.filter(skill=>skill.assessed).map(skill=>Number(skill.score))
  const levelProgress=assessedScores.length?Math.round(assessedScores.reduce((sum,score)=>sum+score,0)/assessedScores.length):0
  const readingSkills:Record<string,number>={}
  const readingAttempts=db.prepare("SELECT outcomes_json FROM exercise_attempts WHERE user_id=? AND skill_key='reading' ORDER BY created_at DESC LIMIT 20").all(userId) as {outcomes_json:string}[]
  const readingResults=new Map<string,{correct:number,total:number}>()
  for(const attempt of readingAttempts){try{for(const outcome of JSON.parse(attempt.outcomes_json) as unknown[]){if(!outcome||typeof outcome!=='object')continue;const item=outcome as {skill?:unknown;correct?:unknown};if(typeof item.skill!=='string'||typeof item.correct!=='boolean')continue;const current=readingResults.get(item.skill)??{correct:0,total:0};current.total++;if(item.correct)current.correct++;readingResults.set(item.skill,current)}}catch{/* Ignore legacy metadata. */}}
  for(const [skill,result] of readingResults)readingSkills[skill]=Math.round(result.correct/result.total*100)
  const topicProgress=Object.fromEntries(topics.map(topic=>[topic.topic_id,topic.progress]))
  const now=Date.now()
  const vocabularyProgress=Object.fromEntries(vocab.map(word=>[word.word_id,{status:word.status,mastery:word.mastery,nextReviewAt:word.next_review_at,due:new Date(word.next_review_at).getTime()<=now}]))
  return {
    id:user.id, name:user.name, email:user.email, level:user.level, levelProgress,
    xp:user.xp, streak:activity.streak, dailyMinutes:activity.dailyMinutes, dailyGoal:user.daily_goal, reminderEnabled:Boolean(user.daily_reminder), diagnosticDone:Boolean(user.diagnostic_done),
    skills:skillProfiles,
    activities:activities.map(a=>({id:a.id,kind:a.kind,title:a.title,score:a.score,xp:a.xp,date:formatDate(String(a.created_at))})),
    knownWords:vocab.filter(v=>v.status==='known').map(v=>v.word_id), weakWords:vocab.filter(v=>v.status==='weak').map(v=>v.word_id),
    completedTopics:topics.filter(topic=>topic.progress===100).map(topic=>topic.topic_id), topicProgress, weeklyMinutes:activity.weeklyActivity.map(day=>day.minutes), weeklyActivity:activity.weeklyActivity, totalAttempts:activity.totalAttempts, totalMinutes:activity.totalMinutes, readingSkills, weeklyXp:activity.weeklyXp, vocabularyProgress,
    achievements:[
      {id:'week-warrior',title:'Week warrior',description:'Practice for 7 days in a row',earned:activity.streak>=7},
      {id:'practice-builder',title:'Practice builder',description:'Complete 10 learning sessions',earned:activity.totalAttempts>=10},
      {id:'word-collector',title:'Word collector',description:'Master 10 vocabulary words',earned:vocab.filter(v=>v.status==='known').length>=10},
      {id:'topic-explorer',title:'Topic explorer',description:'Complete 3 grammar topics',earned:topics.length>=3},
    ],
  }
}

function formatDate(value:string){const date=new Date(value);const days=Math.floor((Date.now()-date.getTime())/86400000);if(days<1)return'Today';if(days===1)return'Yesterday';return date.toLocaleDateString('en-US',{month:'short',day:'numeric'})}
