import { supabase } from './client';
import { Idiom } from '../types';

function isConfigured(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL;
  return !!url && !url.includes('your-project-ref');
}

export async function fetchRandomIdiom(): Promise<Idiom | null> {
  if (!isConfigured()) return null;

  try {
    const { data, error } = await supabase.from('idioms').select('*');
    if (error || !data || data.length === 0) return null;
    const index = Math.floor(Math.random() * data.length);
    return data[index];
  } catch {
    return null;
  }
}

export interface GameResultPayload {
  playerName: string;
  targetIdiom: string;
  guesses: unknown[];
  result: 'won' | 'lost';
  hintsUsed: number;
  durationMs: number | null;
}

export async function submitGameResult(payload: GameResultPayload): Promise<void> {
  if (!isConfigured()) return;

  const { error } = await supabase.from('game_sessions').insert({
    player_name: payload.playerName || '匿名玩家',
    target_idiom: payload.targetIdiom,
    guesses: payload.guesses,
    result: payload.result,
    hints_used: payload.hintsUsed,
    duration_ms: payload.durationMs,
  });

  if (error) throw error;
}

export interface LeaderboardEntry {
  player_name: string;
  hints_used: number;
  duration_ms: number;
  created_at: string;
}

export async function fetchLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
  if (!isConfigured()) return [];

  const { data, error } = await supabase
    .from('game_sessions')
    .select('player_name, hints_used, duration_ms, created_at')
    .eq('result', 'won')
    .order('duration_ms', { ascending: true })
    .limit(limit);

  if (error) throw error;
  return (data as LeaderboardEntry[]) || [];
}
