"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.LogLevel = void 0;
var LogLevel;
(function (LogLevel) {
    // Additional information useful for debugging the package itself
    LogLevel[LogLevel["Debug"] = 0] = "Debug";
    // Additional information useful for debugging performance issues
    LogLevel[LogLevel["Info"] = 1] = "Info";
    // Not errors, but warnings that signalize that something goes not as expected
    LogLevel[LogLevel["Warn"] = 2] = "Warn";
    // Both internal package errors and errors about incorrect usage of library's API
    LogLevel[LogLevel["Error"] = 3] = "Error";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
/*
Logger class that allows specifying which log levels would be logged to the console.
(e.g., turning on Debug level would print all messages useful for debugging)
Since console.* calls are synchronous, logging happens only in a development environment (when React Native packager is running)
to ensure it doesn’t degrade the performance of a released application.
*/
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.prototype.debug = function (message) {
        if (this.logLevel > LogLevel.Debug || !__DEV__) {
            return;
        }
        console.debug(message);
    };
    Logger.prototype.info = function (message) {
        if (this.logLevel > LogLevel.Info || !__DEV__) {
            return;
        }
        console.info(message);
    };
    Logger.prototype.warn = function (message) {
        if (this.logLevel > LogLevel.Warn || !__DEV__) {
            return;
        }
        console.warn(message);
    };
    Logger.prototype.error = function (message) {
        if (this.logLevel > LogLevel.Error || !__DEV__) {
            return;
        }
        console.error(message);
    };
    return Logger;
}());
exports.Logger = Logger;
var logger = new Logger();
exports.default = logger;
//# sourceMappingURL=Logger.js.map