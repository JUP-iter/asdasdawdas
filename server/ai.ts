import { z } from 'zod'
import { prompts } from './prompts.js'
import type { IntegratedSummaryResult, IntegratedSummaryText, RubricCriterion } from './integratedSummary.js'

const EssaySchema = z.object({
  overall:z.number().min(0).max(9),
  scores:z.object({grammar:z.number(),vocabulary:z.number(),coherence:z.number(),taskResponse:z.number()}),
  summary:z.string(),
  errors:z.array(z.object({original:z.string(),correction:z.string(),explanation:z.string(),type:z.string()})),
  patterns:z.array(z.string()), strengths:z.array(z.string()),
})
const MainIdeaSchema=z.object({score:z.number().min(0).max(100),feedback:z.string()})
const IntegratedSummaryReviewSchema=z.object({
  taskAchievement:z.object({score:z.number().min(0).max(20),feedback:z.string().min(1)}),
  organization:z.object({score:z.number().min(0).max(10),feedback:z.string().min(1)}),
  language:z.object({score:z.number().min(0).max(10),feedback:z.string().min(1)}),
  strengths:z.array(z.string().min(1)).max(4),
  nextSteps:z.array(z.string().min(1)).max(5),
  feedback:z.string().min(1),
  annotations:z.array(z.object({quote:z.string().min(1),type:z.enum(['organization','language','source-use','opinion']),message:z.string().min(1)})).max(12),
  improvedSummary:z.string().min(1),
})
export type EssayResult=z.infer<typeof EssaySchema>

async function providerJson(prompt:string) {
  const provider=process.env.AI_PROVIDER?.toLowerCase()
  if(!provider||provider==='mock'||!process.env.AI_API_KEY)return null
  let url:string,body:unknown
  if(provider==='deepseek'){
    const baseUrl=(process.env.AI_BASE_URL||'https://api.deepseek.com').replace(/\/$/,'')
    url=`${baseUrl}/chat/completions`
    body={model:process.env.AI_MODEL||'deepseek-flash',messages:[{role:'system',content:'You are a careful English assessment specialist. Return valid JSON only.'},{role:'user',content:prompt}],response_format:{type:'json_object'},thinking:{type:'disabled'},max_tokens:3000}
  }else if(provider==='openai'){
    url='https://api.openai.com/v1/responses'
    body={model:process.env.AI_MODEL||'gpt-5-mini',input:prompt,text:{format:{type:'json_object'}}}
  }else throw new Error(`AI provider is not supported: ${provider}`)
  const response=await fetch(url,{method:'POST',headers:{'content-type':'application/json',authorization:`Bearer ${process.env.AI_API_KEY}`},body:JSON.stringify(body),signal:AbortSignal.timeout(60_000)})
  if(!response.ok)throw new Error(`AI provider failed (${response.status})`)
  const data=await response.json() as {output_text?:string;output?:{content?:{type?:string;text?:string}[]}[];choices?:{message?:{content?:string|null}}[]}
  const content=provider==='deepseek'?data.choices?.[0]?.message?.content:data.output_text??data.output?.flatMap(item=>item.content??[]).find(item=>item.type==='output_text')?.text
  if(!content)throw new Error('AI provider returned no structured output')
  try{return JSON.parse(content.replace(/^```json\s*|\s*```$/g,''))}catch{throw new Error('AI provider returned malformed JSON')}
}

const reviewBand=(score:number,maximum:number):RubricCriterion['band']=>score===0?'Insufficient sample':score/maximum<=.4?'Weak':score/maximum<=.7?'Satisfactory':score/maximum<1?'Good':'Excellent'
const boundedScore=(score:number,maximum:number)=>Math.min(maximum,Math.max(0,Math.round(score*2)/2))
const modelName=()=>process.env.AI_MODEL||(process.env.AI_PROVIDER?.toLowerCase()==='deepseek'?'deepseek-flash':'gpt-5-mini')

function mergeIntegratedReview(baseline:IntegratedSummaryResult,generated:z.infer<typeof IntegratedSummaryReviewSchema>,answer:string){
  const taskCeiling=baseline.copiedPercent>=50?8:baseline.wordCount<150||baseline.wordCount>250||baseline.paragraphCount!==1||baseline.flags.some(flag=>flag.includes('Personal opinion'))?14:20
  const organizationCeiling=baseline.paragraphCount===1?10:7
  const languageCeiling=baseline.copiedPercent>=50?4:10
  const taskScore=boundedScore(generated.taskAchievement.score,taskCeiling),organizationScore=boundedScore(generated.organization.score,organizationCeiling),languageScore=boundedScore(generated.language.score,languageCeiling)
  const rubric={
    taskAchievement:{score:taskScore,maximum:20,band:reviewBand(taskScore,20),feedback:generated.taskAchievement.feedback},
    organization:{score:organizationScore,maximum:10,band:reviewBand(organizationScore,10),feedback:generated.organization.feedback},
    language:{score:languageScore,maximum:10,band:reviewBand(languageScore,10),feedback:generated.language.feedback},
  }
  const annotations=[...baseline.annotations]
  for(const item of generated.annotations){const start=answer.toLowerCase().indexOf(item.quote.toLowerCase());const end=start+item.quote.length;if(start>=0&&!annotations.some(existing=>start<existing.end&&end>existing.start))annotations.push({start,end,type:item.type,message:item.message})}
  const improvedWords=generated.improvedSummary.trim().split(/\s+/).length
  const improvedSummary=improvedWords>=150&&improvedWords<=250&&!/\n\s*\n/.test(generated.improvedSummary)?generated.improvedSummary.trim():baseline.improvedSummary
  const total=taskScore+organizationScore+languageScore
  return {...baseline,total,percent:Math.round(total/40*100),rubric,strengths:generated.strengths.slice(0,3),nextSteps:generated.nextSteps.slice(0,4),feedback:generated.feedback,improvedSummary,annotations:annotations.sort((a,b)=>a.start-b.start),evaluationMode:'ai' as const,evaluationModel:modelName()}
}

function mockEssay(text:string):EssayResult {
  const errors:EssayResult['errors']=[]
  const rules:[RegExp,string,string,string][]=[
    [/people is/i,'People are','“People” is plural, so it takes the plural verb “are”.','Subject–verb agreement'],
    [/informations/i,'information','“Information” is an uncountable noun in English.','Word form'],
    [/depend of/i,'depend on','The verb “depend” takes the preposition “on”.','Preposition'],
    [/this show\b/i,'This shows','A singular subject in the present simple takes a verb ending in -s.','Subject–verb agreement'],
  ]
  for(const[r,correction,explanation,type]of rules){const match=text.match(r);if(match)errors.push({original:match[0],correction,explanation,type})}
  const words=text.trim().split(/\s+/).length;const base=Math.min(8,5.7+words/160);const overall=Math.round((base-errors.length*.08)*10)/10
  return {overall,scores:{grammar:Math.round((base-.1)*10)/10,vocabulary:Math.round((base+.2)*10)/10,coherence:Math.round((base-.3)*10)/10,taskResponse:Math.round(base*10)/10},summary:'Your position is clear and focused. Improve sentence-level accuracy and make the relationship between paragraphs more explicit.',errors,patterns:Array.from(new Set(errors.map(e=>e.type).concat('Transitions between ideas'))),strengths:['Clear central position','Relevant supporting ideas']}
}

export const aiService={
  async analyzeEssay(text:string,task=''){const generated=await providerJson(prompts.essay(text,task));return EssaySchema.parse(generated??mockEssay(text))},
  async evaluateMainIdea(answer:string,expected:string){const generated=await providerJson(prompts.mainIdea(answer,expected));if(generated)return MainIdeaSchema.parse(generated);const stop=new Set(['the','that','with','from','this','they','their','about','into','than','have','should','main']);const keywords=Array.from(new Set((expected.toLowerCase().match(/[a-z]+/g)??[]).filter(word=>word.length>3&&!stop.has(word))));const normalized=answer.toLowerCase();const hits=keywords.filter(word=>normalized.includes(word)).length;const coverage=hits/Math.max(1,keywords.length);const concise=answer.split(/\s+/).length>=7&&answer.split(/\s+/).length<=40?8:0;const score=Math.min(96,Math.round(35+coverage*55+concise));return{score,feedback:score>=75?'Strong summary. You captured the central idea in your own words without getting lost in details.':'You identified part of the topic. Add the writer’s central claim and remove details that do not represent the whole passage.'}},
  async evaluateIntegratedSummary(passage:IntegratedSummaryText,answer:string,baseline:IntegratedSummaryResult){
    try{const generated=await providerJson(prompts.integratedSummary(passage,answer,baseline));if(!generated)return baseline;const parsed=IntegratedSummaryReviewSchema.parse(generated);return mergeIntegratedReview(baseline,parsed,answer)}
    catch(error){console.error('AI integrated-summary review failed; using deterministic rubric.',error instanceof Error?error.message:error);return baseline}
  },
}
