"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var State_1 = tslib_1.__importDefault(require("./State"));
var Rendered = /** @class */ (function (_super) {
    tslib_1.__extends(Rendered, _super);
    function Rendered(_a) {
        var _this = this;
        var renderPassName = _a.renderPassName, interactive = _a.interactive, rest = tslib_1.__rest(_a, ["renderPassName", "interactive"]);
        _this = _super.call(this, rest) || this;
        _this.renderPassName = renderPassName;
        _this.interactive = interactive;
        return _this;
    }
    Rendered.prototype.getStateName = function () {
        return Rendered.STATE_NAME;
    };
    Rendered.prototype.toSimpleJson = function () {
        return tslib_1.__assign(tslib_1.__assign({}, _super.prototype.toSimpleJson.call(this)), { interactive: this.interactive, renderPassName: this.renderPassName });
    };
    Rendered.prototype.cloneAsChild = function () {
        return new Rendered({
            destinationScreen: this.destinationScreen,
            componentInstanceId: this.componentInstanceId,
            snapshotId: this.snapshotId,
            timestamp: this.timestamp,
            renderPassName: this.renderPassName,
            interactive: this.interactive,
            previousState: this,
        });
    };
    Rendered.STATE_NAME = 'Rendered';
    return Rendered;
}(State_1.default));
exports.default = Rendered;
//# sourceMappingURL=Rendered.js.map