import { COLORS } from '../../helpers/colors.ts';

// TODO: Implementar el LoggerAdapter
export class LocalLogger {
  constructor(private file: string) { }

  writeLog(msg: string): void {
    console.log(`%c[${this.file} log] - ${msg}`, COLORS.blue);
  }

  writeError(msg: string): void {
    console.log(`%c[${this.file} error] - ${msg}`, COLORS.red);
  }

  writeWarning(msg: string): void {
    console.log(`%c[${this.file} warning] - ${msg}`, COLORS.yellow);
  }
}
