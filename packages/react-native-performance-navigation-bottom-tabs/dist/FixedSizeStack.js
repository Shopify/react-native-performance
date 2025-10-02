"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FixedSizeStack = /** @class */ (function () {
    function FixedSizeStack(maxSize) {
        this.stack = new Array();
        this.maxSize = maxSize;
        if (maxSize <= 0) {
            throw new Error("maxSize must be > 0: ".concat(maxSize, "."));
        }
    }
    FixedSizeStack.prototype.push = function (item) {
        var deleteCount = this.stack.length - this.maxSize + 1;
        if (deleteCount > 0) {
            this.stack.splice(0, deleteCount);
        }
        this.stack.push(item);
    };
    FixedSizeStack.prototype.pop = function () {
        return this.stack.pop();
    };
    return FixedSizeStack;
}());
exports.default = FixedSizeStack;
//# sourceMappingURL=FixedSizeStack.js.map