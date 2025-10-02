"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useErrorHandler = exports.ErrorHandlerContextProvider = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var ErrorHandlerContext = react_1.default.createContext(function () { });
exports.ErrorHandlerContextProvider = ErrorHandlerContext.Provider;
var useErrorHandler = function () {
    var errorHandler = (0, react_1.useContext)(ErrorHandlerContext);
    return errorHandler;
};
exports.useErrorHandler = useErrorHandler;
//# sourceMappingURL=error-handler.js.map