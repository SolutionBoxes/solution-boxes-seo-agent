import { Redis } from "@upstash/redis";

function getClient(): Redis | null {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

function dateKey(date: Date): string {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

export async function trackNewSession(): Promise<void> {
  const redis = getClient();
  if (!redis) return;
  try {
    const day = dateKey(new Date());
    await Promise.all([redis.incr("sessions:total"), redis.incr(`sessions:day:${day}`)]);
  } catch {
    // Analytics must never break the chat experience.
  }
}

export async function trackMessage(): Promise<void> {
  const redis = getClient();
  if (!redis) return;
  try {
    const day = dateKey(new Date());
    await Promise.all([redis.incr("messages:total"), redis.incr(`messages:day:${day}`)]);
  } catch {
    // Analytics must never break the chat experience.
  }
}

export interface DailyStat {
  date: string;
  sessions: number;
  messages: number;
}

export interface AnalyticsSummary {
  connected: boolean;
  totalSessions: number;
  totalMessages: number;
  messagesToday: number;
  dailyBreakdown: DailyStat[];
}

const EMPTY_SUMMARY: AnalyticsSummary = {
  connected: false,
  totalSessions: 0,
  totalMessages: 0,
  messagesToday: 0,
  dailyBreakdown: [],
};

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const redis = getClient();
  if (!redis) return EMPTY_SUMMARY;

  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(dateKey(d));
  }

  const [totalSessions, totalMessages, ...dayCounts] = await Promise.all([
    redis.get<number>("sessions:total"),
    redis.get<number>("messages:total"),
    ...days.flatMap((day) => [
      redis.get<number>(`sessions:day:${day}`),
      redis.get<number>(`messages:day:${day}`),
    ]),
  ]);

  const dailyBreakdown: DailyStat[] = days.map((date, i) => ({
    date,
    sessions: Number(dayCounts[i * 2] ?? 0),
    messages: Number(dayCounts[i * 2 + 1] ?? 0),
  }));

  return {
    connected: true,
    totalSessions: Number(totalSessions ?? 0),
    totalMessages: Number(totalMessages ?? 0),
    messagesToday: dailyBreakdown[dailyBreakdown.length - 1]?.messages ?? 0,
    dailyBreakdown,
  };
}
