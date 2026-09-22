import { createClient, type InStatement, type InValue } from '@libsql/client'
import { randomUUID } from 'node:crypto'
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { loadEnvFile } from 'node:process'
import { fileURLToPath } from 'node:url'
import { hashPassword } from './security.js'
import { summarizeActivity } from './progress.js'

try{loadEnvFile()}catch{/* Vercel and other hosts inject variables directly. */}

const here=dirname(fileURLToPath(import.meta.url))
const remoteUrl=process.env.TURSO_DATABASE_URL?.trim()
if(process.env.VERCEL&&!remoteUrl)throw new Error('TURSO_DATABASE_URL is required on Vercel so progress can be stored persistently.')
if(remoteUrl&&!process.env.TURSO_AUTH_TOKEN?.trim())throw new Error('TURSO_AUTH_TOKEN is required when TURSO_DATABASE_URL is configured.')
const localDir=join(here,'..','.data')
if(!remoteUrl)mkdirSync(localDir,{recursive:true})

export const db=createClient({
  url:remoteUrl||`file:${join(localDir,'lexora.db').replaceAll('\\','/')}`,
  authToken:remoteUrl?process.env.TURSO_AUTH_TOKEN:undefined,
})

const schema=[
  `CREATE TABLE IF NOT EXISTS migrations (version INTEGER PRIMARY KEY, applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,name TEXT NOT NULL,email TEXT NOT NULL UNIQUE COLLATE NOCASE,password_hash TEXT NOT NULL,password_salt TEXT NOT NULL,
    level TEXT NOT NULL DEFAULT 'B1',level_progress INTEGER NOT NULL DEFAULT 0 CHECK(level_progress BETWEEN 0 AND 100),xp INTEGER NOT NULL DEFAULT 0,
    streak INTEGER NOT NULL DEFAULT 1,daily_minutes INTEGER NOT NULL DEFAULT 0,daily_goal INTEGER NOT NULL DEFAULT 15,daily_reminder INTEGER NOT NULL DEFAULT 1,
    last_practice_date TEXT,diagnostic_done INTEGER NOT NULL DEFAULT 0,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,expires_at TEXT NOT NULL,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS user_skills (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,skill_key TEXT NOT NULL,label TEXT NOT NULL,score INTEGER NOT NULL CHECK(score BETWEEN 0 AND 100),
    delta INTEGER NOT NULL DEFAULT 0,color TEXT NOT NULL,attempts INTEGER NOT NULL DEFAULT 0,PRIMARY KEY(user_id,skill_key)
  )`,
  `CREATE TABLE IF NOT EXISTS exercise_attempts (
    id TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,kind TEXT NOT NULL,title TEXT NOT NULL,skill_key TEXT NOT NULL,
    score INTEGER NOT NULL,xp INTEGER NOT NULL,duration_seconds INTEGER NOT NULL DEFAULT 0,mistakes_json TEXT NOT NULL DEFAULT '[]',outcomes_json TEXT NOT NULL DEFAULT '[]',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS vocabulary_progress (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,word_id TEXT NOT NULL,status TEXT NOT NULL CHECK(status IN ('known','weak','learning')),
    mastery INTEGER NOT NULL DEFAULT 0,interval_days INTEGER NOT NULL DEFAULT 1,next_review_at TEXT NOT NULL,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY(user_id,word_id)
  )`,
  `CREATE TABLE IF NOT EXISTS topic_progress (user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,topic_id TEXT NOT NULL,progress INTEGER NOT NULL DEFAULT 0,completed_at TEXT,PRIMARY KEY(user_id,topic_id))`,
  `CREATE TABLE IF NOT EXISTS diagnostic_results (id TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,scores_json TEXT NOT NULL,estimated_level TEXT NOT NULL,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS essays (id TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,prompt TEXT NOT NULL DEFAULT '',content TEXT NOT NULL,analysis_json TEXT NOT NULL,score REAL NOT NULL,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS integrated_summaries (id TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,passage_id TEXT NOT NULL,response TEXT NOT NULL,result_json TEXT NOT NULL,score REAL NOT NULL,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS password_reset_tokens (token_hash TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,expires_at TEXT NOT NULL,used_at TEXT,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE INDEX IF NOT EXISTS idx_attempts_user_date ON exercise_attempts(user_id,created_at DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON sessions(expires_at)`,
  `INSERT OR IGNORE INTO migrations(version) VALUES (1)`,
]

const skillDefaults=[
  ['grammar','Grammar','#627b62'],['complexGrammar','Complex grammar','#8c6b4c'],['vocabulary','Vocabulary','#65758b'],
  ['reading','Reading','#6f6685'],['writing','Writing','#9a655c'],['mainIdeas','Main ideas','#6c827c'],['integratedSummary','Integrated summary','#7b6d58'],
] as const

let initialization:Promise<void>|undefined

const rawOne=async<T>(sql:string,args:InValue[]=[]):Promise<T|undefined>=>{
  const result=await db.execute({sql,args})
  return result.rows[0] as unknown as T|undefined
}

async function insertUser(name:string,email:string,password:string){
  const id=randomUUID(),secured=hashPassword(password)
  const statements:InStatement[]=[
    {sql:`INSERT INTO users(id,name,email,password_hash,password_salt,level,level_progress,xp,streak,daily_minutes,diagnostic_done) VALUES(?,?,?,?,?,?,?,?,?,?,?)`,args:[id,name,email,secured.hash,secured.salt,'B1',0,0,0,0,0]},
    ...skillDefaults.map(([key,label,color])=>({sql:'INSERT INTO user_skills(user_id,skill_key,label,score,delta,color) VALUES(?,?,?,?,?,?)',args:[id,key,label,0,0,color]})),
  ]
  await db.batch(statements,'write')
  return id
}

async function initializeDatabase(){
  await db.batch(schema.map(sql=>({sql,args:[]})),'write')
  const userColumns=(await db.execute('PRAGMA table_info(users)')).rows as unknown as {name:string}[]
  if(!userColumns.some(column=>column.name==='daily_goal'))await db.execute('ALTER TABLE users ADD COLUMN daily_goal INTEGER NOT NULL DEFAULT 15')
  if(!userColumns.some(column=>column.name==='daily_reminder'))await db.execute('ALTER TABLE users ADD COLUMN daily_reminder INTEGER NOT NULL DEFAULT 1')
  if(!userColumns.some(column=>column.name==='last_practice_date'))await db.execute('ALTER TABLE users ADD COLUMN last_practice_date TEXT')
  const attemptColumns=(await db.execute('PRAGMA table_info(exercise_attempts)')).rows as unknown as {name:string}[]
  if(!attemptColumns.some(column=>column.name==='outcomes_json'))await db.execute("ALTER TABLE exercise_attempts ADD COLUMN outcomes_json TEXT NOT NULL DEFAULT '[]'")
  await db.execute(`INSERT OR IGNORE INTO user_skills(user_id,skill_key,label,score,delta,color) SELECT id,'integratedSummary','Integrated summary',0,0,'#7b6d58' FROM users`)
  await db.execute('INSERT OR IGNORE INTO migrations(version) VALUES (7)')
  if(!remoteUrl&&!await rawOne<{id:string}>('SELECT id FROM users WHERE email=?',['maya@lexora.demo']))await insertUser('Maya','maya@lexora.demo','lexora')
}

export function ensureDatabase(){return initialization??=(initializeDatabase().catch(error=>{initialization=undefined;throw error}))}

export async function queryOne<T>(sql:string,args:InValue[]=[]){await ensureDatabase();return rawOne<T>(sql,args)}
export async function queryAll<T>(sql:string,args:InValue[]=[]){await ensureDatabase();return (await db.execute({sql,args})).rows as unknown as T[]}
export async function run(sql:string,args:InValue[]=[]){await ensureDatabase();return db.execute({sql,args})}
export async function writeBatch(statements:InStatement[]){await ensureDatabase();return db.batch(statements,'write')}

export async function createUser(name:string,email:string,password:string){await ensureDatabase();return insertUser(name,email,password)}

export async function getUserProfile(userId:string){
  await ensureDatabase()
  const [user,skills,activities,vocab,topics,attemptLedger,diagnostic,readingAttempts]=await Promise.all([
    rawOne<Record<string,unknown>>('SELECT id,name,email,level,xp,daily_goal,daily_reminder,diagnostic_done FROM users WHERE id=?',[userId]),
    db.execute({sql:'SELECT skill_key,label,score,delta,color,attempts FROM user_skills WHERE user_id=? ORDER BY rowid',args:[userId]}),
    db.execute({sql:'SELECT id,kind,title,score,xp,created_at FROM exercise_attempts WHERE user_id=? ORDER BY created_at DESC LIMIT 8',args:[userId]}),
    db.execute({sql:'SELECT word_id,status,mastery,next_review_at FROM vocabulary_progress WHERE user_id=?',args:[userId]}),
    db.execute({sql:'SELECT topic_id,progress FROM topic_progress WHERE user_id=?',args:[userId]}),
    db.execute({sql:'SELECT created_at,duration_seconds,xp FROM exercise_attempts WHERE user_id=?',args:[userId]}),
    rawOne<{scores_json:string}>('SELECT scores_json FROM diagnostic_results WHERE user_id=? ORDER BY created_at DESC LIMIT 1',[userId]),
    db.execute({sql:"SELECT outcomes_json FROM exercise_attempts WHERE user_id=? AND skill_key='reading' ORDER BY created_at DESC LIMIT 20",args:[userId]}),
  ])
  if(!user)return null
  const skillRows=skills.rows as unknown as Record<string,unknown>[]
  const activityRows=activities.rows as unknown as Record<string,unknown>[]
  const vocabRows=vocab.rows as unknown as {word_id:string;status:'known'|'weak'|'learning';mastery:number;next_review_at:string}[]
  const topicRows=topics.rows as unknown as {topic_id:string;progress:number}[]
  const ledger=(attemptLedger.rows as unknown as {created_at:string;duration_seconds:number;xp:number}[]).map(item=>({...item,duration_seconds:Number(item.duration_seconds),xp:Number(item.xp)}))
  const activity=summarizeActivity(ledger)
  let diagnosticScores:Record<string,number>={}
  try{diagnosticScores=diagnostic?JSON.parse(diagnostic.scores_json) as Record<string,number>:{} }catch{/* Ignore malformed legacy diagnostics. */}
  const skillProfiles=skillRows.map(skill=>({key:String(skill.skill_key),label:String(skill.label),score:Number(skill.score),delta:Number(skill.delta),color:String(skill.color),attempts:Number(skill.attempts),assessed:Number(skill.attempts)>0||Object.hasOwn(diagnosticScores,String(skill.skill_key))||Boolean(skill.skill_key!=='integratedSummary'&&user.diagnostic_done&&!diagnostic)}))
  const assessedScores=skillProfiles.filter(skill=>skill.assessed).map(skill=>skill.score)
  const levelProgress=assessedScores.length?Math.round(assessedScores.reduce((sum,score)=>sum+score,0)/assessedScores.length):0
  const readingSkills:Record<string,number>={},readingResults=new Map<string,{correct:number;total:number}>()
  for(const attempt of readingAttempts.rows as unknown as {outcomes_json:string}[]){try{for(const outcome of JSON.parse(attempt.outcomes_json) as unknown[]){if(!outcome||typeof outcome!=='object')continue;const item=outcome as {skill?:unknown;correct?:unknown};if(typeof item.skill!=='string'||typeof item.correct!=='boolean')continue;const current=readingResults.get(item.skill)??{correct:0,total:0};current.total++;if(item.correct)current.correct++;readingResults.set(item.skill,current)}}catch{/* Ignore malformed legacy metadata. */}}
  for(const [skill,result] of readingResults)readingSkills[skill]=Math.round(result.correct/result.total*100)
  const topicProgress=Object.fromEntries(topicRows.map(topic=>[topic.topic_id,Number(topic.progress)])),now=Date.now()
  const vocabularyProgress=Object.fromEntries(vocabRows.map(word=>[word.word_id,{status:word.status,mastery:Number(word.mastery),nextReviewAt:word.next_review_at,due:new Date(word.next_review_at).getTime()<=now}]))
  return{
    id:String(user.id),name:String(user.name),email:String(user.email),level:String(user.level),levelProgress,xp:Number(user.xp),streak:activity.streak,dailyMinutes:activity.dailyMinutes,
    dailyGoal:Number(user.daily_goal),reminderEnabled:Boolean(user.daily_reminder),diagnosticDone:Boolean(user.diagnostic_done),skills:skillProfiles,
    activities:activityRows.map(item=>({id:String(item.id),kind:String(item.kind),title:String(item.title),score:Number(item.score),xp:Number(item.xp),date:formatDate(String(item.created_at))})),
    knownWords:vocabRows.filter(word=>word.status==='known').map(word=>word.word_id),weakWords:vocabRows.filter(word=>word.status==='weak').map(word=>word.word_id),
    completedTopics:topicRows.filter(topic=>Number(topic.progress)===100).map(topic=>topic.topic_id),topicProgress,weeklyMinutes:activity.weeklyActivity.map(day=>day.minutes),weeklyActivity:activity.weeklyActivity,
    totalAttempts:activity.totalAttempts,totalMinutes:activity.totalMinutes,readingSkills,weeklyXp:activity.weeklyXp,vocabularyProgress,
    achievements:[
      {id:'week-warrior',title:'Week warrior',description:'Practice for 7 days in a row',earned:activity.streak>=7},
      {id:'practice-builder',title:'Practice builder',description:'Complete 10 learning sessions',earned:activity.totalAttempts>=10},
      {id:'word-collector',title:'Word collector',description:'Master 10 vocabulary words',earned:vocabRows.filter(word=>word.status==='known').length>=10},
      {id:'topic-explorer',title:'Topic explorer',description:'Complete 3 grammar topics',earned:topicRows.length>=3},
    ],
  }
}

function formatDate(value:string){const date=new Date(value);const days=Math.floor((Date.now()-date.getTime())/86400000);if(days<1)return'Today';if(days===1)return'Yesterday';return date.toLocaleDateString('en-US',{month:'short',day:'numeric'})}
