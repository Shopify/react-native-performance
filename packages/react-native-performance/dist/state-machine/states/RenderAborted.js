"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var State_1 = tslib_1.__importDefault(require("./State"));
var RenderAborted = /** @class */ (function (_super) {
    tslib_1.__extends(RenderAborted, _super);
    function RenderAborted(props) {
        return _super.call(this, props) || this;
    }
    RenderAborted.prototype.getStateName = function () {
        return RenderAborted.STATE_NAME;
    };
    RenderAborted.prototype.cloneAsChild = function () {
        return new RenderAborted({
            destinationScreen: this.destinationScreen,
            componentInstanceId: this.componentInstanceId,
            snapshotId: this.snapshotId,
            timestamp: this.timestamp,
            previousState: this,
        });
    };
    RenderAborted.STATE_NAME = 'RenderAborted';
    return RenderAborted;
}(State_1.default));
exports.default = RenderAborted;
//# sourceMappingURL=RenderAborted.js.map