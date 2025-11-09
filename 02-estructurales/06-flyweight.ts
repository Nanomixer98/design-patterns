/**
 * ! Patrón Flyweight
 * Es un patrón de diseño estructural que nos permite usar objetos compartidos
 * para soportar eficientemente grandes cantidades de objetos.
 *
 * * Es útil cuando necesitamos una gran cantidad de objetos y queremos reducir
 * * la cantidad de memoria que utilizan.
 *
 * https://refactoring.guru/es/design-patterns/flyweight
 */

import { COLORS } from "../helpers/colors.ts";

interface Location {
  display(coordinates: { x: number, y: number }): void;
}

// Flyweight
class LocationMarker implements Location {

  constructor(
    private type: string,
    private iconImage: string,
  ) { }

  display(coordinates: { x: number; y: number; }): void {
    console.log(
      `Coords: ${this.type} en ${coordinates.x}, ${coordinates.y} with icon %c[${this.iconImage}]`,
      COLORS.green
    );
  }
}

// Flyweights factory
class LocationFactory {
  private icons: Record<string, LocationMarker> = {};

  getLocationIcon(type: string): LocationMarker {
    if (!this.icons[type]) {
      console.log(`%c| Creating new instance of icon for ${type} |`, COLORS.orange);
      const iconImage = `image_of_${type.toLocaleLowerCase()}.png`;
      this.icons[type] = new LocationMarker(type, iconImage)
    }

    return this.icons[type];
  }
}

class MapLocation {
  private coodinates: { x: number, y: number };
  private icon: LocationMarker;

  constructor(x: number, y: number, icon: LocationMarker) {
    this.coodinates = { x, y };
    this.icon = icon;
  }

  display() {
    this.icon.display(this.coodinates)
  }
}

function main() {
  const factory = new LocationFactory();
  const locations = [
    new MapLocation(10, 20, factory.getLocationIcon('house')),
    new MapLocation(100, 200, factory.getLocationIcon('school')),
    new MapLocation(240, 10, factory.getLocationIcon('house')),
    new MapLocation(10, 20, factory.getLocationIcon('hospital')),
    new MapLocation(3450, 320, factory.getLocationIcon('house')),
    new MapLocation(510, 520, factory.getLocationIcon('house')),
    new MapLocation(610, 620, factory.getLocationIcon('park')),
    new MapLocation(610, 620, factory.getLocationIcon('park')),
    new MapLocation(710, 720, factory.getLocationIcon('restaurant')),
    new MapLocation(1010, 1020, factory.getLocationIcon('house')),
    new MapLocation(1110, 1120, factory.getLocationIcon('house')),
    new MapLocation(1210, 1220, factory.getLocationIcon('house')),
    new MapLocation(1310, 1320, factory.getLocationIcon('house')),
    new MapLocation(1410, 1420, factory.getLocationIcon('house')),
  ]

  locations.forEach(location => location.display());
}

main();
