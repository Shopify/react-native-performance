"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function matchesPattern(input, pattern) {
    return (pattern instanceof RegExp && pattern.test(input)) || pattern === input;
}
exports.default = matchesPattern;
//# sourceMappingURL=matches-pattern.js.map