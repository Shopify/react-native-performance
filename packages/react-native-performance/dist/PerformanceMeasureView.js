"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_INTERACTIVE_RENDER_PASS_NAME = exports.DEFAULT_NON_INTERACTIVE_RENDER_PASS_NAME = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var react_native_1 = require("react-native");
var utils_1 = require("./utils");
var PerformanceMarker_1 = require("./PerformanceMarker");
var state_machine_1 = require("./state-machine");
exports.DEFAULT_NON_INTERACTIVE_RENDER_PASS_NAME = 'loading';
exports.DEFAULT_INTERACTIVE_RENDER_PASS_NAME = 'interactive';
var DEFAULT_INTERACTIVE = false;
var normalizeRenderState = function (props) {
    var _a, _b;
    var interactive = (_a = props.interactive) !== null && _a !== void 0 ? _a : DEFAULT_INTERACTIVE;
    var renderPassName = (_b = props.renderPassName) !== null && _b !== void 0 ? _b : (interactive ? exports.DEFAULT_INTERACTIVE_RENDER_PASS_NAME : exports.DEFAULT_NON_INTERACTIVE_RENDER_PASS_NAME);
    return {
        interactive: interactive,
        renderPassName: renderPassName,
    };
};
var PerformanceMeasureView = function (_a) {
    var _b;
    var screenName = _a.screenName, children = _a.children, _c = _a.optimizeForSlowRenderComponents, optimizeForSlowRenderComponents = _c === void 0 ? false : _c, slowRenderPlaceholder = _a.slowRenderPlaceholder, renderStateProps = tslib_1.__rest(_a, ["screenName", "children", "optimizeForSlowRenderComponents", "slowRenderPlaceholder"]);
    var stateController = (0, state_machine_1.useStateController)();
    var _d = tslib_1.__read((0, react_1.useState)(!optimizeForSlowRenderComponents), 2), show = _d[0], setShow = _d[1];
    var _e = normalizeRenderState(renderStateProps), interactive = _e.interactive, renderPassName = _e.renderPassName;
    (0, react_1.useEffect)(function () {
        if (optimizeForSlowRenderComponents) {
            react_native_1.InteractionManager.runAfterInteractions(function () {
                setShow(true);
            });
        }
    }, [optimizeForSlowRenderComponents]);
    var componentInstanceId = (0, react_1.useRef)((_b = renderStateProps.componentInstanceId) !== null && _b !== void 0 ? _b : (0, utils_1.inMemoryCounter)()).current;
    useTrackComponentMounts({ stateController: stateController, screenName: screenName, componentInstanceId: componentInstanceId });
    var onRenderComplete = (0, react_1.useCallback)(function (event) {
        var _a = event.nativeEvent, timestamp = _a.timestamp, renderPassName = _a.renderPassName, interactive = _a.interactive, destinationScreen = _a.destinationScreen, componentInstanceId = _a.componentInstanceId;
        stateController.onRenderPassCompleted({
            timestamp: Number.parseFloat(timestamp),
            destinationScreen: destinationScreen,
            renderPassName: renderPassName,
            interactive: interactive === 'TRUE',
            componentInstanceId: componentInstanceId,
        });
    }, [stateController]);
    if (stateController.isEnabled) {
        if (show) {
            var PerformanceMarker = (0, PerformanceMarker_1.getPerformanceMarker)();
            return (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(PerformanceMarker, { componentInstanceId: componentInstanceId, key: renderPassName, destinationScreen: screenName, interactive: interactive ? 'TRUE' : 'FALSE', renderPassName: renderPassName, style: styles.invisible, onRenderComplete: onRenderComplete }),
                children));
        }
        else if (slowRenderPlaceholder) {
            return react_1.default.createElement(react_1.default.Fragment, null, slowRenderPlaceholder);
        }
        else {
            return null;
        }
    }
    else {
        return react_1.default.createElement(react_1.default.Fragment, null, children);
    }
};
var useTrackComponentMounts = function (_a) {
    var stateController = _a.stateController, screenName = _a.screenName, componentInstanceId = _a.componentInstanceId;
    (0, react_1.useEffect)(function () {
        stateController.onScreenMounted({
            destinationScreen: screenName,
            componentInstanceId: componentInstanceId,
        });
        return function () {
            stateController.onScreenUnmounted({
                destinationScreen: screenName,
                componentInstanceId: componentInstanceId,
            });
        };
    }, [screenName, stateController, componentInstanceId]);
};
var styles = react_native_1.StyleSheet.create({
    invisible: {
        width: 0,
        height: 0,
    },
});
exports.default = PerformanceMeasureView;
//# sourceMappingURL=PerformanceMeasureView.js.map