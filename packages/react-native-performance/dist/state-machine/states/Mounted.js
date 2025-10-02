"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var State_1 = tslib_1.__importDefault(require("./State"));
var Mounted = /** @class */ (function (_super) {
    tslib_1.__extends(Mounted, _super);
    function Mounted(props) {
        return _super.call(this, props) || this;
    }
    Mounted.prototype.getStateName = function () {
        return Mounted.STATE_NAME;
    };
    Mounted.prototype.cloneAsChild = function () {
        return new Mounted({
            destinationScreen: this.destinationScreen,
            componentInstanceId: this.componentInstanceId,
            snapshotId: this.snapshotId,
            timestamp: this.timestamp,
            previousState: this,
        });
    };
    Mounted.STATE_NAME = 'Mounted';
    return Mounted;
}(State_1.default));
exports.default = Mounted;
//# sourceMappingURL=Mounted.js.map