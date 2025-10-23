export interface Game {
    id?: string; // o number dipende come funziona il db
    gameCode: string;
    player1: string;
    player2?: string;
    board: { 
        dial: string[],
        winner: '1' | '2' | '' | 'P',
    }[];
    status: 'waiting' | 'started' | 'finished';
    date: Date;
    currentPlayer: '1' | '2';
    activeQuadrant: -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | null;
}  