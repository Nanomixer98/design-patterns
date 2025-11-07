import { COLORS } from '../helpers/colors.ts';

/**
 * ! Patrón Builder:
 * Es un patrón de diseño creacional que nos permite construir objetos complejos
 * paso a paso.
 *
 * El patrón nos permite producir distintos tipos y representaciones
 * de un objeto empleando el mismo código de construcción.
 *
 * * Es útil cuando necesitamos construir un objeto complejo con muchas partes
 * * y queremos que el proceso de construcción sea independiente de las partes
 * * que lo componen.
 *
 * https://refactoring.guru/es/design-patterns/builder
 */
class Computer {
  public CPU: string = 'CPU - not defined';
  public RAM: string = 'RAM - not defined';
  public Storage: string = 'Storage - not defined';
  public GPU?: string = 'GPU - not defined';

  displayConfig() {
    console.log(`PC config:
        CPU: ${this.CPU}
        RAM: ${this.RAM}
        Storage: ${this.Storage}
        GPU: ${this.GPU ?? 'not defined'}
      `);
  }
}

class ComputerBuilder {
  private computer: Computer;

  constructor() {
    this.computer = new Computer();
  }

  setCPU(cpu: string): ComputerBuilder {
    this.computer.CPU = cpu;
    return this;
  }

  setRAM(ram: string): ComputerBuilder {
    this.computer.RAM = ram;
    return this;
  }

  setStorage(storage: string): ComputerBuilder {
    this.computer.Storage = storage;
    return this;
  }

  setGPU(gpu: string): ComputerBuilder {
    this.computer.GPU = gpu;
    return this;
  }

  build() {
    return this.computer;
  }
}

function main() {
  const basicComputer = new ComputerBuilder()
    .setCPU('Intel Core i7')
    .setRAM('16GB')
    .setStorage('256GB')
    .build();

  console.log('%cBasic Computer', COLORS.blue);
  basicComputer.displayConfig();

  const gamingComputer = new ComputerBuilder()
    .setCPU('AMD Ryzen 5')
    .setGPU('NVIDIA GeForce RTX 3060')
    .setRAM('32GB')
    .setStorage('1TB')
    .build();

  console.log('%cGaming Computer', COLORS.blue);
  gamingComputer.displayConfig();
}

main();
