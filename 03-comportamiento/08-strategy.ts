/**
 * ! Patrón Strategy
 *
 * El patrón Strategy es un patrón de diseño de software que define una
 * familia de algoritmos, los encapsula y los hace intercambiables.
 *
 *
 * * Es útil cuando se tiene una clase que tiene un comportamiento que puede
 * * cambiar en tiempo de ejecución y se quiere delegar la responsabilidad de
 * * la implementación a otra clase.
 *
 * https://refactoring.guru/es/design-patterns/strategy
 */

import { COLORS } from "../helpers/colors.ts";

/**
 * !Objetivo: Explicar el patrón Strategy usando un ejemplo donde varios
 * ! patitos compiten en una carrera y cada uno tiene su propia
 * ! estrategia de movimiento (por ejemplo, nadar, volar o caminar).
 */
interface MovementStrategy {
  move(): void;
}

// Strategy #1 - Fast but expensive
class SwimFast implements MovementStrategy {
  move(): void {
    console.log('%cThe duck swims fast on the water\n', COLORS.blue);
  }
}

// Strategy #2 - Not so fast but less expensive
class FlyOverWater implements MovementStrategy {
  move(): void {
    console.log('%cThe duck flies glantly above the water\n', COLORS.pink);
  }
}

// Strategy #3 - Slow and economic
class WalkClumsily implements MovementStrategy {
  move(): void {
    console.log('%cThe duck walks clumsily on the shore\n', COLORS.yellow);
  }
}

// Strategies applier
class Duck {
  private name: string;
  private movementStrategy: MovementStrategy;

  constructor(name: string, strategy: MovementStrategy) {
    this.name = name;
    this.movementStrategy = strategy;

    console.log(`%c${name} %cready to compete`, COLORS.green, COLORS.white);
  }

  performMove() {
    console.log(`${this.name} is ready to move on...`);
    this.movementStrategy.move();
  }

  setMovementStrategy(strategy: MovementStrategy) {
    this.movementStrategy = strategy;
    console.log(`${this.name} changed strategy.\n`);
  }
}

function main() {
  const duck1 = new Duck('Fast ducky', new SwimFast());
  const duck2 = new Duck('Flying ducky', new FlyOverWater());
  const duck3 = new Duck('Clumsy ducky', new WalkClumsily());

  console.log('\n%cDucks race begin!\n', COLORS.orange);
  duck1.performMove();
  duck2.performMove();
  duck3.performMove();

  duck3.setMovementStrategy(new FlyOverWater());
  duck3.performMove()

  duck3.setMovementStrategy(new SwimFast());
  duck3.performMove()
}

main();
