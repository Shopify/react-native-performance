"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var ListsProfilerContext_1 = require("./ListsProfilerContext");
var FlatListPerformanceViewNativeComponent_1 = require("./FlatListPerformanceViewNativeComponent");
/**
 * Wrap your `FlatList` with this component.
 */
var FlatListPerformanceView = function (_a) {
    var children = _a.children, listName = _a.listName, _b = _a.onInteractive, onInteractive = _b === void 0 ? function () { } : _b, _c = _a.onBlankArea, onBlankArea = _c === void 0 ? function () { } : _c;
    var time = (0, react_1.useRef)(Date.now()).current;
    var listsProfilerController = (0, react_1.useContext)(ListsProfilerContext_1.ListsProfilerContext);
    var onInteractiveCallback = (0, react_1.useCallback)(function (_a) {
        var nativeEvent = _a.nativeEvent;
        var tti = nativeEvent.timestamp - time;
        onInteractive(tti, listName);
        listsProfilerController.onInteractive(tti, listName);
    }, [listsProfilerController, onInteractive, listName, time]);
    var onBlankAreaCallback = (0, react_1.useCallback)(function (_a) {
        var nativeEvent = _a.nativeEvent;
        onBlankArea(nativeEvent.offsetStart, nativeEvent.offsetEnd, listName);
        listsProfilerController.onBlankArea(nativeEvent.offsetStart, nativeEvent.offsetEnd, listName);
    }, [onBlankArea, listsProfilerController, listName]);
    return (react_1.default.createElement(FlatListPerformanceViewNativeComponent_1.FlatListPerformanceViewNativeComponent, { onInteractive: onInteractiveCallback, onBlankAreaEvent: onBlankAreaCallback }, children));
};
exports.default = FlatListPerformanceView;
//# sourceMappingURL=FlatListPerformanceView.js.map