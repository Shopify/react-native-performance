"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var State = /** @class */ (function () {
    function State(_a) {
        var destinationScreen = _a.destinationScreen, componentInstanceId = _a.componentInstanceId, previousState = _a.previousState, snapshotId = _a.snapshotId, timestamp = _a.timestamp;
        this.destinationScreen = destinationScreen;
        this.componentInstanceId = componentInstanceId;
        this.previousState = previousState;
        this.snapshotId = snapshotId;
        this.timestamp = timestamp;
    }
    State.prototype.toString = function () {
        return JSON.stringify(this.toSimpleJson(), undefined, 2);
    };
    State.prototype.toSimpleJson = function () {
        var _a;
        return {
            name: this.getStateName(),
            destinationScreen: this.destinationScreen,
            componentInstanceId: this.componentInstanceId,
            previousState: (_a = this.previousState) === null || _a === void 0 ? void 0 : _a.getStateName(),
            timestamp: this.timestamp,
        };
    };
    return State;
}());
exports.default = State;
//# sourceMappingURL=State.js.map