"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListsProfilerContextProvider = exports.ListsProfilerContext = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
exports.ListsProfilerContext = react_1.default.createContext({
    onInteractive: function () { },
    onBlankArea: function () { },
});
exports.ListsProfilerContextProvider = exports.ListsProfilerContext.Provider;
//# sourceMappingURL=ListsProfilerContext.js.map