"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PromiseController = /** @class */ (function () {
    function PromiseController() {
        var _this = this;
        this._hasCompleted = false;
        this.promise = new Promise(function (resolve, reject) {
            _this.innerResolve = resolve;
            _this.innerReject = reject;
        });
    }
    PromiseController.prototype.resolve = function (result) {
        this._hasCompleted = true;
        this._result = result;
        this.innerResolve(result);
    };
    PromiseController.prototype.reject = function (rejectionReason) {
        this._hasCompleted = true;
        this._rejectionReason = rejectionReason;
        this.innerReject(rejectionReason);
    };
    Object.defineProperty(PromiseController.prototype, "result", {
        get: function () {
            return this._result;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PromiseController.prototype, "rejectionReason", {
        get: function () {
            return this._rejectionReason;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PromiseController.prototype, "hasCompleted", {
        get: function () {
            return this._hasCompleted;
        },
        enumerable: false,
        configurable: true
    });
    return PromiseController;
}());
exports.default = PromiseController;
//# sourceMappingURL=PromiseController.js.map