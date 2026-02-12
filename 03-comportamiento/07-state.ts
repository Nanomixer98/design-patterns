/**
 * ! Patrón State
 * Este patrón permite a un objeto cambiar su comportamiento
 * cuando su estado interno cambia.
 *
 * * Es útil cuando un objeto tiene un comportamiento que depende de su estado
 * * y debe cambiar su comportamiento en tiempo de ejecución dependiendo de ese estado.
 *
 * https://refactoring.guru/es/design-patterns/state
 */

import { COLORS } from "../helpers/colors.ts";
import { sleep } from "../helpers/sleep.ts";

/**
 * * Objetivo: Implementar el patrón State para simular el funcionamiento
 * * de una máquina expendedora.
 * * La máquina tiene diferentes estados,
 *  * Como Esperando Dinero,
 *  * Seleccionando Producto,
 *  * Entregando Producto,
 * * y su comportamiento varía dependiendo del estado actual.
 */
interface State {
  name: string;

  insertMoney(): void;
  selectProduct(): void;
  dispenseProduct(): void;
}

class VendingMachine {
  private state: State;

  constructor() {
    this.state = new WaitingForMoney(this);
  }

  insertMoney(): void {
    this.state.insertMoney();
  }

  selectProduct(): void {
    this.state.selectProduct();
  };

  dispenseProduct(): void {
    this.state.dispenseProduct();
  };

  setState(newState: State) {
    this.state = newState;
    console.log(`State changed to: %c${newState.name}`, COLORS.yellow);
  }

  getStateName(): string {
    return this.state.name;
  }

}
// States
class WaitingForMoney implements State {
  public name: string = 'Waiting money';
  private vendingMachine: VendingMachine;

  constructor(vendingMachine: VendingMachine) {
    this.vendingMachine = vendingMachine;
  }

  insertMoney(): void {
    console.log('Money inserted. %cNow choose a product', COLORS.green);
    this.vendingMachine.setState(new ProductSelected(this.vendingMachine));
  }

  selectProduct(): void {
    console.log('%cFirst you need to insert the money.', COLORS.red);
  }

  dispenseProduct(): void {
    console.log('%cFirst you need to insert the money.', COLORS.red);
  }
}

class ProductSelected implements State {
  public name: string = 'Selecting product';
  private vendingMachine: VendingMachine;

  constructor(vendingMachine: VendingMachine) {
    this.vendingMachine = vendingMachine;
  }

  insertMoney(): void {
    console.log('%cPlease select a product - Money alredy inserted', COLORS.red);
  }

  selectProduct(): void {
    this.vendingMachine.setState(new DispensingProduct(this.vendingMachine))
  }

  dispenseProduct(): void {
    console.log('%cFirst you need to select a product.', COLORS.red);
  }
}

class DispensingProduct implements State {
  public name: string = 'Dispensing product';
  private vendingMachine: VendingMachine;

  constructor(vendingMachine: VendingMachine) {
    this.vendingMachine = vendingMachine;
  }

  insertMoney(): void {
    console.log('%cPlease wait for the product to dispense', COLORS.red);
  }

  selectProduct(): void {
    console.log('%cProduct already chosen and its way', COLORS.red);
  }

  dispenseProduct(): void {
    console.log('%cProduct dispensed. Changin to Waiting money', COLORS.green);
    this.vendingMachine.setState(new WaitingForMoney(this.vendingMachine))
  }
}

async function main() {
  const vendingMachine = new VendingMachine();

  let selectedOption: string | null = '4';

  do {
    console.clear();
    console.log(`Select an option: %c${vendingMachine.getStateName()}`, COLORS.pink);

    selectedOption = prompt(
      `
                1. Insertar dinero
                2. Seleccionar producto
                3. Dispensar producto
                4. Salir

                Option: `
    );

    switch (selectedOption) {
      case '1':
        vendingMachine.insertMoney()
        break;
      case '2':
        vendingMachine.selectProduct()
        break;
      case '3':
        vendingMachine.dispenseProduct()
        break;
      case '4':
        console.log('See ya');
        break;
      default:
        console.log('No valid option');
        break;
    }

    await sleep(3000);
  } while (selectedOption !== '4');
}

main();
