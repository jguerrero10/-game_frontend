import { Component } from '@angular/core';
import { GameComponent } from './game/game.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [GameComponent],
  template: 
  `
  <app-game></app-game>
  `
})
export class AppComponent {
  title = 'Piedra, Papel o Tijera Games';
}
