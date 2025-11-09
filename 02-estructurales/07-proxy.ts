import { COLORS } from "../helpers/colors.ts";

/**
 * ! Patrón Proxy
 * Este patrón se utiliza para controlar el acceso a un objeto, es decir,
 * se crea un objeto que actúa como intermediario entre el cliente y el objeto real.
 *
 * * Es útil cuando necesitamos controlar el acceso a un objeto,
 * * por ejemplo, para verificar si el cliente tiene permiso
 * * para acceder a ciertos métodos o propiedades.
 *
 * https://refactoring.guru/es/design-patterns/proxy
 *
 */
class Player {
  name: string;
  level: number;

  constructor(name: string, level: number) {
    this.name = name;
    this.level = level;
  }
}

interface Room {
  enter(player: Player): void;
}

class SecretRoom implements Room {
  enter(player: Player): void {
    console.log(`%c Welcome to the secret room ${player.name}!`, COLORS.green);
    console.log('A grand reward awaits you!');
  }
}

// Proxy class - magic portal
class MagicPortal implements Room {
  private secretRoom: SecretRoom;

  constructor(room: SecretRoom) {
    this.secretRoom = room
  }

  enter(player: Player): void {
    if (player.level >= 10) {
      this.secretRoom.enter(player);
      return;
    }

    console.log(`%c Access denied for ${player.name}. You need to be level 10 to enter the secret room.`, COLORS.red);
  }
}

function main() {
  const secretRoom = new SecretRoom();
  const magicPortal = new MagicPortal(secretRoom);

  const player = new Player('John', 10);
  const player2 = new Player('Jane', 5);

  magicPortal.enter(player);
  console.log('\n');

  magicPortal.enter(player2);
  console.log('\n');
}

main();
