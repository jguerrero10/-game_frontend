import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // <-- Importar CommonModule

@Component({
  selector: 'app-game',
  standalone: true,
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  imports: [ReactiveFormsModule, CommonModule] // <-- Agregar CommonModule aquí
})
export class GameComponent {
  playersForm: FormGroup;
  player1: string = '';
  player2: string = '';
  gameStarted: boolean = false;

  moves: string[] = ['Piedra', 'Papel', 'Tijera'];
  rounds: any[] = [];
  finalWinner: string | null = null;

  constructor(private fb: FormBuilder) {
    this.playersForm = this.fb.group({
      player1: ['', Validators.required],
      player2: ['', Validators.required]
    });
  }

  registerPlayers() {
    this.player1 = this.playersForm.value.player1;
    this.player2 = this.playersForm.value.player2;
    this.gameStarted = true;
    this.rounds = [];
    this.finalWinner = null;
  }

  setPlayer1Move(event: any, index: number) {
    const move = (event.target as HTMLSelectElement).value;
    this.rounds[index] = { ...this.rounds[index], player1Move: move };
  }

  setPlayer2Move(event: any, index: number) {
    const move = (event.target as HTMLSelectElement).value;
    this.rounds[index] = { ...this.rounds[index], player2Move: move };

    const round = this.rounds[index];
    if (round.player1Move && round.player2Move) {
      const winner = this.determineWinner(round.player1Move, round.player2Move);
      this.rounds[index].winner = winner;

      const player1Wins = this.rounds.filter(r => r.winner === this.player1).length;
      const player2Wins = this.rounds.filter(r => r.winner === this.player2).length;

      if (player1Wins === 3) {
        this.finalWinner = this.player1;
      } else if (player2Wins === 3) {
        this.finalWinner = this.player2;
      }
    }
  }

  determineWinner(move1: string, move2: string): string | 'Empate' {
    if (move1 === move2) return 'Empate';
    if (
      (move1 === 'Piedra' && move2 === 'Tijera') ||
      (move1 === 'Papel' && move2 === 'Piedra') ||
      (move1 === 'Tijera' && move2 === 'Papel')
    ) {
      return this.player1;
    }
    return this.player2;
  }

  restartGame() {
    this.playersForm.reset();
    this.player1 = '';
    this.player2 = '';
    this.gameStarted = false;
    this.rounds = [];
    this.finalWinner = null;
  }
}
