/**
 * ! Patrón Facade
 * Este patrón proporciona una interfaz unificada para un conjunto de interfaces
 * en un subsistema.
 *
 * Facade define una interfaz de nivel más alto que hace que el subsistema
 * sea más fácil de usar.
 *
 * * Es útil cuando un subsistema es complejo o difícil de entender para
 * * proporcionar una interfaz simplificada para el cliente.
 *
 * https://refactoring.guru/es/design-patterns/facade
 */

import { COLORS } from "../helpers/colors.ts";

class Projector {
  turnOn() {
    console.log('Projector turned on');
  }

  turnOff() {
    console.log('Projector turned off');
  }
}

class SoundSystem {
  on() {
    console.log('Sound system turned on');
  }

  off() {
    console.log('Sound system turned off');
  }
}

class VideoPlayer {
  on() {
    console.log('Video player turned on');
  }

  play(movie: string) {
    console.log(`%cVideo player playing ${movie}`, COLORS.green);
  }

  stop() {
    console.log('Video player stopped');
  }

  off() {
    console.log('Video player turned off');
  }
}

class PopcornMachine {
  poppingPopcorn() {
    console.log('Popcorn machine turned on');
  }

  turnOffPoppingPopcorn() {
    console.log('Popcorn machine turned off');
  }
}

interface HomeTheaterFacadeOptions {
  projector: Projector;
  soundSystem: SoundSystem;
  videoPlayer: VideoPlayer;
  popcornMachine: PopcornMachine;
}

class HomeTheaterFacade {
  private projector: Projector;
  private soundSystem: SoundSystem;
  private videoPlayer: VideoPlayer;
  private popcornMachine: PopcornMachine;

  constructor({ projector, soundSystem, videoPlayer, popcornMachine }: HomeTheaterFacadeOptions) {
    this.projector = projector;
    this.soundSystem = soundSystem;
    this.videoPlayer = videoPlayer;
    this.popcornMachine = popcornMachine;
  }

  watchMovie(movie: string): void {
    console.log('%cPreparing to watch movie...', COLORS.purple);
    this.projector.turnOn();
    this.soundSystem.on();
    this.popcornMachine.poppingPopcorn();
    this.videoPlayer.on();
    this.videoPlayer.play(movie);

    console.log('%cEnjoying the movie!\n', COLORS.green);
  }

  endMovie(): void {
    console.log('%cEnding movie...', COLORS.red);
    this.videoPlayer.stop();
    this.popcornMachine.turnOffPoppingPopcorn();
    this.videoPlayer.off();
    this.soundSystem.off();
    this.projector.turnOff();
    console.log('%cMovie ended!\n', COLORS.green);
  }
}

function main() {
  const homeTheaterFacadeOption: HomeTheaterFacadeOptions = {
    popcornMachine: new PopcornMachine(),
    projector: new Projector(),
    soundSystem: new SoundSystem(),
    videoPlayer: new VideoPlayer(),
  }

  const homeTheaterFacade = new HomeTheaterFacade(homeTheaterFacadeOption);
  homeTheaterFacade.watchMovie('Terminator');
  homeTheaterFacade.endMovie();
}

main();
