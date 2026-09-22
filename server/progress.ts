export interface RecordedAttempt {
  created_at: string
  duration_seconds: number
  xp: number
}

export interface DailyActivity {
  date: string
  minutes: number
  xp: number
}

export interface ActivitySummary {
  dailyMinutes: number
  totalMinutes: number
  totalAttempts: number
  weeklyXp: number
  streak: number
  weeklyActivity: DailyActivity[]
}

const DAY_MS = 86_400_000

function utcDay(value: Date) {
  return value.toISOString().slice(0, 10)
}

function minutes(seconds: number) {
  return Math.round(Math.max(0, seconds) / 60)
}

/**
 * Produces all time-based profile statistics from the attempt ledger. Keeping
 * this calculation pure prevents cached counters from drifting away from the
 * activity that a learner can actually see.
 */
export function summarizeActivity(attempts: RecordedAttempt[], now = new Date()): ActivitySummary {
  const todayStart = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  const firstDay = todayStart - 6 * DAY_MS
  const buckets = Array.from({ length: 7 }, (_, index) => ({
    date: utcDay(new Date(firstDay + index * DAY_MS)),
    seconds: 0,
    xp: 0,
  }))
  const byDate = new Map(buckets.map((bucket, index) => [bucket.date, index]))
  const activeDays = new Set<string>()
  let totalSeconds = 0

  for (const attempt of attempts) {
    const timestamp = new Date(attempt.created_at)
    if (Number.isNaN(timestamp.getTime()) || timestamp.getTime() > now.getTime()) continue
    const duration = Math.max(0, Number(attempt.duration_seconds) || 0)
    const xp = Math.max(0, Number(attempt.xp) || 0)
    const date = utcDay(timestamp)
    totalSeconds += duration
    activeDays.add(date)
    const bucket = byDate.get(date)
    if (bucket !== undefined) {
      buckets[bucket].seconds += duration
      buckets[bucket].xp += xp
    }
  }

  const today = utcDay(new Date(todayStart))
  const yesterday = utcDay(new Date(todayStart - DAY_MS))
  let streak = 0
  let cursor = activeDays.has(today) ? todayStart : activeDays.has(yesterday) ? todayStart - DAY_MS : -1
  while (cursor >= 0 && activeDays.has(utcDay(new Date(cursor)))) {
    streak += 1
    cursor -= DAY_MS
  }

  const weeklyActivity = buckets.map(({ date, seconds, xp }) => ({ date, minutes: minutes(seconds), xp }))
  return {
    dailyMinutes: weeklyActivity[6].minutes,
    totalMinutes: minutes(totalSeconds),
    totalAttempts: attempts.filter(attempt => {
      const time = new Date(attempt.created_at).getTime()
      return !Number.isNaN(time) && time <= now.getTime()
    }).length,
    weeklyXp: weeklyActivity.reduce((sum, day) => sum + day.xp, 0),
    streak,
    weeklyActivity,
  }
}

export function calculateSkillUpdate(currentScore: number, attemptScore: number) {
  const score = Math.round(currentScore * 0.85 + attemptScore * 0.15)
  return { score, delta: score - currentScore }
}
