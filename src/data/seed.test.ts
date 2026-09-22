import { describe, expect, it } from 'vitest'
import { complexTopics, diagnosticQuestions, grammarTopics, readings, vocabularyQuestions } from './seed'

const allQuestions=[
  ...grammarTopics.flatMap(topic=>topic.questions),
  ...complexTopics.flatMap(topic=>topic.questions),
  ...readings.flatMap(reading=>reading.questions),
  ...vocabularyQuestions,
  ...diagnosticQuestions,
]

describe('curriculum variants',()=>{
  it('gives every answer variant a valid correct option',()=>{
    for(const question of allQuestions){
      expect(question.options.length).toBeGreaterThanOrEqual(2)
      expect(question.answer).toBeGreaterThanOrEqual(0)
      expect(question.answer).toBeLessThan(question.options.length)
    }
  })

  it('keeps question ids unique within each delivered exercise set',()=>{
    for(const questions of [
      ...grammarTopics.map(topic=>topic.questions),
      ...complexTopics.map(topic=>topic.questions),
      ...readings.map(reading=>reading.questions),
      vocabularyQuestions,
      diagnosticQuestions,
    ])expect(new Set(questions.map(question=>question.id)).size).toBe(questions.length)
  })

  it('includes direct writing variants in the diagnostic',()=>{
    expect(diagnosticQuestions.filter(question=>question.skill.startsWith('Writing'))).toHaveLength(2)
    expect(diagnosticQuestions).toHaveLength(12)
  })

  it('does not ship learner progress in curriculum content',()=>{
    expect([...grammarTopics,...complexTopics].every(topic=>topic.progress===0)).toBe(true)
  })

  it('provides a substantial reading and main-idea practice bank',()=>{
    expect(readings).toHaveLength(15)
    expect(new Set(readings.map(reading=>reading.id)).size).toBe(readings.length)
    expect(readings.every(reading=>reading.text.length>=3&&reading.questions.length>=3)).toBe(true)
    expect(readings.every(reading=>reading.questions.some(question=>question.skill==='Main Idea'))).toBe(true)
    expect(new Set(readings.map(reading=>reading.title)).size).toBe(readings.length)
    expect(new Set(readings.map(reading=>reading.category)).size).toBeGreaterThanOrEqual(10)
  })
})
