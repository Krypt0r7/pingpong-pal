export interface Player {
  name: string;
  score: number;
  color: string;
}

export interface GameState {
  p1: Player;
  p2: Player;
  startingServerIndex: number; // 0 or 1
  history: { p1: number; p2: number }[]; // For undo functionality
  winner: number | null; // 0 or 1, or null
  matchActive: boolean;
}

export enum CommentType {
  START = 'START',
  POINT_P1 = 'POINT_P1',
  POINT_P2 = 'POINT_P2',
  DEUCE = 'DEUCE',
  GAME_POINT = 'GAME_POINT',
  WIN = 'WIN',
  GENERIC = 'GENERIC'
}