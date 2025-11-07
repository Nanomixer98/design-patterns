/**
 * ! Patrón Prototype:

 * Es un patrón de diseño creacional que nos permite copiar objetos existentes sin hacer
 * que el código dependa de sus clases.
 * 
 * * Es útil cuando queremos duplicar el contenido, 
 * * el título y el autor de un documento, por ejemplo o cualquier objeto complejo.
 * 
 * https://refactoring.guru/es/design-patterns/prototype
 */

class Document {
  constructor(public title: string, private content: string, public author: string) { }

  displayInfo(): void {
    console.log(`Title: ${this.title}`);
    console.log(`Content: ${this.content}`);
    console.log(`Author: ${this.author}`);
  }

  clone(): Document {
    return new Document(this.title, this.content, this.author);
  }
}

function main() {
  const document = new Document('Cotizacion de productos', 'Cotizacion de productos de la empresa XYZ', 'Juan Perez');
  console.log({ document });
  document.displayInfo();

  // const document2 = {...document};
  // const document2 = structuredClone(document);
  const document2 = document.clone();
  console.log({ document2 });
  document2.displayInfo();
}

main();
