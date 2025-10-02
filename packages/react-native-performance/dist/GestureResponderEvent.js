"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGestureResponderEvent = void 0;
function isGestureResponderEvent(obj) {
    var _a;
    return typeof ((_a = obj === null || obj === void 0 ? void 0 : obj.nativeEvent) === null || _a === void 0 ? void 0 : _a.timestamp) === 'number';
}
exports.isGestureResponderEvent = isGestureResponderEvent;
//# sourceMappingURL=GestureResponderEvent.js.map