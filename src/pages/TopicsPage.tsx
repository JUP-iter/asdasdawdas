import { ArrowLeft, ArrowRight, BookOpen, BrainCircuit, Check, Clock3, Layers3, Lightbulb, Lock, Play, Target } from 'lucide-react'
import { useState } from 'react'
import { ExercisePlayer } from '../components/ExercisePlayer'
import { Badge, Button, Card, ProgressBar } from '../components/ui'
import { complexTopics, grammarTopics } from '../data/seed'
import type { Topic } from '../types'
import { useApp } from '../state/AppContext'

export function TopicsPage({ advanced = false }: { advanced?: boolean }) {
  const {user}=useApp(); const sourceTopics = advanced ? complexTopics : grammarTopics; const topics=sourceTopics.map(topic=>({...topic,progress:user?.topicProgress?.[topic.id]??0})); const skillProfile=user?.skills.find(skill=>skill.key===(advanced?'complexGrammar':'grammar')); const mastery=skillProfile?.assessed?skillProfile.score:null; const [active, setActive] = useState<Topic|null>(null); const [practiceStarted,setPracticeStarted] = useState(false); const [level,setLevel] = useState(advanced?'All':'B1')
  const closeLesson=()=>{setActive(null);setPracticeStarted(false)}
  if (active && practiceStarted) return <ExercisePlayer title={active.title} questions={active.questions} skill={advanced?'complexGrammar':'grammar'} topicId={active.id} onExit={closeLesson}/>
  if (active) {
    const skills=[...new Set(active.questions.map(question=>question.skill))]
    return <div className="lesson-page page-enter">
      <button className="lesson-back" onClick={closeLesson}><ArrowLeft/> Back to topics</button>
      <Card className="lesson-hero" style={{background:active.accent}}>
        <div><Badge tone="neutral">{active.level}</Badge><span className="lesson-duration"><Clock3/> {active.duration} min</span></div>
        <h1>{active.title}</h1><p>{active.description}</p>
      </Card>
      <div className="lesson-layout">
        <Card className="lesson-explanation"><span className="eyebrow">QUICK LESSON</span><h2><Lightbulb/> The key idea</h2><p>{active.questions[0]?.explanation || active.description}</p><div className="lesson-rule"><strong>Remember</strong><span>Read the whole sentence before choosing a form. Meaning and context are as important as the grammar pattern.</span></div></Card>
        <Card className="lesson-goals"><h3><Target/> In this practice</h3><ul>{skills.map(skill=><li key={skill}><Check/>{skill}</li>)}</ul><div className="lesson-meta"><span>{active.questions.length} questions</span><span>{active.lessons} lessons</span></div></Card>
      </div>
      <Card className="lesson-examples"><span className="eyebrow">EXAMPLES IN CONTEXT</span><h2>Notice the pattern</h2><div>{active.questions.slice(0,2).map((question,index)=><article key={question.id}><b>0{index+1}</b><div><p>{question.prompt}</p><small>Correct form: <strong>{question.options[question.answer]}</strong></small></div></article>)}</div></Card>
      <div className="lesson-start"><div><strong>Ready to practise?</strong><span>You will get instant feedback after every answer.</span></div><Button onClick={()=>setPracticeStarted(true)}>Begin practice <ArrowRight/></Button></div>
    </div>
  }
  const filtered=level==='All'?topics:topics.filter(t=>t.level.includes(level))
  return <div className="topics-page page-enter"><div className="module-hero"><div className="module-icon">{advanced?<BrainCircuit/>:<BookOpen/>}</div><div><span className="eyebrow">{advanced?'B2 → C1 mastery':'STRUCTURE WITH PURPOSE'}</span><h1>{advanced?'Complex grammar':'Grammar'}</h1><p>{advanced?'Build the advanced structures that make your English precise, flexible, and persuasive.':'Clear explanations, useful examples, and focused practice—organized around your level.'}</p></div><div className="module-stat"><span>{mastery===null?'—':`${mastery}%`}</span><small>{mastery===null?'not assessed':'measured mastery'}</small>{mastery!==null&&<ProgressBar value={mastery}/>}</div></div>
    {advanced && <Card className="path-card"><div><Badge tone="amber">Your current path</Badge><h2>From confident B2 to precise C1</h2><p>We’ll prioritize mixed conditionals, then unlock inversion based on your results.</p></div><div className="path-steps"><span className="done"><Check/>B2</span><i/><span className="current">B2+</span><i/><span>C1</span></div></Card>}
    <div className="topic-toolbar"><div>{(advanced?['All','B2','C1']:['A1','A2','B1','B2','C1']).map(x=><button className={level===x?'active':''} key={x} onClick={()=>setLevel(x)}>{x}</button>)}</div><span><Layers3 size={16}/>{filtered.length} topics</span></div>
    <div className="topic-grid">{filtered.map((topic,i)=><Card key={topic.id} className="topic-card"><div className="topic-art" style={{background:topic.accent}}><span>{String(i+1).padStart(2,'0')}</span>{topic.progress>0?<div className="topic-ring"><svg viewBox="0 0 42 42"><circle cx="21" cy="21" r="17"/><circle className="active" cx="21" cy="21" r="17" style={{strokeDashoffset:107-(107*topic.progress/100)}}/></svg><b>{topic.progress}%</b></div>:<BrainCircuit/>}</div><div className="topic-content"><div><Badge tone={topic.level.includes('C1')?'amber':'neutral'}>{topic.level}</Badge>{topic.progress===100&&<Badge tone="green"><Check size={11}/> Complete</Badge>}</div><h3>{topic.title}</h3><p>{topic.description}</p><div className="topic-meta"><span><BookOpen size={14}/>{topic.lessons} lessons</span><span><Clock3 size={14}/>~{topic.duration} min</span></div><Button variant={topic.progress?'primary':'secondary'} onClick={()=>setActive(topic)}>{topic.progress?'Continue':'Start topic'} {topic.progress?<ArrowRight size={15}/>:<Play size={15}/>}</Button></div></Card>)}</div>
    {!filtered.length && <div className="empty-filter"><Lock/><h3>More {level} topics are on the way</h3><p>Choose another level to continue practicing.</p></div>}
  </div>
}
