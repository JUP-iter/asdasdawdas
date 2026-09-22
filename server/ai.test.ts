import { describe, expect, it, vi } from 'vitest'
import { aiService } from './ai.js'
import { createSessionToken, hashPassword, hashToken, verifyPassword } from './security.js'

describe('server AI service',()=>{
  it('returns structured essay feedback',async()=>{const result=await aiService.analyzeEssay('Technology affects education in several ways. People is now able to find informations quickly, but students sometimes depend of devices too much. Schools should teach learners to evaluate sources and balance technology with independent thinking.');expect(result.overall).toBeGreaterThan(0);expect(result.errors.map(e=>e.type)).toContain('Subject–verb agreement')})
  it('evaluates a focused main idea',async()=>{const result=await aiService.evaluateMainIdea('Cities restore wetlands as natural infrastructure to control floods and improve urban environments.','Cities use wetlands as infrastructure.');expect(result.score).toBeGreaterThanOrEqual(75)})
  it('uses the configured DeepSeek Flash JSON endpoint',async()=>{
    const previous={provider:process.env.AI_PROVIDER,key:process.env.AI_API_KEY,model:process.env.AI_MODEL}
    process.env.AI_PROVIDER='deepseek';process.env.AI_API_KEY='test-key';process.env.AI_MODEL='deepseek-flash'
    const payload={overall:7.5,scores:{grammar:7,vocabulary:8,coherence:7.5,taskResponse:7.5},summary:'Focused feedback.',errors:[],patterns:['Cohesion'],strengths:['Clear position']}
    const fetchMock=vi.fn().mockResolvedValue(new Response(JSON.stringify({choices:[{message:{content:JSON.stringify(payload)}}]}),{status:200,headers:{'content-type':'application/json'}}))
    vi.stubGlobal('fetch',fetchMock)
    try{
      const result=await aiService.analyzeEssay('A sufficiently long academic essay response for testing the configured provider without making a real network request.')
      expect(result.overall).toBe(7.5)
      const [url,options]=fetchMock.mock.calls[0] as [string,RequestInit]
      expect(url).toBe('https://api.deepseek.com/chat/completions')
      const body=JSON.parse(String(options.body))
      expect(body.model).toBe('deepseek-flash')
      expect(body.response_format).toEqual({type:'json_object'})
      expect(body.thinking).toEqual({type:'disabled'})
    }finally{
      previous.provider===undefined?delete process.env.AI_PROVIDER:process.env.AI_PROVIDER=previous.provider
      previous.key===undefined?delete process.env.AI_API_KEY:process.env.AI_API_KEY=previous.key
      previous.model===undefined?delete process.env.AI_MODEL:process.env.AI_MODEL=previous.model
      vi.unstubAllGlobals()
    }
  })
})

describe('authentication primitives',()=>{
  it('hashes passwords with a salt and verifies without storing plaintext',()=>{const secured=hashPassword('Correct Horse Battery Staple');expect(secured.hash).not.toContain('Correct Horse');expect(verifyPassword('Correct Horse Battery Staple',secured.salt,secured.hash)).toBe(true);expect(verifyPassword('wrong password',secured.salt,secured.hash)).toBe(false)})
  it('stores only a one-way session-token hash',()=>{const session=createSessionToken();expect(session.token).not.toBe(session.hash);expect(hashToken(session.token)).toBe(session.hash)})
})
