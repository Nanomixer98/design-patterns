/**
 * ! Patrón decorador
 * Es un patrón de diseño estructural que permite añadir
 * funcionalidades a objetos, colocando estos objetos dentro de
 * objetos encapsuladores especiales que contienen estas funcionalidades.
 *
 * No confundirlo con los decoradores de TypeScript que son anotaciones.
 *
 * * Es útil cuando necesitas añadir funcionalidades a objetos
 *  * de manera dinámica y flexible.
 *
 * https://refactoring.guru/es/design-patterns/decorator
 */

import { COLORS } from "../helpers/colors.ts";

interface Notification {
  send(message: string): void;
}

class BasicNotification implements Notification {
  send(message: string): void {
    console.log(`%cSending basic notification: ${message}`, COLORS.cyan);
  }
}

// Decorator class
abstract class NotificationDecorator implements Notification {
  constructor(protected notification: Notification) { }

  send(message: string): void {
    this.notification.send(message)
  }
}

// Different decorators
class EmailDecorator extends NotificationDecorator {
  private sendEmail(message: string) {
    console.log(`%cSending notification by email: ${message}`, COLORS.red);
  }

  override send(message: string): void {
    super.send(message);
    this.sendEmail(message)
  }
}

// Different decorators
class SMSDecorator extends NotificationDecorator {
  private sendSMS(message: string) {
    console.log(`%cSending notification by SMS: ${message}`, COLORS.yellow);
  }

  override send(message: string): void {
    super.send(message)
    this.sendSMS(message)
  }
}

function main() {
  let notification: Notification = new BasicNotification();
  notification = new EmailDecorator(notification);
  notification = new SMSDecorator(notification);
  notification.send('system alert')
}

main();
