import { COLORS } from "../helpers/colors.ts";

/**
 * ! Inmutabilidad con copia
 * Aunque la inmutabilidad es una buena práctica, no siempre es posible.
 * En estos casos, se puede hacer una copia del objeto y modificar la copia.
 *
 *  * Es útil para mantener un historial de estados en aplicaciones interactivas.
 *
 */
class CodeEditorState {
  constructor(
    readonly content: string,
    readonly cursorPosition: number,
    readonly unsavedChanges: boolean) {
  }

  copyWith({ content, cursorPosition, unsavedChanges }: Partial<CodeEditorState>): CodeEditorState {
    return new CodeEditorState(
      content ?? this.content,
      cursorPosition ?? this.cursorPosition,
      unsavedChanges ?? this.unsavedChanges);
  }

  displayState(): void {
    console.log(`\n%cCode Editor State: `, COLORS.green);
    console.log(`
            Content: ${this.content}
            Cursor Position: ${this.cursorPosition}
            Unsaved Changes: ${this.unsavedChanges}
        `);
  }
}

class CodeEditorHistory {
  private history: CodeEditorState[] = [];
  private currentIndex: number = -1;

  save(state: CodeEditorState): void {
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1);
    }
    this.history.push(state);
    this.currentIndex++;
  }

  redo(): CodeEditorState | null {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      return this.history[this.currentIndex];
    };

    return null;
  }

  undo(): CodeEditorState | null {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.history[this.currentIndex];
    };

    return null;
  }
}

function main() {
  const history = new CodeEditorHistory();
  let editorState = new CodeEditorState(
    'console.log("Hello, world!");',
    2,
    false
  )
  history.save(editorState);
  console.log('%cInitial state: ', COLORS.blue);
  editorState.displayState();

  editorState = editorState.copyWith({
    content: 'console.log("Hello, world! Updated");',
    cursorPosition: 3,
    unsavedChanges: true
  })
  history.save(editorState)
  console.log('%cUpdated state: ', COLORS.blue);
  editorState.displayState();

  console.log('%cUpdated cursor position state: ', COLORS.blue);
  editorState = editorState.copyWith({ cursorPosition: 5 });
  history.save(editorState)
  editorState.displayState();

  console.log('%cAfter undo state: ', COLORS.blue);
  editorState = history.undo()!;
  editorState.displayState();

  console.log('%cAfter redo state: ', COLORS.blue);
  editorState = history.redo()!;
  editorState.displayState();
}

main();
