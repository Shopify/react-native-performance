export declare enum LogLevel {
    Debug = 0,
    Info = 1,
    Warn = 2,
    Error = 3
}
export declare class Logger {
    logLevel: LogLevel;
    debug(message: string): void;
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
}
declare const logger: Logger;
export default logger;
//# sourceMappingURL=Logger.d.ts.map