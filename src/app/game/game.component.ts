import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { GameService } from '../services/game.service';

@Component({
  standalone: true,
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  imports: [ReactiveFormsModule, CommonModule, FormsModule]
})
export class GameComponent {
  playersForm: FormGroup;
  gameStarted = false;
  gameId: number | null = null;
  rounds: any[] = [{ player1Move: null, player2Move: null, winner: null }];
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

      this.gameService.registerPlayer(player1).subscribe({
        next: (player1Response) => {
          const player1Id = player1Response.id;

          this.gameService.registerPlayer(player2).subscribe({
            next: (player2Response) => {
              const player2Id = player2Response.id;

              this.gameService.createGame(player1Id, player2Id).subscribe({
                next: (gameResponse) => {
                  this.gameId = gameResponse.id;
                  this.gameStarted = true;
                  this.rounds = [{ player1Move: null, player2Move: null, winner: null }];
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

  // 👉 Establecer movimiento del jugador 1
  setPlayer1Move(index: number) {
    this.checkRoundResult(index);
  }

  // 👉 Establecer movimiento del jugador 2
  setPlayer2Move(index: number) {
    if (!this.rounds[index].player1Move) {
      alert('⚠️ El Jugador 1 debe elegir su movimiento primero.');
      return;
    }
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
          if (response.message) {
            // El juego ha terminado, mostrar el mensaje del ganador final
            this.finalWinner = response.message;
          } else {
            // El juego no ha terminado, mostrar el ganador de la ronda
            this.rounds[index].winner = response.winner_name;
            
            // Agregar una nueva ronda solo si el juego no ha terminado
            this.rounds.push({ player1Move: null, player2Move: null, winner: null });
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
  this.gameId = null;

  const { player1, player2 } = this.playersForm.value;

  this.gameService.registerPlayer(`${player1}`).subscribe({
      next: (player1Response) => {
          const player1Id = player1Response.id;

          this.gameService.registerPlayer(`${player2}`).subscribe({
              next: (player2Response) => {
                  const player2Id = player2Response.id;

                  this.gameService.createGame(player1Id, player2Id).subscribe({
                      next: (gameResponse) => {
                          this.gameId = gameResponse.id;

                          this.gameStarted = true;

                          this.rounds = [
                              { player1Move: null, player2Move: null, winner: null }
                          ];

                          this.finalWinner = null;
                      },
                      error: (err) => {
                          console.error('❌ Error al crear el nuevo juego:', err);
                          alert('❌ Error al crear el nuevo juego.');
                      }
                  });
              },
              error: (err) => console.error('❌ Error al registrar Jugador 2:', err)
          });
      },
      error: (err) => console.error('❌ Error al registrar Jugador 1:', err)
  });
}

  // 👉 Iniciar un juego nuevo
newGame() {
  this.gameId = null;

  const { player1, player2 } = this.playersForm.value;

  this.gameService.registerPlayer(`${player1} (Nuevo)`).subscribe({
      next: (player1Response) => {
          const player1Id = player1Response.id;

          this.gameService.registerPlayer(`${player2} (Nuevo)`).subscribe({
              next: (player2Response) => {
                  const player2Id = player2Response.id;

                  this.gameService.createGame(player1Id, player2Id).subscribe({
                      next: (gameResponse) => {
                          this.gameId = gameResponse.id;
                          this.gameStarted = true;

                          // Mostrar solo una ronda inicial (el backend controla cuándo termina)
                          this.rounds = [
                              { player1Move: null, player2Move: null, winner: null }
                          ];

                          this.finalWinner = null;
                      },
                      error: (err) => {
                          console.error('❌ Error al crear el nuevo juego:', err);
                          alert('❌ Error al crear el nuevo juego.');
                      }
                  });
              },
              error: (err) => console.error('❌ Error al registrar Jugador 2:', err)
          });
      },
      error: (err) => console.error('❌ Error al registrar Jugador 1:', err)
  });
}


}
