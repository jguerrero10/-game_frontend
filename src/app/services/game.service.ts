import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Player {
  player1: string;
  player2: string;
}

interface Round {
  gameId: number;
  player1Move: string;
  player2Move: string;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // Registrar jugadores
  registerPlayer(playerName: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/players/`, { name: playerName });
}

createGame(player1Id: number, player2Id: number): Observable<any> {
  return this.http.post(`${this.apiUrl}/games/`, {
      player_1: player1Id,
      player_2: player2Id
  });
}
  // Crear una nueva ronda
  createRound(roundData: Round): Observable<any> {
    return this.http.post(`${this.apiUrl}/rounds/`, {
        game: roundData.gameId,
        player_1_move: roundData.player1Move,
        player_2_move: roundData.player2Move
    });
}

  // Obtener el estado del juego
  getGameStatus(gameId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/games/${gameId}/`);
  }
}
