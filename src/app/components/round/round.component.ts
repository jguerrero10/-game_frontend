import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-round',
  standalone: true,
  templateUrl: './round.component.html',
  styleUrls: ['./round.component.css'],
  imports: [CommonModule]
})
export class RoundComponent {
  @Input() roundNumber!: number;
  @Input() player1!: string;
  @Input() player2!: string;
  @Input() winner: string | null = null;

  moves: string[] = ['Piedra', 'Papel', 'Tijera'];

  setPlayer1Move(event: Event) {
    const selectedMove = (event.target as HTMLSelectElement).value;
    console.log(`Jugador 1 seleccionó: ${selectedMove}`);
  }

  setPlayer2Move(event: Event) {
    const selectedMove = (event.target as HTMLSelectElement).value;
    console.log(`Jugador 2 seleccionó: ${selectedMove}`);
  }
}
