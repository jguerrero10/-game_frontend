import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { GameService } from '../services/game.service';

@Component({
  standalone: true,
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class GameComponent {
  playersForm: FormGroup;
  gameStarted = false;
  gameId: number | null = null;
  rounds: any[] = [];
  finalWinner: string | null = null;
  isLoading = false;
  moves = [
    { label: 'Piedra', value: 'rock' },
    { label: 'Papel', value: 'paper' },
    { label: 'Tijera', value: 'scissors' }
  ];
  player1 = '';
  player2 = '';

  constructor(
    private fb: FormBuilder,
    private gameService: GameService
  ) {
    this.playersForm = this.fb.group({
      player1: ['', Validators.required],
      player2: ['', Validators.required]
    });
  }

  // 👉 Registrar Jugadores
  registerPlayers() {
    if (this.playersForm.valid) {
        const { player1, player2 } = this.playersForm.value;

        // Registrar Jugador 1
        this.gameService.registerPlayer(player1).subscribe({
            next: (player1Response) => {
                const player1Id = player1Response.id;

                // Registrar Jugador 2
                this.gameService.registerPlayer(player2).subscribe({
                    next: (player2Response) => {
                        const player2Id = player2Response.id;

                        // Crear el juego con los IDs de los jugadores
                        this.gameService.createGame(player1Id, player2Id).subscribe({
                            next: (gameResponse) => {
                                this.gameId = gameResponse.id;
                                this.gameStarted = true;
                                this.rounds = [
                                    { player1Move: null, player2Move: null, winner: null },
                                    { player1Move: null, player2Move: null, winner: null },
                                    { player1Move: null, player2Move: null, winner: null }
                                ];
                            },
                            error: (err) => console.error('❌ Error al crear el juego:', err)
                        });
                    },
                    error: (err) => console.error('❌ Error al registrar Jugador 2:', err)
                });
            },
            error: (err) => console.error('❌ Error al registrar Jugador 1:', err)
        });
    } else {
        console.error('❌ El formulario no es válido');
    }
}

  setPlayer1Move(event: Event, index: number) {
    const target = event.target as HTMLSelectElement;
    this.rounds[index] = { ...this.rounds[index], player1Move: target.value };
    this.checkRoundResult(index);
}

setPlayer2Move(event: Event, index: number) {
    const target = event.target as HTMLSelectElement;

    if (!this.rounds[index].player1Move) {
        alert("⚠️ El Jugador 1 debe elegir su movimiento primero.");
        return;
    }

    this.rounds[index] = { ...this.rounds[index], player2Move: target.value };
    this.checkRoundResult(index);
}

  // 👉 Comprobar el resultado de la ronda
  checkRoundResult(index: number) {
    const round = this.rounds[index];

    if (round.player1Move && round.player2Move && this.gameId) {
      this.isLoading = true;

      this.gameService.createRound({ 
        gameId: this.gameId, 
        player1Move: round.player1Move, 
        player2Move: round.player2Move
      }).subscribe({
        next: (response: any) => {
          this.rounds[index].winner = response.winner_name;

          const player1Wins = this.rounds.filter(r => r.winner === this.player1).length;
          const player2Wins = this.rounds.filter(r => r.winner === this.player2).length;

          if (player1Wins === 3) {
            this.finalWinner = this.player1;
          } else if (player2Wins === 3) {
            this.finalWinner = this.player2;
          }

          this.isLoading = false;
        },
        error: (err: any) => {
          console.error('❌ Error al procesar la ronda:', err);
          this.isLoading = false;
        }
      });
    }
  }

  // 👉 Reiniciar el juego
  restartGame() {
    this.rounds = [
      { player1Move: null, player2Move: null, winner: null },
      { player1Move: null, player2Move: null, winner: null },
      { player1Move: null, player2Move: null, winner: null }
    ];
    this.finalWinner = null;
  }

  // 👉 Iniciar un juego nuevo
  newGame() {
    this.playersForm.reset();
    this.gameStarted = false;
    this.gameId = null;
    this.rounds = [];
    this.finalWinner = null;
  }
}
