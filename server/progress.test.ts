import { describe, expect, it } from 'vitest'
import { calculateSkillUpdate, summarizeActivity, type RecordedAttempt } from './progress.js'

const now = new Date('2026-09-21T12:00:00.000Z')
const attempt = (created_at: string, duration_seconds: number, xp = 0): RecordedAttempt => ({ created_at, duration_seconds, xp })

describe('activity summaries', () => {
  it('returns honest zero values for a learner with no activity', () => {
    expect(summarizeActivity([], now)).toEqual({
      dailyMinutes: 0,
      totalMinutes: 0,
      totalAttempts: 0,
      weeklyXp: 0,
      streak: 0,
      weeklyActivity: [
        { date: '2026-09-15', minutes: 0, xp: 0 },
        { date: '2026-09-16', minutes: 0, xp: 0 },
        { date: '2026-09-17', minutes: 0, xp: 0 },
        { date: '2026-09-18', minutes: 0, xp: 0 },
        { date: '2026-09-19', minutes: 0, xp: 0 },
        { date: '2026-09-20', minutes: 0, xp: 0 },
        { date: '2026-09-21', minutes: 0, xp: 0 },
      ],
    })
  })

  it('combines multiple sessions on the same day without inventing minimum minutes', () => {
    const result = summarizeActivity([
      attempt('2026-09-21T08:00:00.000Z', 20, 10),
      attempt('2026-09-21T09:00:00.000Z', 100, 15),
    ], now)
    expect(result.dailyMinutes).toBe(2)
    expect(result.weeklyXp).toBe(25)
    expect(result.totalAttempts).toBe(2)
  })

  it('places activity into a rolling seven-day window', () => {
    const result = summarizeActivity([
      attempt('2026-09-15T08:00:00.000Z', 60, 5),
      attempt('2026-09-18T08:00:00.000Z', 180, 15),
      attempt('2026-09-21T08:00:00.000Z', 120, 10),
    ], now)
    expect(result.weeklyActivity.map(day => day.minutes)).toEqual([1, 0, 0, 3, 0, 0, 2])
  })

  it('keeps all-time totals while excluding old activity from the weekly view', () => {
    const result = summarizeActivity([
      attempt('2026-08-01T08:00:00.000Z', 600, 100),
      attempt('2026-09-21T08:00:00.000Z', 120, 10),
    ], now)
    expect(result.totalMinutes).toBe(12)
    expect(result.weeklyXp).toBe(10)
  })

  it('counts a streak ending today', () => {
    const result = summarizeActivity([
      attempt('2026-09-19T08:00:00.000Z', 60),
      attempt('2026-09-20T08:00:00.000Z', 60),
      attempt('2026-09-21T08:00:00.000Z', 60),
    ], now)
    expect(result.streak).toBe(3)
  })

  it('preserves a streak through yesterday before today\'s practice', () => {
    const result = summarizeActivity([
      attempt('2026-09-18T08:00:00.000Z', 60),
      attempt('2026-09-19T08:00:00.000Z', 60),
      attempt('2026-09-20T08:00:00.000Z', 60),
    ], now)
    expect(result.streak).toBe(3)
  })

  it('resets a stale streak and ignores future-dated records', () => {
    const result = summarizeActivity([
      attempt('2026-09-18T08:00:00.000Z', 60, 5),
      attempt('2026-09-22T08:00:00.000Z', 600, 100),
    ], now)
    expect(result.streak).toBe(0)
    expect(result.totalAttempts).toBe(1)
    expect(result.totalMinutes).toBe(1)
  })
})

describe('skill updates', () => {
  it.each([
    { current: 50, attempt: 100, score: 58, delta: 8 },
    { current: 80, attempt: 20, score: 71, delta: -9 },
    { current: 0, attempt: 0, score: 0, delta: 0 },
    { current: 72, attempt: 72, score: 72, delta: 0 },
  ])('updates $current with a $attempt result', ({ current, attempt, score, delta }) => {
    expect(calculateSkillUpdate(current, attempt)).toEqual({ score, delta })
  })
})
