export enum LogLevel {
  // Additional information useful for debugging the package itself
  Debug = 0,
  // Additional information useful for debugging performance issues
  Info,
  // Not errors, but warnings that signalize that something goes not as expected
  Warn,
  // Both internal package errors and errors about incorrect usage of library's API
  Error,
}

/*
Logger class that allows specifying which log levels would be logged to the console.
(e.g., turning on Debug level would print all messages useful for debugging)
Since console.* calls are synchronous, logging happens only in a development environment (when React Native packager is running)
to ensure it doesn’t degrade the performance of a released application.
*/
export class Logger {
  logLevel: LogLevel;

  debug(message: string) {
    if (this.logLevel > LogLevel.Debug || !__DEV__) {
      return;
    }
    console.debug(message);
  }

  info(message: string) {
    if (this.logLevel > LogLevel.Info || !__DEV__) {
      return;
    }
    console.info(message);
  }

  warn(message: string) {
    if (this.logLevel > LogLevel.Warn || !__DEV__) {
      return;
    }
    console.warn(message);
  }

  error(message: string) {
    if (this.logLevel > LogLevel.Error || !__DEV__) {
      return;
    }
    console.error(message);
  }
}

const logger = new Logger();
export default logger;
