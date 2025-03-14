import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface Player { id?: number; name: string; }
interface Game { id: number; player_1: Player; player_2: Player; is_finished: boolean; winner?: Player | null; }
interface Round { id?: number; game: number; player_1_move: string; player_2_move: string; winner: Player | null; }

@Injectable({ providedIn: 'root' })
export class GameService {
  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  registerPlayer(playerData: Player): Observable<Player> {
    return this.http.post<Player>(`${this.baseUrl}/players/`, playerData)
      .pipe(catchError(this.handleError));
  }

  createGame(gameData: { player_1: number; player_2: number }): Observable<Game> {
    return this.http.post<Game>(`${this.baseUrl}/games/`, gameData)
      .pipe(catchError(this.handleError));
  }

  createRound(roundData: Round): Observable<Round> {
    return this.http.post<Round>(`${this.baseUrl}/rounds/`, roundData)
      .pipe(catchError(this.handleError));
  }

  getGameStatus(gameId: number): Observable<Game> {
    return this.http.get<Game>(`${this.baseUrl}/games/${gameId}/`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en la API:', error);
    return throwError(() => new Error('Error en la comunicación con el servidor.'));
  }
}
