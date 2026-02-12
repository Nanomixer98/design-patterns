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

// Clase que representa un Pokémon
class Pokemon {
  name: string;
  type: string;

  constructor(name: string, type: string) {
    this.name = name;
    this.type = type;
  }
}

// Clase que representa la colección de Pokemons
class PokemonCollection {
  private pokemons: Pokemon[] = [];

  addPokemon(pokemon: Pokemon): void {
    this.pokemons.push(pokemon);
  }

  // Implementación del iterador usando una función generadora
  // *getPokemons(): IterableIterator<Pokemon> {
  //   for (const pokemon of this.pokemons) {
  //     yield pokemon;
  //   }
  // }

  // Implementación del iterador usando un método con Symbol.iterator
  // para hacer que la colección sea iterable
  // yield* delega la responsabilidad de la iteración a la colección de Pokemons
  *[Symbol.iterator](): IterableIterator<Pokemon> {
    yield* this.pokemons;
  }
}

// Código Cliente para probar el iterador con función generadora

function main(): void {
  const pokedex = new PokemonCollection();

  // Agregar Pokemones a la colección
  pokedex.addPokemon(new Pokemon('Pikachu', 'Electric'));
  pokedex.addPokemon(new Pokemon('Charmander', 'Fire'));
  pokedex.addPokemon(new Pokemon('Squirtle', 'Water'));
  pokedex.addPokemon(new Pokemon('Bulbasaur', 'Grass'));
  pokedex.addPokemon(new Pokemon('Greninja', 'Water'));
  pokedex.addPokemon(new Pokemon('Rayquaza', 'Dragon/Flying'));

  // Recorremos la colección usando for...of, gracias a la función generadora
  console.log('Recorriendo la colección de Pokemons:');
  // for (const pokemon of pokedex.getPokemons()) {
  //   console.log(`Pokémon: ${pokemon.name}, Tipo: ${pokemon.type}`);
  // }

  for (const pokemon of pokedex) {
    console.log(`Pokémon: ${pokemon.name}, Tipo: ${pokemon.type}`);
  }
}

main();
