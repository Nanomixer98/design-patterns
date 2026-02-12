/**
 * ! Patrón Iterator
 * Este patrón permite recorrer los elementos de una colección sin exponer
 * la estructura interna de la colección.
 *
 * * Es útil cuando se necesita recorrer una colección de elementos sin importar
 * * cómo se almacenan los elementos.
 *
 * https://refactoring.guru/es/design-patterns/iterator
 */

interface Iterator<T> {
  next(): T | null;
  hasNext(): boolean;
  current(): T | null;
}

// Clase que representa una Carta de la baraja
class Card {
  name: string;
  value: number;

  constructor(name: string, value: number) {
    this.name = name;
    this.value = value;
  }
}

// Clase que representa la colección de Cartas
class CardCollection {
  private cards: Card[] = [];

  addCard(card: Card): void {
    this.cards.push(card);
  }

  getCardAt(index: number): Card | null {
    if (index >= 0 && index < this.cards.length) {
      return this.cards[index]
    }
    return null;
  }

  getLength(): number {
    return this.cards.length;
  }

  createIterator(): CardsIterator {
    return new CardsIterator(this)
  }
}

class CardsIterator implements Iterator<Card> {
  private collection: CardCollection;
  private position: number = 0;

  constructor(collection: CardCollection) {
    this.collection = collection;
  }

  next(): Card | null {
    if (this.hasNext()) {
      return this.collection.getCardAt(this.position++)
    }
    return null;
  }

  hasNext(): boolean {
    return this.position < this.collection.getLength()
  }

  current(): Card | null {
    return this.collection.getCardAt(this.position)
  }
}

// Código Cliente para probar el iterador

function main(): void {
  const deck = new CardCollection();

  // Agregar algunas cartas a la colección
  deck.addCard(new Card('As de Corazones', 1));
  deck.addCard(new Card('Rey de Corazones', 13));
  deck.addCard(new Card('Reina de Corazones', 12));
  deck.addCard(new Card('Jota de Corazones', 11));

  // Recorrer la colección en orden usando for...of
  console.log('Recorriendo la colección de cartas:');
  const iteratior = deck.createIterator();
  while (iteratior.hasNext()) {
    const card = iteratior.next()
    console.log(`Carta: ${card?.name}, Valor: ${card?.value}`);
  }
}

main();
