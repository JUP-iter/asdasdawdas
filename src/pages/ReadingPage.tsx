import { ArrowRight, BookOpen, Clock3, GraduationCap, Search, Target } from 'lucide-react'
import { useState } from 'react'
import { ExercisePlayer } from '../components/ExercisePlayer'
import { Badge, Button, Card, EmptyState, ProgressBar } from '../components/ui'
import { readings } from '../data/seed'
import type { ReadingPassage } from '../types'
import { useApp } from '../state/AppContext'

export function ReadingPage() {
  const {user}=useApp()
  const [active,setActive]=useState<ReadingPassage|null>(null); const [read,setRead]=useState(false); const [query,setQuery]=useState(''); const filtered=readings.filter(passage=>`${passage.title} ${passage.category} ${passage.level}`.toLowerCase().includes(query.toLowerCase()))
  const readingProfile=user?.skills.find(skill=>skill.key==='reading'); const readingOverall=readingProfile?.assessed?readingProfile.score:null
  const skillRows=['Main Idea','Supporting Details','Inference',"Author's Purpose",'Vocabulary in Context'].map(label=>[label,user?.readingSkills?.[label]] as const)
  const weakestReading=[...skillRows].filter((item):item is [string,number]=>item[1]!==undefined).sort((a,b)=>a[1]-b[1])[0]
  const recommendedReading=readings.find(passage=>passage.questions.some(question=>question.skill===weakestReading?.[0]))??readings[0]
  if(active && read)return <ExercisePlayer title={active.title} questions={active.questions} skill="reading" onExit={()=>{setActive(null);setRead(false)}}/>
  if(active)return <div className="reading-focus page-enter"><header><button onClick={()=>setActive(null)}>← Library</button><Badge tone="green">{active.category}</Badge><span>{active.level} · {active.minutes} min</span></header><main><span className="eyebrow">READING PRACTICE</span><h1>{active.title}</h1><div className="passage-text">{active.text.map(p=><p key={p}>{p}</p>)}</div><div className="passage-action"><p><strong>{active.questions.length} questions</strong><span>{[...new Set(active.questions.map(question=>question.skill))].join(' · ')}</span></p><Button onClick={()=>setRead(true)}>Answer questions <ArrowRight size={16}/></Button></div></main></div>
  return <div className="reading-page page-enter"><div className="module-hero reading-hero"><div className="module-icon"><GraduationCap/></div><div><span className="eyebrow">READ WITH INTENTION</span><h1>Reading skills</h1><p>Practice the specific skills behind strong comprehension—not just right answers.</p></div><div className="module-stat"><span>{readingOverall===null?'—':`${readingOverall}%`}</span><small>{readingOverall===null?'not assessed':'measured accuracy'}</small>{readingOverall!==null&&<ProgressBar value={readingOverall}/>}</div></div>
    <div className="reading-skill-row">{skillRows.map(([x,v])=><Card key={x}><span>{x}</span><strong>{v===undefined?'—':`${v}%`}</strong>{v!==undefined&&<ProgressBar value={v} color={v<70?'#a8715f':'#637b65'}/>}<small>{v===undefined?'Complete a reading to measure':v<70?'Recommended focus':'On track'}</small></Card>)}</div>
    <Card className="reading-recommend"><div className="reading-rec-icon"><Target/></div><div><Badge tone="amber">Recommended focus</Badge><h2>{weakestReading?`Strengthen ${weakestReading[0].toLowerCase()}`:'Build your reading baseline'}</h2><p>{weakestReading?`${weakestReading[0]} is your lowest measured reading skill at ${weakestReading[1]}%.`:'Complete a passage to see a recommendation based on your answers.'}</p></div><Button variant="secondary" onClick={()=>setActive(recommendedReading)}>{weakestReading?'Practice this skill':'Start a reading'} <ArrowRight size={15}/></Button></Card>
    <div className="library-head"><div><span className="eyebrow">Passage library</span><h2>Choose a reading</h2></div><label className="fake-search"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search passages" aria-label="Search passages"/></label></div>{filtered.length?<div className="passage-grid">{filtered.map((r,i)=><Card key={r.id} className="passage-card"><div className={`passage-cover cover-${i}`}><span>{r.category}</span><BookOpen/></div><div><Badge>{r.level}</Badge><h3>{r.title}</h3><p>{r.text[0].slice(0,118)}…</p><div><span><Clock3/> {r.minutes} min</span><span>{r.questions.length} questions</span></div><Button onClick={()=>setActive(r)}>Read passage <ArrowRight size={15}/></Button></div></Card>)}</div>:<Card><EmptyState icon={<Search/>} title="No passages found" description="Try another title, category, or level."/></Card>}
  </div>
}
