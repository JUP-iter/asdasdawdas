import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import type { ActivityInput, LearningRecommendation, SkillKey, UserProfile } from '../types'

type SignResult={ok:true}|{ok:false;error:string}
interface AppContextValue {
  user:UserProfile|null
  ready:boolean
  recommendation:LearningRecommendation|null
  login(email:string,password:string):Promise<SignResult>
  signup(name:string,email:string,password:string):Promise<SignResult>
  logout():Promise<void>
  deleteAccount(password:string):Promise<void>
  updateUser(patch:Pick<Partial<UserProfile>,'name'|'dailyGoal'|'reminderEnabled'>):Promise<void>
  completeDiagnostic(scores:Record<string,number>):Promise<void>
  recordActivity(activity:ActivityInput,skill:SkillKey,topicId?:string):Promise<void>
  updateVocabulary(wordId:string,status:'known'|'weak'|'learning'):Promise<void>
}
const AppContext=createContext<AppContextValue|null>(null)

export function AppProvider({children}:{children:ReactNode}){
  const[user,setUser]=useState<UserProfile|null>(null);const[recommendation,setRecommendation]=useState<LearningRecommendation|null>(null);const[ready,setReady]=useState(false);const navigate=useNavigate()
  useEffect(()=>{api.me().then(async r=>{setUser(r.user);const next=await api.recommendation();setRecommendation(next.recommendation)}).catch(()=>setUser(null)).finally(()=>setReady(true))},[])
  const value=useMemo<AppContextValue>(()=>({
    user,ready,recommendation,
    async login(email,password){try{const r=await api.login(email,password);setUser(r.user);const next=await api.recommendation();setRecommendation(next.recommendation);return{ok:true}}catch(error){return{ok:false,error:error instanceof Error?error.message:'Unable to log in.'}}},
    async signup(name,email,password){try{const r=await api.signup(name,email,password);setUser(r.user);const next=await api.recommendation();setRecommendation(next.recommendation);return{ok:true}}catch(error){return{ok:false,error:error instanceof Error?error.message:'Unable to create account.'}}},
    async logout(){try{await api.logout()}finally{setUser(null);setRecommendation(null);navigate('/')}},
    async deleteAccount(password){await api.deleteAccount(password);setUser(null);setRecommendation(null);navigate('/')},
    async updateUser(patch){const r=await api.updateProfile({name:patch.name,dailyGoal:patch.dailyGoal,reminderEnabled:patch.reminderEnabled});setUser(r.user)},
    async completeDiagnostic(scores){const r=await api.diagnostic(scores);setUser(r.user);const next=await api.recommendation();setRecommendation(next.recommendation)},
    async recordActivity(activity,skill,topicId){const r=await api.attempt(activity,skill,topicId);setUser(r.user);setRecommendation(r.recommendation)},
    async updateVocabulary(wordId,status){const r=await api.vocabulary(wordId,status);setUser(r.user)},
  }),[user,ready,recommendation,navigate])
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
export function useApp(){const ctx=useContext(AppContext);if(!ctx)throw new Error('useApp must be used inside AppProvider');return ctx}
