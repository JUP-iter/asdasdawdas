import { AlertTriangle, ArrowLeft, ArrowRight, BookOpen, CheckCircle2, ClipboardCheck, Clock3, FileText, Layers3, LoaderCircle, RotateCcw, Search, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Badge, Button, Card, ProgressBar } from '../components/ui'
import { SourceReader } from '../components/SourceReader'
import { api } from '../services/api'
import { useApp } from '../state/AppContext'
import type { IntegratedSummaryResult, IntegratedSummaryText, SummaryAnnotation, SummaryMainIdea } from '../types'

const scoreLabel=(score:number)=>Number.isInteger(score)?String(score):score.toFixed(1)

function AnnotatedResponse({text,annotations}:{text:string;annotations:SummaryAnnotation[]}){
  const parts:ReactNode[]=[];let cursor=0
  for(const annotation of [...annotations].sort((a,b)=>a.start-b.start)){
    if(annotation.start<cursor)continue
    if(annotation.start>cursor)parts.push(text.slice(cursor,annotation.start))
    parts.push(<mark key={`${annotation.start}-${annotation.end}`} className={`summary-annotation ${annotation.type}`} title={annotation.message}>{text.slice(annotation.start,annotation.end)}</mark>)
    cursor=annotation.end
  }
  if(cursor<text.length)parts.push(text.slice(cursor))
  return <p>{parts}</p>
}

function highlightedTerms(text:string,terms:string[]){
  const unique=[...new Set(terms.filter(Boolean))].sort((a,b)=>b.length-a.length)
  if(!unique.length)return text
  const escaped=unique.map(term=>term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'))
  const pattern=new RegExp(`(${escaped.join('|')})`,'gi')
  return text.split(pattern).map((part,index)=>unique.some(term=>term.toLowerCase()===part.toLowerCase())?<mark key={index}>{part}</mark>:part)
}

function MainIdeaSource({text,ideas}:{text:IntegratedSummaryText;ideas:SummaryMainIdea[]}){
  return <div className="main-idea-source">{text.paragraphs.map((paragraph,index)=>{const paragraphIdeas=ideas.filter(idea=>idea.paragraphIndex===index);const terms=paragraphIdeas.flatMap(idea=>idea.keywords);return <article className={paragraphIdeas.length?'contains-main-idea':''} key={index}>{paragraphIdeas.length>0&&<div>{paragraphIdeas.map(idea=><Badge tone="green" key={idea.label}>Main idea {ideas.indexOf(idea)+1}</Badge>)}</div>}<p>{highlightedTerms(paragraph,terms)}</p>{paragraphIdeas.map(idea=><small key={idea.label}>{idea.label}</small>)}</article>})}</div>
}

export function IntegratedSummaryPage(){
  const {user,recordActivity}=useApp()
  const [texts,setTexts]=useState<IntegratedSummaryText[]>([])
  const [selected,setSelected]=useState<IntegratedSummaryText|null>(null)
  const [answer,setAnswer]=useState('')
  const [result,setResult]=useState<IntegratedSummaryResult|null>(null)
  const [loading,setLoading]=useState(true)
  const [evaluating,setEvaluating]=useState(false)
  const [error,setError]=useState('')
  const [query,setQuery]=useState('')
  const [topicFilter,setTopicFilter]=useState('All')
  const [visibleCount,setVisibleCount]=useState(12)
  const [showImproved,setShowImproved]=useState(false)
  const [showMainIdeas,setShowMainIdeas]=useState(false)
  const startedAt=useRef(Date.now())
  const profile=user?.skills.find(skill=>skill.key==='integratedSummary')
  const wordCount=answer.trim()?answer.trim().split(/\s+/).length:0
  const paragraphCount=answer.trim()?answer.trim().split(/\n\s*\n/).filter(Boolean).length:0
  const topics=['All',...new Set(texts.map(text=>text.topic))]
  const filteredTexts=texts.filter(text=>(topicFilter==='All'||text.topic===topicFilter)&&`${text.title} ${text.subtitle} ${text.topic}`.toLowerCase().includes(query.toLowerCase()))
  const visibleTexts=filteredTexts.slice(0,visibleCount)

  useEffect(()=>{api.integratedSummaryTexts().then(response=>setTexts(response.texts)).catch(err=>setError(err instanceof Error?err.message:'Unable to load practice texts.')).finally(()=>setLoading(false))},[])

  const openText=(text:IntegratedSummaryText)=>{setSelected(text);setAnswer('');setResult(null);setError('');setShowImproved(false);setShowMainIdeas(false);startedAt.current=Date.now()}
  const evaluate=async()=>{
    if(!selected)return
    setEvaluating(true);setError('')
    try{
      const next=await api.evaluateIntegratedSummary(selected.id,answer)
      setResult(next)
      await recordActivity({kind:'Integrated summary',title:selected.title,score:next.percent,xp:50+Math.round(next.total),mistakes:next.nextSteps,durationSeconds:Math.max(1,Math.round((Date.now()-startedAt.current)/1000))},'integratedSummary')
    }catch(err){setError(err instanceof Error?err.message:'Unable to evaluate this summary.')}
    finally{setEvaluating(false)}
  }

  if(result&&selected)return <div className="integrated-page page-enter">
    <div className="integrated-result-head"><div><Badge tone="green"><ClipboardCheck size={13}/> Rubric evaluation complete</Badge><h1>{selected.title}</h1><p>Your result uses the 40-mark Integrated Skills Summary rubric. {result.evaluationMode==='ai'?`Reviewed with ${result.evaluationModel||'DeepSeek'}.`:'Local rubric fallback was used.'}</p></div><div className="integrated-total"><strong>{scoreLabel(result.total)}</strong><span>/ 40</span><small>{result.percent}%</small></div></div>
    <Card className="personal-feedback"><Sparkles/><div><span className="eyebrow">FEEDBACK FOR {user?.name?.toUpperCase()||'YOU'}</span><h2>Your next move is clear</h2><p>{result.feedback}</p></div></Card>
    <div className="rubric-results">{Object.entries(result.rubric).map(([key,item])=><Card key={key} className="rubric-result"><div><span>{key==='taskAchievement'?'Task Achievement':key[0].toUpperCase()+key.slice(1)}</span><Badge tone={item.score/item.maximum>=.7?'green':item.score/item.maximum>=.4?'amber':'neutral'}>{item.band}</Badge></div><strong>{scoreLabel(item.score)}<small>/{item.maximum}</small></strong><ProgressBar value={item.score/item.maximum*100}/><p>{item.feedback}</p></Card>)}</div>
    <div className="integrated-feedback-grid"><Card><span className="eyebrow">STRENGTHS</span>{result.strengths.map(item=><div className="summary-feedback-item good" key={item}><CheckCircle2/><span>{item}</span></div>)}</Card><Card><span className="eyebrow">NEXT STEPS</span>{result.nextSteps.map(item=><div className="summary-feedback-item" key={item}><ArrowRight/><span>{item}</span></div>)}</Card></div>
    {result.flags.length>0&&<Card className="rubric-flags"><AlertTriangle/><div><strong>Format and integrity checks</strong>{result.flags.map(flag=><p key={flag}>{flag}</p>)}</div></Card>}
    <Card className="submission-metrics"><div><span>Words</span><strong>{result.wordCount}</strong><small>Required: 150–250</small></div><div><span>Paragraphs</span><strong>{result.paragraphCount}</strong><small>Required: one</small></div><div><span>Close source overlap</span><strong>{result.copiedPercent}%</strong><small>50% triggers a mark ceiling</small></div></Card>
    <Card className="annotated-submission"><div className="annotated-submission-head"><div><span className="eyebrow">YOUR SUMMARY · HIGHLIGHTED REVIEW</span><h2>Weak points in context</h2></div><div className="annotation-legend"><span className="organization">Structure</span><span className="language">Language</span><span className="source-use">Source use</span><span className="opinion">Opinion</span></div></div><AnnotatedResponse text={answer} annotations={result.annotations}/>{result.annotations.length>0?<div className="annotation-notes">{result.annotations.map((annotation,index)=><div className={annotation.type} key={`${annotation.start}-${index}`}><strong>{index+1}</strong><span>{annotation.message}</span></div>)}</div>:<div className="annotation-clear"><CheckCircle2/> No sentence-level weaknesses were detected. Use the rubric feedback above for further refinement.</div>}</Card>
    <div className="review-action-buttons"><Button variant="secondary" onClick={()=>setShowImproved(value=>!value)}><Sparkles/> {showImproved?'Hide improved summary':'Show improved summary'}</Button><Button variant="secondary" onClick={()=>setShowMainIdeas(value=>!value)}><BookOpen/> {showMainIdeas?'Hide main ideas':'Show main ideas in source'}</Button></div>
    {showImproved&&<Card className="improved-summary-panel"><div><span className="eyebrow">MODEL REVISION</span><h2>An improved summary</h2><p>This is one strong version, not the only correct answer. Compare its selection, organization, and paraphrasing with yours.</p></div><blockquote>{result.improvedSummary}</blockquote><small>{result.improvedSummary.trim().split(/\s+/).length} words · generated from the assessed main ideas</small></Card>}
    {showMainIdeas&&<Card className="main-ideas-panel"><div><span className="eyebrow">SOURCE MAP</span><h2>Main ideas highlighted in the text</h2><p>Colored terms show where the evidence for each assessed main idea appears. The labels below each paragraph state the idea in concise form.</p></div><MainIdeaSource text={selected} ideas={result.mainIdeas}/></Card>}
    <div className="integrated-result-actions"><Button variant="secondary" onClick={()=>{setResult(null);setShowImproved(false);setShowMainIdeas(false);startedAt.current=Date.now()}}><RotateCcw/> Revise this summary</Button><Button onClick={()=>{setSelected(null);setResult(null);setAnswer('');setShowImproved(false);setShowMainIdeas(false)}}>Choose another text <ArrowRight/></Button></div>
  </div>

  if(selected)return <div className="integrated-page integrated-workspace page-enter">
    <button className="lesson-back" onClick={()=>setSelected(null)}><ArrowLeft/> All practice texts</button>
    <div className="integrated-work-head"><div><Badge tone="blue">{selected.topic}</Badge><h1>{selected.title}</h1><h2>{selected.subtitle}</h2><p>{selected.sourceLabel}</p></div><div><span><Clock3/> {selected.readingMinutes} min reading</span><span><Layers3/> {selected.level}</span></div></div>
    <Card className="assessment-brief"><ClipboardCheck/><div><strong>Assessment format</strong><p>Write one academic paragraph of 150–250 words. Include the main ideas in your own words, begin with a topic sentence, end with a concluding sentence, and do not add personal opinions.</p></div><Badge>40 marks · 10% weighting · 100 min</Badge></Card>
    <div className="integrated-editor-grid">
      <SourceReader text={selected} storageScope={user?.id}/>
      <Card className="summary-pane"><div className="pane-heading"><span className="eyebrow">YOUR SUMMARY</span><small>Use your own words</small></div><textarea value={answer} onChange={event=>setAnswer(event.target.value)} placeholder="Write your one-paragraph academic summary here…" aria-label="Integrated skills summary response"/><div className="summary-live-metrics"><span className={wordCount>=150&&wordCount<=250?'valid':wordCount>250?'invalid':''}>{wordCount} / 250 words</span><span className={paragraphCount===1?'valid':paragraphCount>1?'invalid':''}>{paragraphCount} paragraph{paragraphCount===1?'':'s'}</span></div><div className="summary-checklist"><strong>Before submitting</strong><span className={wordCount>=150&&wordCount<=250?'done':''}><CheckCircle2/> 150–250 words</span><span className={paragraphCount===1?'done':''}><CheckCircle2/> One paragraph</span><span><CheckCircle2/> Topic sentence and conclusion</span><span><CheckCircle2/> Main ideas paraphrased</span><span><CheckCircle2/> No personal opinion</span></div>{error&&<div className="form-error"><AlertTriangle/> {error}</div>}<Button loading={evaluating} disabled={answer.trim().length<50} onClick={evaluate}>{evaluating?<><LoaderCircle/>Evaluating against rubric…</>:<>Evaluate my summary <Sparkles/></>}</Button></Card>
    </div>
  </div>

  return <div className="integrated-page page-enter">
    <div className="module-hero integrated-hero"><div className="module-icon"><FileText/></div><div><span className="eyebrow">READ · PARAPHRASE · SYNTHESIZE</span><h1>Integrated Skills Summary</h1><p>Read a substantial academic text and produce a focused one-paragraph summary under assessment-style conditions.</p></div><div className="module-stat"><span>{profile?.assessed?`${profile.score}%`:'—'}</span><small>{profile?.assessed?'rubric performance':'not assessed'}</small>{profile?.assessed&&<ProgressBar value={profile.score}/>}</div></div>
    <Card className="is-guide"><div className="guide-heading"><div><span className="eyebrow">VISUAL WRITING GUIDE</span><h2>How to build a strong IS summary</h2></div><p>Move from understanding to selection, then from paraphrasing to a single coherent paragraph.</p></div><div className="guide-flow"><div className="guide-step"><strong>1</strong><span>Skim</span><small>Use the title, subtitle, and opening and closing sentences to find the central focus.</small></div><div className="guide-arrow">→</div><div className="guide-step"><strong>2</strong><span>Map</span><small>Identify five or six essential ideas. Exclude examples, repetition, and minor detail.</small></div><div className="guide-arrow">→</div><div className="guide-step"><strong>3</strong><span>Paraphrase</span><small>Change vocabulary and sentence structure while keeping the author's meaning accurate.</small></div><div className="guide-arrow">→</div><div className="guide-step"><strong>4</strong><span>Connect</span><small>Arrange ideas logically and link them with precise transitions.</small></div><div className="guide-arrow">→</div><div className="guide-step"><strong>5</strong><span>Check</span><small>Keep one paragraph and 150–250 words; remove opinion and copied phrasing.</small></div></div><div className="guide-blueprint"><div className="guide-paragraph"><mark className="guide-topic">Topic sentence: name the text's central claim.</mark> <mark className="guide-ideas">Main ideas: develop only the essential points in a logical sequence, using your own language and clear connections.</mark> <mark className="guide-conclusion">Conclusion: restate the overall significance without adding a personal view.</mark></div><div className="guide-score-map"><span><strong>20</strong> Content & source use</span><span><strong>10</strong> Organization</span><span><strong>10</strong> Language</span></div></div></Card>
    <div className="integrated-rubric-overview"><Card><strong>20</strong><div><span>Task Achievement</span><small>Main ideas, relevance, word limit, and source use</small></div></Card><Card><strong>10</strong><div><span>Organization</span><small>Topic sentence, logical order, cohesion, and conclusion</small></div></Card><Card><strong>10</strong><div><span>Language</span><small>Academic range, accuracy, paraphrasing, and summarising</small></div></Card></div>
    <div className="integrated-guidance"><div><span className="eyebrow">ASSESSMENT GUIDANCE</span><h2>Practice the complete task—not a sample essay</h2></div><p>Each option contains a different original academic reading, glossary, writing workspace, format checks, overlap detection, and criterion-level feedback based on the supplied 2026–27 rubric.</p></div>
    {!loading&&texts.length>0&&<div className="integrated-library-tools"><label><Search/><input value={query} onChange={event=>{setQuery(event.target.value);setVisibleCount(12)}} placeholder="Search 100 practices" aria-label="Search integrated summary practices"/></label><select value={topicFilter} onChange={event=>{setTopicFilter(event.target.value);setVisibleCount(12)}} aria-label="Filter by subject"><option value="All">All subjects</option>{topics.slice(1).map(topic=><option key={topic} value={topic}>{topic}</option>)}</select><span>{filteredTexts.length} practice{filteredTexts.length===1?'':'s'}</span></div>}
    {loading?<Card className="integrated-loading"><LoaderCircle/> Loading practice texts…</Card>:error?<div className="form-error">{error}</div>:filteredTexts.length?<><div className="integrated-text-grid">{visibleTexts.map((text,index)=><Card key={text.id} className="integrated-text-card"><div className={`integrated-cover cover-${index%3}`}><FileText/><Badge>{text.topic}</Badge></div><div><span className="eyebrow">PRACTICE SET {String(texts.indexOf(text)+1).padStart(2,'0')}</span><h2>{text.title}</h2><h3>{text.subtitle}</h3><p>{text.paragraphs[0].slice(0,130)}…</p><div className="integrated-text-meta"><span><Clock3/> {text.readingMinutes} min</span><span><BookOpen/> {text.paragraphs.length} sections</span><span>{text.level}</span></div><Button onClick={()=>openText(text)}>Open assessment <ArrowRight/></Button></div></Card>)}</div>{visibleCount<filteredTexts.length&&<div className="integrated-load-more"><Button variant="secondary" onClick={()=>setVisibleCount(count=>count+12)}>Load 12 more practices</Button></div>}</>:<Card className="integrated-loading"><Search/> No practices match this search.</Card>}
  </div>
}
