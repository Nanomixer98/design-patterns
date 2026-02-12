/**
 * ! Patrón Chain of Responsibility
 * Es un patrón de diseño de comportamiento que te permite pasar solicitudes
 * a lo largo de una cadena de manejadores.
 *
 * * Es útil cuando se necesita procesar datos de diferentes maneras, pero no
 * * se sabe de antemano qué tipo de procesamiento se necesita o en qué orden
 * * pero se sabe que se necesita procesar en una secuencia.
 *
 * https://refactoring.guru/es/design-patterns/chain-of-responsibility
 */

import { COLORS } from "../helpers/colors.ts";

interface Handler {
  setNext(handler: Handler): Handler;
  handle(request: string): void;
}

abstract class BaseHandler implements Handler {
  private nextHandler?: Handler;

  setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    return handler
  }

  handle(request: string): void {
    if (this.nextHandler) {
      this.nextHandler.handle(request)
    }
  }
}

// Basic support
class BasicSupport extends BaseHandler {
  override handle(request: string): void {
    if (request === 'basic') {
      console.log('%c > Basic support: Solving basic problem', COLORS.green);
      console.log('\n');
      return;
    }
    console.log('%c ==> Basic support: escaling problem to advanced support', COLORS.yellow);
    super.handle(request);
  }
}

// Advanced support
class AdvancedSupport extends BaseHandler {
  override handle(request: string): void {
    if (request === 'advanced') {
      console.log('%c > Advanced support: Solving basic problem', COLORS.green);
      console.log('\n');
      return;
    }
    console.log('%c ==> Advanced support: escaling problem to expert support', COLORS.orange);
    super.handle(request);
  }
}

// Expert support
class ExpertSupport extends BaseHandler {
  override handle(request: string): void {
    if (request === 'expert') {
      console.log('%c > Expert support: Solving basic problem', COLORS.green);
      console.log('\n');
      return;
    }
    console.log('%c ==> Expert support: Nothing to do... Help!', COLORS.red);
  }
}

function main() {
  const basicSuport = new BasicSupport();
  const advancedSuport = new AdvancedSupport();
  const expertSuport = new ExpertSupport();

  basicSuport.setNext(advancedSuport).setNext(expertSuport);
  basicSuport.handle('basic');
  basicSuport.handle('advanced');
  basicSuport.handle('expert');
  basicSuport.handle('nuclear');
}

main();
