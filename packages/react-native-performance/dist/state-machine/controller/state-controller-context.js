"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStateController = exports.StateControllerContextProvider = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var utils_1 = require("../../utils");
var exceptions_1 = require("../../exceptions");
var DisabledStateController_1 = tslib_1.__importDefault(require("./DisabledStateController"));
var StateControllerContext = react_1.default.createContext(undefined);
exports.StateControllerContextProvider = StateControllerContext.Provider;
var useStateController = function (_a) {
    var _b = _a === void 0 ? {} : _a, destinationScreen = _b.destinationScreen;
    var stateController = (0, react_1.useContext)(StateControllerContext);
    var errorHandler = (0, utils_1.useErrorHandler)();
    var fallbackStateController = (0, react_1.useRef)(new DisabledStateController_1.default());
    if (stateController === undefined) {
        errorHandler(new exceptions_1.PerformanceProfilerUninitializedError(destinationScreen));
        return fallbackStateController.current;
    }
    return stateController;
};
exports.useStateController = useStateController;
//# sourceMappingURL=state-controller-context.js.map