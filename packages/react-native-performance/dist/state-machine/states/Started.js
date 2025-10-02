"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var State_1 = tslib_1.__importDefault(require("./State"));
var Started = /** @class */ (function (_super) {
    tslib_1.__extends(Started, _super);
    function Started(_a) {
        var _this = this;
        var sourceScreen = _a.sourceScreen, type = _a.type, rest = tslib_1.__rest(_a, ["sourceScreen", "type"]);
        _this = _super.call(this, rest) || this;
        _this.sourceScreen = sourceScreen;
        _this.type = type;
        return _this;
    }
    Started.prototype.getStateName = function () {
        return Started.STATE_NAME;
    };
    Started.prototype.updateState = function (newDestinationScreen, newComponentInstanceId) {
        return new Started({
            timestamp: this.timestamp,
            componentInstanceId: newComponentInstanceId,
            snapshotId: this.snapshotId,
            previousState: this.previousState,
            type: this.type,
            sourceScreen: this.sourceScreen,
            destinationScreen: newDestinationScreen,
        });
    };
    Started.prototype.cloneAsChild = function () {
        return new Started({
            timestamp: this.timestamp,
            componentInstanceId: this.componentInstanceId,
            destinationScreen: this.destinationScreen,
            snapshotId: this.snapshotId,
            type: this.type,
            sourceScreen: this.sourceScreen,
            previousState: this,
        });
    };
    Started.prototype.toSimpleJson = function () {
        return tslib_1.__assign(tslib_1.__assign({}, _super.prototype.toSimpleJson.call(this)), { sourceScreen: this.sourceScreen, type: this.type });
    };
    Started.STATE_NAME = 'Started';
    return Started;
}(State_1.default));
exports.default = Started;
//# sourceMappingURL=Started.js.map