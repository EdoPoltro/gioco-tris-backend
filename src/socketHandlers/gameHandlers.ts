import { Server, Socket } from 'socket.io';
import { checkQuadrantWinner, checkWinner, generateGame, generateGameCode, joinPlayer2Game, startGame } from '../utils/generateCode.js';
import type { Game } from '../models/game.model.js';

let games: Game[] = [];

export const registerGameHandlers = (io: Server, socket: Socket) => {
  
  socket.on('create-game', () => {
    console.log(`Player ${socket.id} is creating a game...`);

    const gameCode = generateGameCode();
    socket.join(gameCode);
    const game = generateGame(socket.id, gameCode);
    games.push(game);

    socket.emit('code-game', gameCode );
  });

  socket.on('join-game', (gameCode) => {
    console.log(`Player ${socket.id} is joining game ${gameCode}`);

    const msg = {
        success: false,
        description: '',
    }

    const game = games.find((game: Game) => game.gameCode == gameCode && game.status == 'waiting');

    if(game){
        msg.success = true;
        msg.description = 'Codice riconosciuto.';
        socket.join(gameCode);
        joinPlayer2Game(game, socket.id);
        startGame(game);
        io.to(gameCode).emit('start-game', game);
    }
    else
        msg.description = 'Codice non valido.';

    socket.emit('join-status', msg);
  });

  socket.on('update-game', (move: {i: number, j: number, gameCode: string}) => {
    console.log(`Player ${socket.id} is updateing a game...`);

    const game = games.find((game: Game) => game.gameCode == move.gameCode);

    if(!game) return; 

    if(game.currentPlayer == '1'){
      game.board[move.i]!.dial[move.j] = 'X';
      game.currentPlayer = '2';
    }
    else if(game.currentPlayer == '2'){
      game.board[move.i]!.dial[move.j] = 'O';
      game.currentPlayer = '1';
    }

    const dial = game.board[move.i]?.dial;
    if (!dial) return;
    const quadrantWinner = checkQuadrantWinner(dial);
    game.board[move.i]!.winner = quadrantWinner;

    const winner = checkWinner(game.board);

    if(['1','2','P'].includes(winner)){
      game.activeQuadrant = -1;
      game.status = 'finished';
    }
    else if(game.board[move.j]!.winner != '')
      game.activeQuadrant = null;
    else
      game.activeQuadrant = move.j as -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | null;
    io.to(game.gameCode).emit('share-update-game', game); 

    if(['1','2','P'].includes(winner))
      io.to(game.gameCode).emit('end-game', winner); 
  });

  socket.on('reconnect-request', (gameData: {gameCode: string, playerNumber: string}) => {
    console.log(`Player ${socket.id} is reconnecting...`);

    const game = games.find((game: Game) => game.gameCode == gameData.gameCode);

    if(!game) return;

    socket.join(game.gameCode);

    if(gameData.playerNumber === '1')
      game.player1 = socket.id;
    else if(gameData.playerNumber === '2')
      game.player2 = socket.id;
    
    socket.emit('reconnect-game', game);
  });
}; 
