"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var state_machine_1 = require("../state-machine");
var utils_1 = require("../utils");
var MockStateController_1 = tslib_1.__importDefault(require("./MockStateController"));
function profilerTestWrapper(stateController, errorHandler) {
    if (stateController === void 0) { stateController = new MockStateController_1.default(); }
    if (errorHandler === void 0) { errorHandler = jest.fn(); }
    var wrapper = function (_a) {
        var children = _a.children;
        return (react_1.default.createElement(state_machine_1.StateControllerContextProvider, { value: stateController },
            react_1.default.createElement(utils_1.ErrorHandlerContextProvider, { value: errorHandler }, children)));
    };
    return { wrapper: wrapper, stateController: stateController, errorHandler: errorHandler };
}
exports.default = profilerTestWrapper;
//# sourceMappingURL=profilerTestWrapper.js.map