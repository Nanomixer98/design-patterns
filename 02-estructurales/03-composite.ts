/**
 * ! Patrón Composite
 * Es un patrón de diseño estructural que permite componer objetos
 * en estructuras de árbol para representar jerarquías.
 *
 * El patrón permite a los clientes tratar de manera uniforme a los objetos
 * individuales y a sus composiciones.
 *
 * * Es útil cuando necesitas tratar a los objetos individuales
 * * y a sus composiciones de manera uniforme, y la estructura
 * * de los objetos forma una jerarquía en árbol.
 *
 * https://refactoring.guru/es/design-patterns/composite
 *
 */

interface FileSystemComponent {
  showDetails(indent?: string): void;
}

class File implements FileSystemComponent {

  constructor(private name: string) { }

  showDetails(indent?: string): void {
    console.log(`${indent}- File: ${this.name}`);
  }
}

class Folder implements FileSystemComponent {
  private contents: FileSystemComponent[] = []

  constructor(
    private name: string,
  ) { }

  add(component: FileSystemComponent) {
    this.contents.push(component);
  }

  showDetails(indent: string = ''): void {
    console.log(`${indent}- Folder: ${this.name}`);
    this.contents.forEach(component => component.showDetails(indent + '\t'));
  }
}

function main() {
  const file1 = new File('file1.txt');
  const file2 = new File('file2.txt');
  const file3 = new File('file3.txt');
  const file4 = new File('file4.txt');

  const rootFolder = new Folder('root');
  const folder1 = new Folder('folder1');
  const folder2 = new Folder('folder2');
  const folder3 = new Folder('folder3');
  const folder4 = new Folder('folder4');

  folder1.add(file1);
  folder1.add(file2);

  folder2.add(file3);
  folder2.add(folder3);
  folder2.add(folder4);

  folder3.add(file4);

  rootFolder.add(folder1);
  rootFolder.add(folder2);
  rootFolder.showDetails()
}

main();
