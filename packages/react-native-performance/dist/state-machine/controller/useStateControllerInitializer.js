"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = require("react");
var EnabledStateController_1 = tslib_1.__importDefault(require("./EnabledStateController"));
var DisabledStateController_1 = tslib_1.__importDefault(require("./DisabledStateController"));
var ErrorHandlerStateController_1 = tslib_1.__importDefault(require("./ErrorHandlerStateController"));
function useStateControllerInitializer(_a) {
    var enabled = _a.enabled, errorHandler = _a.errorHandler, reportEmitter = _a.reportEmitter, useRenderTimeouts = _a.useRenderTimeouts, renderTimeoutMillis = _a.renderTimeoutMillis;
    var prevStateController = (0, react_1.useRef)(undefined);
    var newStateController = (function () {
        if (prevStateController.current === undefined || enabled !== prevStateController.current.isEnabled) {
            var innerController = enabled ? new EnabledStateController_1.default() : new DisabledStateController_1.default();
            return new ErrorHandlerStateController_1.default(innerController, errorHandler);
        }
        if (errorHandler !== prevStateController.current.errorHandler) {
            var innerController = prevStateController.current.innerStateController;
            return new ErrorHandlerStateController_1.default(innerController, errorHandler);
        }
        return prevStateController.current;
    })();
    if (prevStateController.current === undefined) {
        newStateController.onAppStarted();
    }
    (0, react_1.useEffect)(function () {
        newStateController.addStateChangedListener(reportEmitter);
        newStateController.configureRenderTimeout(useRenderTimeouts
            ? {
                enabled: true,
                onRenderTimeout: errorHandler,
                renderTimeoutMillis: renderTimeoutMillis,
            }
            : {
                enabled: false,
            });
        return function () {
            newStateController.removeStateChangedListener(reportEmitter);
            newStateController.configureRenderTimeout({ enabled: false });
        };
    });
    prevStateController.current = newStateController;
    return newStateController;
}
exports.default = useStateControllerInitializer;
//# sourceMappingURL=useStateControllerInitializer.js.map