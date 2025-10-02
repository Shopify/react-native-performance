"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BridgedEventTimestampBuilder = void 0;
var tslib_1 = require("tslib");
var utils_1 = require("./utils");
var BridgedEventTimestampBuilder = /** @class */ (function () {
    function BridgedEventTimestampBuilder() {
        this._systemBootReference = false;
    }
    BridgedEventTimestampBuilder.prototype.nativeTimestamp = function (nativeTimestamp) {
        if (nativeTimestamp === undefined) {
            this._nativeTimestamp = undefined;
        }
        else if (typeof nativeTimestamp === 'number') {
            this._nativeTimestamp = Promise.resolve(nativeTimestamp);
        }
        else {
            this._nativeTimestamp = nativeTimestamp;
        }
        return this;
    };
    BridgedEventTimestampBuilder.prototype.systemBootReference = function () {
        this._systemBootReference = true;
        return this;
    };
    BridgedEventTimestampBuilder.prototype.epochReference = function () {
        this._systemBootReference = false;
        return this;
    };
    BridgedEventTimestampBuilder.prototype.build = function () {
        if (this._nativeTimestamp === undefined) {
            return new BridgedEventTimestamp(Date.now(), undefined);
        }
        if (!this._systemBootReference) {
            return new BridgedEventTimestamp(Date.now(), this._nativeTimestamp);
        }
        var _a = translateNativeTimestampToEpochReference(this._nativeTimestamp), jsNowWithEpochReference = _a.jsNowWithEpochReference, nativeTimestampWithEpochReference = _a.nativeTimestampWithEpochReference;
        return new BridgedEventTimestamp(jsNowWithEpochReference, nativeTimestampWithEpochReference);
    };
    return BridgedEventTimestampBuilder;
}());
exports.BridgedEventTimestampBuilder = BridgedEventTimestampBuilder;
var BridgedEventTimestamp = /** @class */ (function () {
    function BridgedEventTimestamp(jsTimestamp, nativeTimestamp) {
        this.jsTimestamp = jsTimestamp;
        this.nativeTimestamp = nativeTimestamp;
    }
    Object.defineProperty(BridgedEventTimestamp.prototype, "jsNativeLatency", {
        /**
         * The time it took for the native event to be consumed on the JS side.
         */
        get: function () {
            var _this = this;
            return this.nativeTimestamp && this.nativeTimestamp.then(function (timestamp) { return _this.jsTimestamp - timestamp; });
        },
        enumerable: false,
        configurable: true
    });
    BridgedEventTimestamp.prototype.toString = function () {
        return ("{" +
            "jsTimestamp: ".concat(this.jsTimestamp, ", ") +
            "nativeTimestamp: ".concat(this.nativeTimestamp === undefined ? 'undefined' : 'Promise<number>', ", ") +
            "jsNativeLatency: ".concat(this.jsNativeLatency === undefined ? 'undefined' : 'Promise<number>') +
            "}");
    };
    return BridgedEventTimestamp;
}());
exports.default = BridgedEventTimestamp;
/**
 * Native timestamp we receive for example from a touch event is referencing system boot time.
 * We need to work with time referencing epoch (UNIX) time - this function will translate the timestamp between the two.
 * @param nativeTimestampWithSystemBootReference: Timestamp received from native context from react-native referencing system boot time.
 * @returns Timestamp referencing system boot time.
 */
function translateNativeTimestampToEpochReference(nativeTimestampWithSystemBootReference) {
    var jsNowWithEpochReference = Date.now();
    var nativeTimestampWithEpochReference = Promise.all([(0, utils_1.getNativeTime)(), nativeTimestampWithSystemBootReference]).then(function (_a) {
        var _b = tslib_1.__read(_a, 2), _c = _b[0], nativeNowWithEpochReference = _c.nativeTimeSinceEpochMillis, nativeNowWithSystemBootReference = _c.nativeUptimeMillis, nativeTimestampWithSystemBootReference = _b[1];
        // If the JS <-> native communication were instantaneous, the nativeTimeSinceEpochMillis === jsNowWithEpochReference.
        // nativeCallLatency captures the deviation from this ideal.
        var bridgeLatency = nativeNowWithEpochReference - jsNowWithEpochReference;
        // The same latency would also be applicable to the system uptime values.
        // So we can reverse calculate what the "JS now" would have been in the system boot time reference system.
        var jsNowWithSystemBootReference = nativeNowWithSystemBootReference - bridgeLatency;
        /**
         * Both `jsNowWithSystemBootReference` and `nativeTimestampSystemBootReference` use the same reference time: system boot.
         * The difference between these two will give the millisecond difference between "now" and the requested timestamp.
         * Since it's a time-delta, it will also be applicable to the other reference system: epoch.
         */
        var millisElapsed = jsNowWithSystemBootReference - nativeTimestampWithSystemBootReference;
        /**
         * If millisElapsed is negative, we assume that `nativeTimestampWithSystemBootReference` is actually not referencing system boot time but epoch time.
         * This change was introduced in the following commit and released with react-native version 0.65.0:
         * https://github.com/facebook/react-native/commit/b08362ade5d68af4b6c66d5cf0dab5f42a2ec894#diff-c9c6bbe068431d9e508c435dba38a9cc4fd488bec4377d4d817f34afdfa89bb2R170
         * However, this was later reverted:
         * https://github.com/facebook/react-native/commit/10fe09c4567a47b62560c914bf6c8716e28355fd#diff-c9c6bbe068431d9e508c435dba38a9cc4fd488bec4377d4d817f34afdfa89bb2L170
         * We should delete this in the future when usage of react-native 0.65.0 drops down and then we can again assume
         * that the native timestamp given is referring to system boot time.
         */
        if (millisElapsed < 0) {
            return nativeTimestampWithSystemBootReference;
        }
        else {
            return jsNowWithEpochReference - millisElapsed;
        }
    });
    return {
        jsNowWithEpochReference: jsNowWithEpochReference,
        nativeTimestampWithEpochReference: nativeTimestampWithEpochReference,
    };
}
//# sourceMappingURL=BridgedEventTimestamp.js.map