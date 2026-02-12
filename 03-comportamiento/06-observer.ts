import { COLORS } from "../helpers/colors.ts";

/**
 * ! Patrón Observer
 * El patrón Observer es un patrón de diseño de comportamiento que establece
 * una relación de uno a muchos entre un objeto, llamado sujeto,
 * y otros objetos, llamados observadores, que son notificados
 * y actualizados automáticamente por el sujeto
 * cuando se producen cambios en su estado.
 *
 * * Es útil cuando necesitamos que varios objetos estén
 * * pendientes de los cambios
 *
 * !No confundirlo con RXJS Observables
 *
 * https://refactoring.guru/es/design-patterns/observer
 */
interface Observer {
  notify(videoTitle: string): void;
}

class YouTubeChannel {
  private subscribers: Observer[] = [];
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  subscribe(observer: Observer): void {
    this.subscribers.push(observer);
    console.log(`\nNew subscriber to channel %c${this.name}`, COLORS.green);
  }

  unsuscribe(observer: Observer): void {
    this.subscribers = this.subscribers.filter(sub => sub !== observer)
    console.log(`\nAn user has unsuscribed from ${this.name}`);
  }

  uploadVideo(videoTitle: string) {
    console.log(`\nChannel ${this.name} has uploaded a new video %c${videoTitle}\n`, COLORS.green);
    this.subscribers.forEach((sub) => {
      sub.notify(videoTitle)
    })
  }
}

class Subscriber implements Observer {
  constructor(private name: string) { }

  notify(videoTitle: string): void {
    console.log(`%c${this.name} %chas been notified: %cNew video ${videoTitle}`, COLORS.blue, COLORS.white, COLORS.green);
  }
}

function main() {
  const channel = new YouTubeChannel('Cocinando con Nanomixer');

  const user1 = new Subscriber('Nikki');
  const user2 = new Subscriber('Manolo');
  const user3 = new Subscriber('Miguelon');

  channel.subscribe(user1);
  channel.subscribe(user2);

  channel.uploadVideo('How to cook a new React tamal');

  channel.subscribe(user3);

  channel.uploadVideo('Angular al pastor')

  channel.unsuscribe(user2);

  channel.uploadVideo('Vue grilled')

  channel.unsuscribe(user1);

  channel.uploadVideo('Full stack barbecue')

  console.log('\n');
}

main();
