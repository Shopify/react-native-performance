"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactNavigationPerformanceView = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var react_native_performance_1 = require("@shopify/react-native-performance");
var native_1 = require("@react-navigation/native");
var core_1 = require("@react-navigation/core");
var TRANSITION_END = 'transition-end';
/**
 * Performance view similar to `PerformanceMeasureView` but meant to be used with `react-navigation`.
 * If the screen is not mounted in a react-navigation context, it might misbehave and is therefore not recommended.
 */
var ReactNavigationPerformanceView = function (props) {
    var _a;
    var _b = (0, native_1.useNavigation)(), addListener = _b.addListener, getState = _b.getState;
    // Stack is the only navigation type that has a `transitionEnd` event.
    var isStack = getState().type === 'stack';
    var _c = tslib_1.__read((0, react_1.useState)(!isStack), 2), transitionEnded = _c[0], setTransitionEnded = _c[1];
    // We only want to report `TRANSITION_END` render pass once.
    var transitionEndReported = (0, react_1.useRef)(false);
    var componentInstanceId = (0, react_1.useRef)((_a = props.componentInstanceId) !== null && _a !== void 0 ? _a : (0, react_native_performance_1.inMemoryCounter)()).current;
    var stateController = (0, react_native_performance_1.useStateController)();
    (0, core_1.useFocusEffect)((0, react_1.useCallback)(function () {
        stateController.stopFlowIfNeeded(componentInstanceId);
    }, [stateController, componentInstanceId]));
    (0, react_1.useEffect)(function () {
        if (!isStack) {
            return;
        }
        return addListener('transitionEnd', function () {
            setTransitionEnded(true);
        });
    }, [addListener, isStack]);
    var shouldReportTransitionEnd = false;
    if (isStack && transitionEnded && transitionEndReported.current === false) {
        shouldReportTransitionEnd = true;
        transitionEndReported.current = true;
    }
    // View can be interactive only when the present animation has completed (marked by `transitionEnd` event).
    // However, we wait for `transitionEnd` event only in case when we are in a context of a stack navigator as otherwise `transitionEnd` never occurs.
    var interactive = props.interactive === true && transitionEnded;
    /**
     * Represents previous renderPassName passed via `props`.
     * Does not include `TRANSITION_END` event.
     */
    var lastRenderPassName = (0, react_1.useRef)(undefined);
    var renderProps = (0, react_1.useRef)({
        renderPassName: props.renderPassName,
        interactive: interactive,
    });
    // If a user has not changed the `renderPassName`, we keep `TRANSITION_END` as the current one.
    // This is to avoid emitting reports of render passes where user has not explicitly changed it.
    // `PerformanceMeasureView` will log a reused `renderPassName`
    // and subsequent render passes with a different `renderPassName` will still be reported.
    // Check out this link for more details: https://github.com/Shopify/react-native-performance/pull/363
    if (shouldReportTransitionEnd) {
        renderProps.current = { renderPassName: TRANSITION_END, interactive: interactive };
    }
    else if (lastRenderPassName.current !== props.renderPassName) {
        renderProps.current = { renderPassName: props.renderPassName, interactive: interactive };
    }
    lastRenderPassName.current = props.renderPassName;
    return (react_1.default.createElement(react_native_performance_1.PerformanceMeasureView, tslib_1.__assign({}, props, { componentInstanceId: componentInstanceId, renderPassName: renderProps.current.renderPassName, interactive: renderProps.current.interactive })));
};
exports.ReactNavigationPerformanceView = ReactNavigationPerformanceView;
//# sourceMappingURL=ReactNavigationPerformanceView.js.map