"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reverseReduce = exports.reverseTraverse = exports.getFlowStartState = exports.UndefinedPreviousStateError = void 0;
var tslib_1 = require("tslib");
var exceptions_1 = require("../../exceptions");
var Started_1 = tslib_1.__importDefault(require("./Started"));
var UndefinedPreviousStateError = /** @class */ (function (_super) {
    tslib_1.__extends(UndefinedPreviousStateError, _super);
    function UndefinedPreviousStateError(destinationScreen, state) {
        var _this = _super.call(this, "Only flow start states are allowed to have an undefined previous state. ".concat(state), 'bug') || this;
        _this.name = 'UndefinedPreviousStateError';
        _this.destinationScreen = destinationScreen;
        Object.setPrototypeOf(_this, UndefinedPreviousStateError.prototype);
        return _this;
    }
    return UndefinedPreviousStateError;
}(exceptions_1.PerformanceProfilerError));
exports.UndefinedPreviousStateError = UndefinedPreviousStateError;
function getFlowStartState(state) {
    if (state instanceof Started_1.default) {
        return state;
    }
    if (state.previousState === undefined) {
        throw new UndefinedPreviousStateError(state.destinationScreen, state);
    }
    return getFlowStartState(state.previousState);
}
exports.getFlowStartState = getFlowStartState;
function normalize(options) {
    var _a;
    return {
        stopAtStartState: (_a = options === null || options === void 0 ? void 0 : options.stopAtStartState) !== null && _a !== void 0 ? _a : true,
    };
}
function reverseTraverse(start, operation, options) {
    var stopAtStartState = normalize(options).stopAtStartState;
    var current = start;
    while (current !== undefined) {
        var abort = operation(current);
        if (abort === true) {
            break;
        }
        if (stopAtStartState && current instanceof Started_1.default) {
            break;
        }
        current = current.previousState;
    }
}
exports.reverseTraverse = reverseTraverse;
function reverseReduce(start, operation, initial, options) {
    var reduced = initial;
    reverseTraverse(start, function (state) {
        reduced = operation(state, reduced);
    }, options);
    return reduced;
}
exports.reverseReduce = reverseReduce;
//# sourceMappingURL=state-utils.js.map