import { describe, expect, it } from 'vitest'
import { evaluateIntegratedSummary, integratedSummaryTexts, publicIntegratedSummaryTexts } from './integratedSummary.js'

const passage=integratedSummaryTexts[0]
const strongSummary=`Urban heat is an unequal challenge for cities because vulnerable and low-income communities often experience the highest temperatures with the fewest resources for protection. Trees can provide shade and improve air quality; however, species selection, water use, maintenance, and the time needed for growth limit their immediate value. Greening may also cause gentrification by increasing rents and displacing residents, so housing protection should accompany environmental improvements. Building measures such as reflective roofs, insulation, and external shading can reduce indoor heat and energy demand, although their effectiveness depends on climate and incentives for landlords. Furthermore, local data is necessary because city averages can hide severe conditions in particular streets and homes. Officials must combine measurements with residents’ priorities when deciding where support is most urgent. Overall, effective policy requires combined physical and social action: cities should use trees and building improvements alongside community participation, housing safeguards, cooling centres, and workplace protection rather than relying on one technical solution.`

describe('integrated summary rubric',()=>{
  it('provides several substantial text variants without exposing answer keys',()=>{
    const publicTexts=publicIntegratedSummaryTexts()
    expect(publicTexts).toHaveLength(100)
    expect(publicTexts.every(text=>text.title.length>0&&text.subtitle.length>0)).toBe(true)
    expect(publicTexts.every(text=>text.paragraphs.length>=7)).toBe(true)
    expect(publicTexts.every(text=>text.paragraphs.join(' ').split(/\s+/).length>=900)).toBe(true)
    expect(publicTexts.every(text=>text.readingMinutes>=18)).toBe(true)
    expect(publicTexts.every(text=>!('keyPoints' in text))).toBe(true)
    expect(new Set(publicTexts.map(text=>text.id)).size).toBe(100)
    expect(new Set(publicTexts.map(text=>`${text.title} — ${text.subtitle}`)).size).toBe(100)
    expect(integratedSummaryTexts.every(text=>{const count=evaluateIntegratedSummary(text,'Planning draft for model comparison.').improvedSummary.trim().split(/\s+/).length;return count>=150&&count<=250})).toBe(true)
  })

  it('awards a strong rubric result for an original, complete summary',()=>{
    const result=evaluateIntegratedSummary(passage,strongSummary)
    expect(result.wordCount).toBeGreaterThanOrEqual(150)
    expect(result.wordCount).toBeLessThanOrEqual(250)
    expect(result.rubric.taskAchievement.score).toBeGreaterThanOrEqual(17)
    expect(result.rubric.organization.score).toBeGreaterThanOrEqual(8.5)
    expect(result.total).toBeGreaterThanOrEqual(33)
    expect(result.feedback.length).toBeGreaterThan(40)
    expect(result.mainIdeas).toHaveLength(passage.keyPoints.length)
    expect(result.mainIdeas.every(idea=>idea.paragraphIndex>=0&&idea.paragraphIndex<passage.paragraphs.length)).toBe(true)
    const modelWordCount=result.improvedSummary.trim().split(/\s+/).length
    expect(modelWordCount).toBeGreaterThanOrEqual(150)
    expect(modelWordCount).toBeLessThanOrEqual(250)
  })

  it('applies the task-achievement ceiling outside the word limit',()=>{
    const result=evaluateIntegratedSummary(passage,'Urban heat is unequal. Trees provide shade but need water and maintenance. Housing protection can prevent displacement. Reflective roofs reduce energy demand. Local data and residents should guide combined policy.')
    expect(result.rubric.taskAchievement.score).toBeLessThanOrEqual(14)
    expect(result.flags.some(flag=>flag.includes('under'))).toBe(true)
  })

  it('applies the one-paragraph ceiling to task achievement and organization',()=>{
    const split=strongSummary.replace('Furthermore,','\n\nFurthermore,')
    const result=evaluateIntegratedSummary(passage,split)
    expect(result.paragraphCount).toBe(2)
    expect(result.rubric.taskAchievement.score).toBeLessThanOrEqual(14)
    expect(result.rubric.organization.score).toBeLessThanOrEqual(7)
  })

  it('double-penalizes a response with at least 50% close source overlap',()=>{
    const copied=passage.paragraphs.slice(0,3).join(' ')
    const result=evaluateIntegratedSummary(passage,copied)
    expect(result.copiedPercent).toBeGreaterThanOrEqual(50)
    expect(result.rubric.taskAchievement.score).toBeLessThanOrEqual(8)
    expect(result.rubric.language.score).toBeLessThanOrEqual(4)
    expect(result.annotations.some(annotation=>annotation.type==='source-use')).toBe(true)
  })

  it('detects personal opinion as a task-format issue',()=>{
    const result=evaluateIntegratedSummary(passage,`${strongSummary} In my opinion, every city should copy this plan immediately.`)
    expect(result.rubric.taskAchievement.score).toBeLessThanOrEqual(14)
    expect(result.flags.some(flag=>flag.includes('Personal opinion'))).toBe(true)
    expect(result.annotations.some(annotation=>annotation.type==='opinion')).toBe(true)
  })
})
