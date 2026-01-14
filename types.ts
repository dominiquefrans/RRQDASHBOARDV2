
export type Role = 'Goldlane' | 'Explaner' | 'Jungler' | 'Midlane' | 'Roamer';

export interface Match {
  id: string;
  date: string;
  opponent: string;
  rrqHeroes: Record<Role, string>;
  oppHeroes: Record<Role, string>;
  rrqBans: string[];
  oppBans: string[];
  winner: 'RRQ' | 'Opp';
}

export interface HeroStats {
  hero: string;
  pick: number;
  ban: number;
  win: number;
  pickRate: number;
  banRate: number;
  presence: number;
  winRate: number;
  impact: number;
}

export enum AppView {
  RECORD = 'record',
  STATS = 'stats',
  MATCHES = 'matches',
  META = 'meta',
  H2H = 'h2h',
  AI = 'ai',
  CHATBOT = 'chatbot',
  SYNC = 'sync'
}
