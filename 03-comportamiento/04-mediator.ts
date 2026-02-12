/**
 * ! Patrón mediator
 * Es un patrón de diseño de comportamiento que ayuda a reducir
 * las dependencias desordenadas entre objetos.
 * Este patrón limita la comunicación directa entre ellos,
 * haciendo que solo interactúen a través de un objeto mediador.
 *
 * * Es útil reducir la complejidad de las relaciones entre objetos
 *
 * https://refactoring.guru/es/design-patterns/mediator
 */

import { COLORS } from "../helpers/colors.ts";

// Chatroom
class ChatRoom {
  private users: User[] = [];
  private title: string;

  constructor(title: string) {
    this.title = title;
    console.log(`${this.title} chatroom`);
  }

  addUser(user: User) {
    this.users.push(user);
  }

  sendMessage(sender: User, message: string) {
    const usersToSend = this.users.filter((user) => user !== sender)

    for (const user of usersToSend) {
      user.receiveMessage(sender, message)
    }
  }
}

class User {
  private username: string;
  private chatroom: ChatRoom;

  constructor(username: string, chatroom: ChatRoom) {
    this.username = username;
    this.chatroom = chatroom;
    chatroom.addUser(this);
  }

  sendMessage(message: string) {
    console.log(`%c\n${this.username} sends: %c${message}`, COLORS.blue, COLORS.white);
    this.chatroom.sendMessage(this, message)
  }

  receiveMessage(sender: User, message: string) {
    console.log(`%c\n${this.username} receives from ${sender.username}: %c${message}`, COLORS.blue, COLORS.white);
  }
}

function main() {
  const chatRoom = new ChatRoom('Grupo de trabajo');
  const user1 = new User('Nanomixer', chatRoom);
  const user2 = new User('Nikki', chatRoom);
  const user3 = new User('Chava', chatRoom);


  user1.sendMessage('Hello there');
  user2.sendMessage('How are you Nano?');
  user3.sendMessage(':sad_cat:');
}

main();
