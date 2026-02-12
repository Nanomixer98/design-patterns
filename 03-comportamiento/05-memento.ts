/**
 * !Patrón Memento
 * Permite capturar y externalizar un estado interno de un objeto,
 * de manera que el objeto pueda ser restaurado a ese estado más tarde.
 *
 * * Es útil cuando se necesita guardar el estado de un objeto para poder
 * * volver a él en un futuro.
 *
 * https://refactoring.guru/es/design-patterns/memento
 */

import { COLORS } from "../helpers/colors.ts";

class GameMemento {
  private level: number;
  private health: number;
  private position: string;

  constructor(level: number, health: number, position: string) {
    this.level = level;
    this.health = health;
    this.position = position;
  }

  getLevel() {
    return this.level;
  }

  getHealth() {
    return this.health;
  }

  getPosition() {
    return this.position;
  }
}

class Game {
  private level: number = 1;
  private health: number = 100;
  private position: string = 'Begining';

  constructor() {
    console.log(`
           Playing on level ${this.level}
           health: ${this.health}
           position: ${this.position}
        `);
  }

  save(): GameMemento {
    return new GameMemento(this.level, this.health, this.position)
  }

  play(level: number, health: number, position: string) {
    this.level = level;
    this.health = health;
    this.position = position;

    console.log(`
           Playing on level ${this.level}
           health: ${this.health}
           position: ${this.position}
        `);
  }

  restore(memento: GameMemento): void {
    this.level = memento.getLevel();
    this.health = memento.getHealth();
    this.position = memento.getPosition();

    console.log(`%cProgress restored.
            %clevel ${this.level}
            health: ${this.health}
            position: ${this.position}
         `, COLORS.yellow, COLORS.blue);
  }
}

class GameHistory {
  private mementos: GameMemento[] = [];

  push(memento: GameMemento) {
    this.mementos.push(memento)
  }

  pop(): GameMemento | undefined {
    return this.mementos.pop();
  }
}

function main() {
  const game = new Game();
  const history = new GameHistory();

  history.push(game.save());

  // Player progress on the game
  game.play(2, 90, 'Enchanted forest');
  history.push(game.save());

  game.play(3, 70, 'Dark cave');
  history.push(game.save());

  game.play(4, 50, 'Dragon castle');
  history.push(game.save());

  console.log('%cCurrent state', COLORS.green);
  game.restore(history.pop()!)
  game.restore(history.pop()!)
  game.restore(history.pop()!)
}

main();
