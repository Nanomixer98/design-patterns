/**
 * ! Patrón Bridge
 * Este patrón nos permite desacoplar una abstracción de su implementación,
 * de tal forma que ambas puedan variar independientemente.
 *
 * * Es útil cuando se tienen múltiples implementaciones de una abstracción
 * * Se puede utilizar para separar la lógica de negocio de la lógica de presentación
 * * Se puede utilizar para separar la lógica de la interfaz de usuario también.
 *
 * https://refactoring.guru/es/design-patterns/bridge
 */

import { COLORS } from "../helpers/colors.ts";

interface Ability {
  use(): void;
}

class SwordAttack implements Ability {
  use(): void {
    console.log('Attack with a %csword', COLORS.blue);
  }
}

class AxeAttack implements Ability {
  use(): void {
    console.log('Attack with an %caxe', COLORS.green);
  }
}

class MagicSpell implements Ability {
  use(): void {
    console.log('Attack with a %cmagic spell', COLORS.purple);
  }
}

class FireBallSpell implements Ability {
  use(): void {
    console.log('Attack with a %cfire ball spell', COLORS.red);
  }
}

abstract class Character {
  protected ability: Ability;

  constructor(ability: Ability) {
    this.ability = ability;
  }

  setAbility(ability: Ability): void {
    this.ability = ability;
  }

  abstract performAbility(): void;
}

class Warrior extends Character {
  override performAbility(): void {
    console.log('\nThe warrior is ready to fight');
    this.ability.use();
  }
}

class Mage extends Character {
  override performAbility(): void {
    console.log('\nThe mage is ready to cast spells');
    this.ability.use();
  }
}

function main() {
  const warrior = new Warrior(new SwordAttack());
  warrior.performAbility();
  warrior.setAbility(new AxeAttack());
  warrior.performAbility();

  const mage = new Mage(new MagicSpell());
  mage.performAbility();
  mage.setAbility(new FireBallSpell());
  mage.performAbility();
}

main();
