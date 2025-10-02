"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var counter = 0;
function inMemoryCounter() {
    var current = counter;
    counter += 1;
    return "".concat(current);
}
exports.default = inMemoryCounter;
//# sourceMappingURL=inMemoryCounter.js.map