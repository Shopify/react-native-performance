"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var ListsProfilerContext_1 = require("./ListsProfilerContext");
var FlashListPerformanceViewNativeComponent_1 = require("./FlashListPerformanceViewNativeComponent");
/**
 * Wrap your `FlashList` with this component.
 */
var FlashListPerformanceView = function (_a) {
    var listName = _a.listName, children = _a.children;
    var time = (0, react_1.useRef)(Date.now()).current;
    var listsProfilerController = (0, react_1.useContext)(ListsProfilerContext_1.ListsProfilerContext);
    return (react_1.default.createElement(FlashListPerformanceViewNativeComponent_1.FlashListPerformanceViewNativeComponent, { style: { flex: 1 }, onInteractive: function (_a) {
            var nativeEvent = _a.nativeEvent;
            listsProfilerController.onInteractive(nativeEvent.timestamp - time, listName);
        }, onBlankAreaEvent: function (_a) {
            var nativeEvent = _a.nativeEvent;
            listsProfilerController.onBlankArea(nativeEvent.offsetStart, nativeEvent.offsetEnd, listName);
        } }, children));
};
exports.default = FlashListPerformanceView;
//# sourceMappingURL=FlashListPerformanceView.js.map