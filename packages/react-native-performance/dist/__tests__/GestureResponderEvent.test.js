"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GestureResponderEvent_1 = require("../GestureResponderEvent");
describe('GestureResponderEvent', function () {
    describe('isGestureResponderEvent', function () {
        it('returns true if the object contains a number native event timestamp', function () {
            expect((0, GestureResponderEvent_1.isGestureResponderEvent)({ nativeEvent: { timestamp: 1234 } })).toBe(true);
        });
        it('returns false if the object does not contain a number native event timestamp', function () {
            expect((0, GestureResponderEvent_1.isGestureResponderEvent)({ nativeEvent: {} })).toBe(false);
            expect((0, GestureResponderEvent_1.isGestureResponderEvent)({ nativeEvent: { timestamp: '1234' } })).toBe(false);
            expect((0, GestureResponderEvent_1.isGestureResponderEvent)({ foo: 1234 })).toBe(false);
        });
    });
});
//# sourceMappingURL=GestureResponderEvent.test.js.map