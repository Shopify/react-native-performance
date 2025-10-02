"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var State_1 = tslib_1.__importDefault(require("./State"));
var Unmounted = /** @class */ (function (_super) {
    tslib_1.__extends(Unmounted, _super);
    function Unmounted(props) {
        return _super.call(this, props) || this;
    }
    Unmounted.prototype.getStateName = function () {
        return Unmounted.STATE_NAME;
    };
    Unmounted.prototype.cloneAsChild = function () {
        return new Unmounted({
            destinationScreen: this.destinationScreen,
            componentInstanceId: this.componentInstanceId,
            snapshotId: this.snapshotId,
            timestamp: this.timestamp,
            previousState: this,
        });
    };
    Unmounted.STATE_NAME = 'Unmounted';
    return Unmounted;
}(State_1.default));
exports.default = Unmounted;
//# sourceMappingURL=Unmounted.js.map