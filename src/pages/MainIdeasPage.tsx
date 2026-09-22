import { ArrowRight, CheckCircle2, Lightbulb, LoaderCircle, PenLine, Sparkles, Target } from 'lucide-react'
import { useRef, useState } from 'react'
import { Badge, Button, Card, ProgressBar } from '../components/ui'
import { readings } from '../data/seed'
import { aiService } from '../services/ai'
import { useApp } from '../state/AppContext'

export function MainIdeasPage() {
  const {recordActivity,user}=useApp()
  const mainIdeaScore=user?.skills.find(skill=>skill.key==='mainIdeas')
  const mainIdeaPassages=readings.filter(item=>item.questions.some(question=>question.skill==='Main Idea'))
  const[passageIndex,setPassageIndex]=useState(0)
  const [mode,setMode]=useState<'choice'|'write'>('choice')
  const [choice,setChoice]=useState<number|null>(null)
  const [submitted,setSubmitted]=useState(false)
  const [answer,setAnswer]=useState('')
  const [result,setResult]=useState<{score:number;feedback:string}|null>(null)
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState('')
  const startedAt=useRef(Date.now())
  const passage=mainIdeaPassages[passageIndex]
  const question=passage.questions.find(item=>item.skill==='Main Idea')??passage.questions[0]
  const durationSeconds=()=>Math.max(1,Math.round((Date.now()-startedAt.current)/1000))

  const nextPassage=()=>{
    setPassageIndex(index=>(index+1)%mainIdeaPassages.length)
    setChoice(null);setSubmitted(false);setAnswer('');setResult(null);setError('')
    startedAt.current=Date.now()
  }
  const evaluate=async()=>{
    setLoading(true);setError('')
    try{
      const next=await aiService.evaluateMainIdea(answer,question.options[question.answer])
      setResult(next)
      await recordActivity({kind:'Main idea',title:`${passage.title} summary`,score:next.score,xp:35,outcomes:[{skill:'Main Idea',correct:next.score>=70}],durationSeconds:durationSeconds()},'mainIdeas')
    }catch(err){setError(err instanceof Error?err.message:'Evaluation is temporarily unavailable.')}
    finally{setLoading(false)}
  }
  const submitChoice=()=>{
    if(choice===null)return
    const isCorrect=choice===question.answer
    setSubmitted(true)
    void recordActivity({kind:'Main idea',title:`${passage.title} main idea`,score:isCorrect?100:0,xp:isCorrect?30:10,outcomes:[{skill:'Main Idea',correct:isCorrect}],mistakes:isCorrect?[]:['Main Idea'],durationSeconds:durationSeconds()},'mainIdeas').catch(err=>setError(err instanceof Error?err.message:'Unable to save this result.'))
  }

  return <div className="ideas-page page-enter">
    <div className="page-title-row"><div><span className="eyebrow">FIND THE CENTRAL MESSAGE</span><h1>Main idea studio</h1><p>Learn to separate the writer’s main point from examples, details, and tempting distractors.</p></div><div className="idea-score"><Target/><div><strong>{mainIdeaScore?.assessed?`${mainIdeaScore.score}%`:'—'}</strong><span>{mainIdeaScore?.assessed?'Measured accuracy':'Not assessed'}</span></div></div></div>
    <div className="mode-tabs"><button className={mode==='choice'?'active':''} onClick={()=>{setMode('choice');setResult(null)}}><CheckCircle2/>Multiple choice<span>Choose the best summary</span></button><button className={mode==='write'?'active':''} onClick={()=>{setMode('write');setSubmitted(false)}}><PenLine/>Free response<span>Write it in one sentence</span></button><button className="next-passage" onClick={nextPassage}>Next passage <ArrowRight/></button></div>
    <div className="ideas-layout">
      <Card className="idea-passage"><div><Badge tone="green">{passage.category}</Badge><span>{passage.level} · Passage {passageIndex+1}/{mainIdeaPassages.length}</span></div><h2>{passage.title}</h2>{passage.text.map(p=><p key={p}>{p}</p>)}</Card>
      <Card className="idea-task"><span className="eyebrow">{mode==='choice'?'CHOOSE ONE ANSWER':'ONE-SENTENCE SUMMARY'}</span><h2>What is the main idea of this passage?</h2>
        {mode==='choice'?<>
          <div className="idea-options">{question.options.map((option,index)=><button disabled={submitted} key={option} className={`${choice===index?'selected':''} ${submitted&&index===question.answer?'correct':''} ${submitted&&choice===index&&index!==question.answer?'incorrect':''}`} onClick={()=>setChoice(index)}><span>{String.fromCharCode(65+index)}</span>{option}</button>)}</div>
          {submitted&&<div className={`idea-feedback ${choice===question.answer?'good':'try'}`}><Lightbulb/><div><strong>{choice===question.answer?'Well reasoned.':'Look at the whole passage.'}</strong><p>{question.explanation}</p></div></div>}
          {error&&<div className="form-error">{error}</div>}
          <Button disabled={choice===null} onClick={()=>submitted?nextPassage():submitChoice()}>{submitted?'Next passage':'Check answer'} <ArrowRight size={15}/></Button>
        </>:<>
          <label className="summary-input"><textarea value={answer} maxLength={240} onChange={event=>setAnswer(event.target.value)} placeholder="The passage argues that…"/><span>{answer.length}/240</span></label>
          <div className="summary-tips"><Sparkles/><p><strong>A strong main idea…</strong><span>captures the central point, avoids small details, and uses your own words.</span></p></div>
          {result&&<div className="ai-result"><div><strong>{result.score}%</strong><ProgressBar value={result.score}/></div><p>{result.feedback}</p><button onClick={nextPassage}>Continue to next passage <ArrowRight/></button></div>}
          {error&&<div className="form-error">{error}</div>}
          <Button loading={loading} disabled={answer.trim().length<20||Boolean(result)} onClick={evaluate}>{loading?<><LoaderCircle/>Evaluating</>:<>Evaluate my answer <Sparkles size={15}/></>}</Button>
        </>}
      </Card>
    </div>
  </div>
}
