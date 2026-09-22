import { Check, ChevronLeft, Lightbulb, X } from 'lucide-react'
import { useRef, useState } from 'react'
import type { Question, SkillKey } from '../types'
import { Button, ProgressBar } from './ui'
import { useApp } from '../state/AppContext'

export function ExercisePlayer({ title, questions, skill, topicId, onExit }: { title: string; questions: Question[]; skill: SkillKey; topicId?: string; onExit: () => void }) {
  const [index, setIndex] = useState(0), [selected, setSelected] = useState<number | null>(null), [submitted, setSubmitted] = useState(false), [correct, setCorrect] = useState(0), [done, setDone] = useState(false), [saving,setSaving]=useState(false), [mistakes,setMistakes]=useState<string[]>([]), [outcomes,setOutcomes]=useState<{skill:string;correct:boolean}[]>([])
  const startedAt=useRef(Date.now()); const { recordActivity, recommendation } = useApp(); const current = questions[index]
  const submit = () => { if (selected === null) return; const isCorrect=selected===current.answer; setSubmitted(true);setOutcomes(items=>[...items,{skill:current.skill,correct:isCorrect}]); if (isCorrect) setCorrect(c => c + 1); else setMistakes(items=>[...items,current.skill]) }
  const next = async () => {
    if (index === questions.length - 1) { const finalCorrect = correct; const score = Math.round(finalCorrect / questions.length * 100); setSaving(true); try{await recordActivity({ kind: skill === 'complexGrammar' ? 'Complex grammar' : title, title, score, xp: 30 + finalCorrect * 5, mistakes, outcomes, durationSeconds:Math.max(1,Math.round((Date.now()-startedAt.current)/1000)) }, skill, topicId);setDone(true)}finally{setSaving(false)} }
    else { setIndex(i => i + 1); setSelected(null); setSubmitted(false) }
  }
  if (done) { const score = Math.round(correct / questions.length * 100); const seconds=Math.max(1,Math.round((Date.now()-startedAt.current)/1000)); const weak=[...new Set(mistakes)]; const strong=[...new Set(questions.map(question=>question.skill))].filter(item=>!weak.includes(item)); return <div className="exercise-screen result-screen"><div className="result-ring" style={{'--score': `${score * 3.6}deg`} as React.CSSProperties}><div><strong>{correct}/{questions.length}</strong><span>{score}%</span></div></div><span className="eyebrow">Session complete</span><h1>{score >= 75 ? 'Excellent focus.' : 'Good work—keep building.'}</h1><p>You strengthened your understanding of {title.toLowerCase()}. Your skill profile and recommendations have been updated.</p><div className="result-grid"><div><span>Time</span><strong>{Math.floor(seconds/60)}m {seconds%60}s</strong></div><div><span>XP earned</span><strong>+{30 + correct * 5} XP</strong></div><div><span>Accuracy</span><strong>{score}%</strong></div></div><div className="result-insights"><div><span>Strong</span><strong>{strong.length?strong.join(', '):'Keep practising'}</strong></div><div><span>Needs practice</span><strong>{weak.length?weak.join(', '):'No repeated errors'}</strong></div><div><span>Recommended next</span><strong>{recommendation?.title||'Continue your learning path'}</strong></div></div><Button onClick={onExit}>{weak.length?'Practice weak areas':'Back to lessons'}</Button></div> }
  return <div className="exercise-screen">
    <div className="exercise-top"><button onClick={onExit} className="icon-button"><ChevronLeft/></button><div><strong>{title}</strong><span>{current.skill} · {current.level}</span></div><span>{index + 1} / {questions.length}</span></div>
    <ProgressBar value={(index + 1) / questions.length * 100}/>
    <div className="question-card"><div className="question-label">Choose the best answer</div><h1>{current.prompt}</h1><div className="answer-list">{current.options.map((option, i) => {
      let state = selected === i ? 'selected' : ''; if (submitted && i === current.answer) state = 'correct'; else if (submitted && selected === i) state = 'incorrect'
      return <button key={option} disabled={submitted} onClick={() => setSelected(i)} className={state}><span>{String.fromCharCode(65 + i)}</span>{option}{submitted && i === current.answer && <Check size={18}/>} {submitted && selected === i && i !== current.answer && <X size={18}/>}</button>
    })}</div>
    {submitted && <div className={`feedback ${selected === current.answer ? 'feedback-correct' : 'feedback-wrong'}`}><Lightbulb size={21}/><div><strong>{selected === current.answer ? 'That’s right.' : 'Not quite.'}</strong><p>{current.explanation}</p></div></div>}
    <div className="exercise-actions">{!submitted ? <Button onClick={submit} disabled={selected === null}>Check answer</Button> : <Button onClick={next} loading={saving}>{index === questions.length - 1 ? 'See results' : 'Next question'}</Button>}</div></div>
  </div>
}
