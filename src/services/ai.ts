import { api } from './api'

export interface AIService {
  analyzeEssay(text:string,prompt?:string):ReturnType<typeof api.essay>
  evaluateMainIdea(answer:string,expected:string):ReturnType<typeof api.mainIdea>
}

export const aiService:AIService={
  analyzeEssay:(text,prompt)=>api.essay(text,prompt),
  evaluateMainIdea:(answer,expected)=>api.mainIdea(answer,expected),
}
