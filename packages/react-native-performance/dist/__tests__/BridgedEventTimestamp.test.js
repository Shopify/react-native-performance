"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/ban-ts-comment */
var BridgedEventTimestamp_1 = require("../BridgedEventTimestamp");
var utils_1 = require("../utils");
jest.mock('../utils', function () {
    return {
        getNativeTime: jest.fn(),
    };
});
describe('BridgedEventTimestamp', function () {
    beforeEach(function () {
        jest.spyOn(Date, 'now').mockReturnValue(1000);
    });
    afterEach(function () {
        jest.resetAllMocks();
    });
    it('just records the JS event timestamp when no native timestamp is provided', function () {
        var timestamp = new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().build();
        expect(timestamp.jsTimestamp).toBe(1000);
        expect(timestamp.nativeTimestamp).toBeUndefined();
    });
    it('records the native timestamp with epoch reference when one is provided as a number', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var timestamp, _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    timestamp = new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(2000).epochReference().build();
                    expect(timestamp.jsTimestamp).toBe(1000);
                    _a = expect;
                    return [4 /*yield*/, timestamp.nativeTimestamp];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toBe(2000);
                    return [2 /*return*/];
            }
        });
    }); });
    it('records the native timestamp with epoch reference when one is provided as a promise', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var timestamp, _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    timestamp = new BridgedEventTimestamp_1.BridgedEventTimestampBuilder()
                        .nativeTimestamp(Promise.resolve(1500))
                        .epochReference()
                        .build();
                    expect(timestamp.jsTimestamp).toBe(1000);
                    _a = expect;
                    return [4 /*yield*/, timestamp.nativeTimestamp];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toBe(1500);
                    return [2 /*return*/];
            }
        });
    }); });
    it("clears the native timestamp when 'undefined' is provided", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var timestamp, _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    timestamp = new BridgedEventTimestamp_1.BridgedEventTimestampBuilder()
                        .nativeTimestamp(1000)
                        .nativeTimestamp(undefined)
                        .epochReference()
                        .build();
                    expect(timestamp.jsTimestamp).toBe(1000);
                    _a = expect;
                    return [4 /*yield*/, timestamp.nativeTimestamp];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    it('skips translation when native time is given in epoch', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var timestamp, _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    // @ts-ignore
                    utils_1.getNativeTime.mockReturnValueOnce(Promise.resolve({
                        nativeTimeSinceEpochMillis: 1150,
                        nativeUptimeMillis: 500,
                    }));
                    timestamp = new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(900).systemBootReference().build();
                    _a = expect;
                    return [4 /*yield*/, timestamp.nativeTimestamp];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toBe(900);
                    return [2 /*return*/];
            }
        });
    }); });
    it('translates the native timestamp to epoch reference when one is provided in the system boot reference', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var timestamp, _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    // @ts-ignore
                    utils_1.getNativeTime.mockReturnValueOnce(Promise.resolve({
                        // i.e., 150 ms latency over the bridge
                        nativeTimeSinceEpochMillis: 1150,
                        // i.e., system had been up for 5000ms when the timestamp was 1150 in the native layer
                        nativeUptimeMillis: 500,
                    }));
                    timestamp = new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(100).systemBootReference().build();
                    /**
                     * Reversing the 150 ms latency, the system had been up for (500 - 150) = 350ms when the JS call was made.
                     *
                     * Requested boot-reference timestamp that needs to be translated: 100.
                     *
                     * So 350-100 = 250ms had passed b/w the input timestamp and "now".
                     * So the translated epoch-reference timestamp must have happened 250ms in the past = 1000 - 250 = 750
                     */
                    _a = expect;
                    return [4 /*yield*/, timestamp.nativeTimestamp];
                case 1:
                    /**
                     * Reversing the 150 ms latency, the system had been up for (500 - 150) = 350ms when the JS call was made.
                     *
                     * Requested boot-reference timestamp that needs to be translated: 100.
                     *
                     * So 350-100 = 250ms had passed b/w the input timestamp and "now".
                     * So the translated epoch-reference timestamp must have happened 250ms in the past = 1000 - 250 = 750
                     */
                    _a.apply(void 0, [_b.sent()]).toBe(750);
                    return [2 /*return*/];
            }
        });
    }); });
    it('returns undefined jsNativeLatency if no native timestamp is available', function () {
        expect(new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().build().jsNativeLatency).toBeUndefined();
    });
    it('calculates the jsNativeLatency if epoch-reference native timestamp is available', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = expect;
                    return [4 /*yield*/, new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(100).build().jsNativeLatency];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toBe(900);
                    return [2 /*return*/];
            }
        });
    }); });
    it('calculates the jsNativeLatency if boot-reference native timestamp is available', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    // @ts-ignore
                    utils_1.getNativeTime.mockReturnValueOnce(Promise.resolve({
                        // i.e., 150 ms latency over the bridge
                        nativeTimeSinceEpochMillis: 1150,
                        // i.e., system had been up for 5000ms when the timestamp was 1150 in the native layer
                        nativeUptimeMillis: 500,
                    }));
                    // translated epoch-reference timestamp = 750
                    // jsNativeLatency = 1000 - 750 = 250
                    _a = expect;
                    return [4 /*yield*/, new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(100).systemBootReference().build().jsNativeLatency];
                case 1:
                    // translated epoch-reference timestamp = 750
                    // jsNativeLatency = 1000 - 750 = 250
                    _a.apply(void 0, [_b.sent()]).toBe(250);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=BridgedEventTimestamp.test.js.map