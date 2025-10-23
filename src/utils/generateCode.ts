import type { Game } from "../models/game.model.js";

export function generateGameCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function generateGame(player1: string, gameCode: string): Game {
    const randomNumber = Math.floor(Math.random() * 2);
    const game: Game = {
        player1,
        gameCode,
        status: 'waiting',
        date: new Date(),
        board: Array.from({ length: 9 }, () => ({
            dial: Array(9).fill("") as string[],
            winner: '' as '1' | '2' | '' | 'P',
        })),
        currentPlayer: randomNumber === 0 ? '1' as '1' | '2' : '2' as '1' | '2',
        activeQuadrant: null,
    } 
    return game;
}

export function joinPlayer2Game(game: Game, player2: string) {
    game.player2 = player2;
}

export function startGame(game: Game) {
    game.status = 'started';
}

export function checkQuadrantWinner(dial: string[]): '' | '1' | '2' | 'P' {
  const winningCombinations: [number, number, number][] = [
    [0, 1, 2], // righe
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // colonne
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // diagonali
    [2, 4, 6],
  ];

  for (const [a, b, c] of winningCombinations) {
    if (dial[a] !== '' && dial[a] === dial[b] && dial[b] === dial[c]) {
      return dial[a] === 'X' ? '1' : '2';
    }
  }

  if (dial.every(cell => cell !== '')) {
    return 'P';
  }

  return '';
}

export function checkWinner(
  board: { dial: string[]; winner: '1' | '2' | '' | 'P' }[]
): '1' | '2' | '' | 'P' {
  const winningCombos: [number, number, number][] = [
    [0, 1, 2], // righe
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // colonne
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // diagonali
    [2, 4, 6],
  ];

  // Controllo vittoria globale (1 o 2)
  for (const [a, b, c] of winningCombos) {
    if (
      board[a] && board[b] && board[c] && // sicurezza contro undefined
      board[a].winner !== '' &&
      board[a].winner !== 'P' && // ignoriamo quadranti pareggiati
      board[a].winner === board[b].winner &&
      board[a].winner === board[c].winner
    ) {
      return board[a].winner;
    }
  }

  // Se tutti i quadranti hanno un winner assegnato, allora il game è pareggiato
  const allResolved = board.every(q => q.winner !== '');
  if (allResolved) return 'P';

  return '';
}
