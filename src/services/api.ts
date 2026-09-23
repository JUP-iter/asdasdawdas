import type { ActivityInput, EssayAnalysis, EssayRecord, IntegratedSummaryAttempt, IntegratedSummaryResult, IntegratedSummaryText, LearningRecommendation, SkillKey, UserProfile } from '../types'

async function request<T>(path:string, options:RequestInit={}) {
  const response=await fetch(`/api${path}`,{...options,signal:options.signal??AbortSignal.timeout(20000),credentials:'include',headers:{'content-type':'application/json',...options.headers}})
  if(response.status===204)return undefined as T
  const data=await response.json().catch(()=>({error:'The server returned an invalid response.'}))
  if(!response.ok)throw new Error(data.error||'Request failed.')
  return data as T
}

export const api={
  me:()=>request<{user:UserProfile}>('/me'),
  login:(email:string,password:string)=>request<{user:UserProfile}>('/auth/login',{method:'POST',body:JSON.stringify({email,password})}),
  signup:(name:string,email:string,password:string)=>request<{user:UserProfile}>('/auth/signup',{method:'POST',body:JSON.stringify({name,email,password})}),
  logout:()=>request<void>('/auth/logout',{method:'POST'}),
  resetPassword:(email:string)=>request<{message:string;devResetToken?:string}>('/auth/password-reset',{method:'POST',body:JSON.stringify({email})}),
  confirmPasswordReset:(token:string,password:string)=>request<{message:string}>('/auth/password-reset/confirm',{method:'POST',body:JSON.stringify({token,password})}),
  updateProfile:(patch:Pick<Partial<UserProfile>,'name'|'dailyGoal'|'reminderEnabled'>)=>request<{user:UserProfile}>('/me',{method:'PATCH',body:JSON.stringify(patch)}),
  deleteAccount:(password:string)=>request<void>('/me',{method:'DELETE',body:JSON.stringify({password})}),
  diagnostic:(scores:Record<string,number>)=>request<{user:UserProfile}>('/diagnostic',{method:'POST',body:JSON.stringify({scores})}),
  attempt:(activity:ActivityInput,skill:SkillKey,topicId?:string)=>request<{user:UserProfile;recommendation:LearningRecommendation}>('/attempts',{method:'POST',body:JSON.stringify({...activity,skill,topicId,durationSeconds:activity.durationSeconds??0,mistakes:activity.mistakes??[],outcomes:activity.outcomes??[]})}),
  vocabulary:(wordId:string,status:'known'|'weak'|'learning')=>request<{user:UserProfile}>(`/vocabulary/${encodeURIComponent(wordId)}`,{method:'PUT',body:JSON.stringify({status})}),
  essay:(text:string,prompt='')=>request<EssayAnalysis>('/ai/essay',{method:'POST',body:JSON.stringify({text,prompt})}),
  essays:()=>request<{essays:EssayRecord[]}>('/essays'),
  mainIdea:(answer:string,expected:string)=>request<{score:number;feedback:string}>('/ai/main-idea',{method:'POST',body:JSON.stringify({answer,expected})}),
  integratedSummaryTexts:()=>request<{texts:IntegratedSummaryText[]}>('/integrated-summary/texts'),
  integratedSummaryAttempts:()=>request<{attempts:IntegratedSummaryAttempt[]}>('/integrated-summary/attempts'),
  evaluateIntegratedSummary:(passageId:string,answer:string)=>request<IntegratedSummaryResult>('/integrated-summary/evaluate',{method:'POST',body:JSON.stringify({passageId,answer})}),
  recommendation:()=>request<{recommendation:LearningRecommendation}>('/recommendations'),
}
