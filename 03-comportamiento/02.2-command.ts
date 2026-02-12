/**
 * ! Patrón Command
 * Este patrón encapsula una solicitud como un objeto,
 * lo que le permite parametrizar otros objetos con diferentes solicitudes,
 * encolar solicitudes, o registrar solicitudes, y soporta operaciones que pueden deshacerse.
 *
 * Me gustó mucho la explicación de Refactoring Guru
 * https://refactoring.guru/es/design-patterns/command
 *
 * * Es útil cuando se necesita desacoplar el objeto que invoca
 * * la operación del objeto que sabe cómo realizarla.
 *
 */

import { COLORS } from '../helpers/colors.ts';

// 1. Interfaz Command
interface Command {
  execute(): void;
}

// 2. Clase Receptor - TextEditor

class TextEditor {
  private text: string = '';
  private clipboard: string = '';
  private history: string[] = [];

  // Agregar texto al editor
  type(text: string): void {
    this.history.push(this.text); // Guardar estado antes de cambiarlo
    this.text += text;
  }

  // Copiar el texto actual
  copy(): void {
    this.clipboard = this.text;
    console.log(
      `Text copied to clipboard: \n%c"${this.clipboard}"`,
      COLORS.blue
    );
  }

  // Pegar el texto del portapapeles
  paste(): void {
    this.history.push(this.text); // Guardar estado antes de pegar
    this.text += this.clipboard;
    console.log(`Text after paste: \n%c"${this.text}"`, COLORS.blue);
  }

  // Deshacer la última acción
  undo(): void {
    if (this.history.length > 0) {
      this.text = this.history.pop()!;
      console.log(`Text after undo: \n%c"${this.text}"`, COLORS.blue);
      return;
    }

    console.log('Nothing to undo.');
  }

  // Mostrar el texto actual
  getText(): string {
    return this.text;
  }
}

// 3. Clases de Comandos Concretos
class CopyCommand implements Command {
  constructor(private editor: TextEditor) { }
  execute(): void {
    this.editor.copy();
  }
}

class PasteCommand implements Command {
  constructor(private editor: TextEditor) { }
  execute(): void {
    this.editor.paste();
  }
}

class UndoCommand implements Command {
  constructor(private editor: TextEditor) { }
  execute(): void {
    this.editor.undo();
  }
}

// 4. Clase Cliente - Toolbar

class Toolbar {
  private commands: Record<string, Command> = {};

  setCommand(button: string, command: Command): void {
    this.commands[button] = command;
  }

  clickButton(button: string): void {
    if (!this.commands[button]) {
      console.log(`No command assigner for button: ${button}}`);
      return
    }
    this.commands[button].execute()
  }
}

// 5. Código Cliente para probar el patrón Command
// !Nada del código main debe ser modificado
function main() {
  const editor = new TextEditor();
  const toolbar = new Toolbar();

  // Crear comandos para el editor
  const copyCommand = new CopyCommand(editor);
  const pasteCommand = new PasteCommand(editor);
  const undoCommand = new UndoCommand(editor);

  // Asignar comandos a los botones de la barra de herramientas
  toolbar.setCommand('copy', copyCommand);
  toolbar.setCommand('paste', pasteCommand);
  toolbar.setCommand('undo', undoCommand);

  // Simulación de edición de texto
  editor.type('H');
  editor.type('o');
  editor.type('l');
  editor.type('a');
  editor.type(' ');
  editor.type('M');
  editor.type('u');
  editor.type('n');
  editor.type('d');
  editor.type('o');
  editor.type('!');
  console.log(`Current text: %c"${editor.getText()}"`, COLORS.green);

  // Usar la barra de herramientas
  console.log('\nCopying text...');
  toolbar.clickButton('copy');

  console.log('\nPasting text...');
  toolbar.clickButton('paste');

  console.log('\nUndoing the last action...');
  toolbar.clickButton('undo');

  console.log('\nUndoing again...');
  toolbar.clickButton('undo');

  console.log(`\nFinal text: "${editor.getText()}"`);
}

main();
