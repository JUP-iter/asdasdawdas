export type SkillKey = 'grammar' | 'complexGrammar' | 'vocabulary' | 'reading' | 'writing' | 'mainIdeas' | 'integratedSummary'
export type Level = 'A1' | 'A2' | 'B1' | 'B1+' | 'B2' | 'C1'

export interface SkillScore { key: SkillKey; label: string; score: number; delta: number; color: string; attempts?: number; assessed?: boolean }
export interface QuestionResult { skill: string; correct: boolean }
export interface DailyActivity { date: string; minutes: number; xp: number }
export interface VocabularyProgress { status: 'known'|'weak'|'learning'; mastery: number; nextReviewAt: string; due: boolean }
export interface Question {
  id: string
  prompt: string
  options: string[]
  answer: number
  explanation: string
  skill: string
  level: string
}
export interface Topic {
  id: string
  title: string
  description: string
  level: string
  progress: number
  lessons: number
  duration: number
  locked?: boolean
  accent?: string
  questions: Question[]
}
export interface VocabularyWord {
  id: string
  word: string
  pronunciation: string
  level: string
  definition: string
  example: string
  synonyms: string[]
  antonyms?: string[]
  collocations: string[]
  family: string[]
  mastery: number
}
export interface ReadingPassage {
  id: string
  title: string
  category: string
  level: string
  minutes: number
  text: string[]
  questions: Question[]
}
export interface Activity { id: string; kind: string; title: string; score: number; date: string; xp: number }
export interface UserProfile {
  id: string
  name: string
  email: string
  password?: string
  level: Level
  levelProgress: number
  xp: number
  streak: number
  dailyMinutes: number
  dailyGoal?: number
  reminderEnabled?: boolean
  totalAttempts?: number
  totalMinutes?: number
  readingSkills?: Record<string,number>
  weeklyXp?: number
  weeklyActivity?: DailyActivity[]
  topicProgress?: Record<string,number>
  vocabularyProgress?: Record<string,VocabularyProgress>
  achievements?: { id:string; title:string; description:string; earned:boolean }[]
  diagnosticDone: boolean
  skills: SkillScore[]
  activities: Activity[]
  knownWords: string[]
  weakWords: string[]
  completedTopics: string[]
  weeklyMinutes: number[]
}
export type ActivityInput = Omit<Activity,'id'|'date'> & { mistakes?:string[]; durationSeconds?:number; outcomes?:QuestionResult[] }
export interface EssayAnalysis {
  overall: number
  scores: { grammar: number; vocabulary: number; coherence: number; taskResponse: number }
  summary: string
  errors: { original: string; correction: string; explanation: string; type: string }[]
  patterns: string[]
  strengths: string[]
}
export interface IntegratedSummaryText {
  id:string
  title:string
  subtitle:string
  topic:string
  level:string
  readingMinutes:number
  sourceLabel:string
  paragraphs:string[]
  glossary:{term:string;definition:string}[]
}
export interface RubricCriterion {
  score:number
  maximum:number
  band:'Insufficient sample'|'Weak'|'Satisfactory'|'Good'|'Excellent'
  feedback:string
}
export interface IntegratedSummaryResult {
  total:number
  maximum:number
  percent:number
  wordCount:number
  paragraphCount:number
  copiedPercent:number
  rubric:{taskAchievement:RubricCriterion;organization:RubricCriterion;language:RubricCriterion}
  strengths:string[]
  nextSteps:string[]
  flags:string[]
  feedback:string
  improvedSummary:string
  annotations:SummaryAnnotation[]
  mainIdeas:SummaryMainIdea[]
  evaluationMode:'ai'|'deterministic'
  evaluationModel?:string
  selfCheck?:boolean
  sourceTitle?:string
  sourceText?:string
}
export interface SummaryAnnotation { start:number; end:number; type:'organization'|'language'|'source-use'|'opinion'; message:string }
export interface SummaryMainIdea { label:string; paragraphIndex:number; keywords:string[] }
export interface IntegratedSummaryAttempt {
  id:string
  passageId:string
  title:string
  topic:string
  response:string
  score:number
  percent:number
  wordCount:number
  createdAt:string
  result:IntegratedSummaryResult|null
}
export interface LearningRecommendation { skill: string; title: string; reason: string }
export interface EssayRecord { id:string; prompt:string; score:number; createdAt:string; summary:string }
