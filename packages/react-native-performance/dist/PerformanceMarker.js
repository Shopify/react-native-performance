"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPerformanceMarker = void 0;
var react_native_1 = require("react-native");
/**
 * Lazy-import the native component such that it is only actually imported if the profiling
 * is enabled. Otherwise, we want most operations to be stubbed out.
 * PerformanceMeasureView takes care of calling getPerformanceMarker only when needed.
 */
var PerformanceMarker;
function getPerformanceMarker() {
    if (PerformanceMarker === undefined) {
        PerformanceMarker = (0, react_native_1.requireNativeComponent)('PerformanceMarker');
    }
    return PerformanceMarker;
}
exports.getPerformanceMarker = getPerformanceMarker;
//# sourceMappingURL=PerformanceMarker.js.map