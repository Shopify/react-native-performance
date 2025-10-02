"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var react_native_1 = require("react-native");
var react_native_performance_1 = require("@shopify/react-native-performance");
var ReactNavigationPerformanceView_1 = require("../ReactNavigationPerformanceView");
var mountWithReactNavigationPerformanceContext_1 = require("./mountWithReactNavigationPerformanceContext");
var LOADING = 'loading';
var INTERACTIVE_NETWORK = 'interactive-network';
var INTERACTIVE_DATABASE = 'interactive-database';
var TRANSITION_END = 'transition-end';
var isFocusMock = jest.fn();
/**
 * Mount `ReactNavigationPerformanceView`.
 * @param navigationType: react-navigation's type of navigation.
 */
var mountReactNavigationPerformanceView = function (props, navigationType) {
    if (navigationType === void 0) { navigationType = 'stack'; }
    var _a = createAddListenerMock(), triggerTransitionEnd = _a.triggerTransitionEnd, addListener = _a.addListener;
    var wrapper = (0, mountWithReactNavigationPerformanceContext_1.mountWithReactNavigationPerformanceContext)(react_1.default.createElement(ReactNavigationPerformanceView_1.ReactNavigationPerformanceView, tslib_1.__assign({ screenName: "SomeScreen", interactive: true }, props),
        react_1.default.createElement(react_native_1.View, null)), {
        navigation: {
            addListener: addListener,
            getState: jest.fn(function () { return ({
                type: navigationType,
            }); }),
            isFocused: isFocusMock,
        },
    });
    return { wrapper: wrapper, triggerTransitionEnd: triggerTransitionEnd };
};
var useStateControllerMock = react_native_performance_1.useStateController;
jest.mock('@shopify/react-native-performance', function () {
    return tslib_1.__assign(tslib_1.__assign({}, jest.requireActual('@shopify/react-native-performance')), { useStateController: jest.fn() });
});
/**
 * Creates a listener mock that is injected when a subject wants to start a listening for a given event.
 */
var createAddListenerMock = function () {
    var transitionEndListeners = [];
    var triggerTransitionEnd = function () {
        transitionEndListeners.forEach(function (transitionEndListener) { return transitionEndListener(); });
    };
    var addListener = jest.fn().mockImplementation(function (listener, callback) {
        if (listener === 'transitionEnd') {
            transitionEndListeners.push(callback);
        }
        return function () {
            transitionEndListeners.filter(function (cb) { return cb !== callback; });
        };
    });
    return { triggerTransitionEnd: triggerTransitionEnd, addListener: addListener };
};
describe('ReactNavigationPerformanceView', function () {
    beforeEach(function () {
        jest.clearAllMocks();
    });
    describe('when screen is interactive on mount', function () {
        it('stops current flow in the state controller if focused', function () {
            var stopFlowIfNeededMock = jest.fn();
            useStateControllerMock.mockReturnValue({
                stopFlowIfNeeded: stopFlowIfNeededMock,
            });
            isFocusMock.mockReturnValueOnce(true);
            mountReactNavigationPerformanceView({
                renderPassName: LOADING,
                interactive: true,
            });
            expect(stopFlowIfNeededMock).toHaveBeenCalledTimes(1);
        });
        it('does not stop the current flow in the state controller if not focused', function () {
            var stopFlowIfNeededMock = jest.fn();
            useStateControllerMock.mockReturnValue({
                stopFlowIfNeeded: stopFlowIfNeededMock,
            });
            isFocusMock.mockReturnValueOnce(false);
            mountReactNavigationPerformanceView({
                renderPassName: LOADING,
                interactive: true,
            });
            expect(stopFlowIfNeededMock).not.toHaveBeenCalled();
        });
        it('triggers two render passes: one for initial interactive, the next after transitionEnd event', function () {
            var _a = mountReactNavigationPerformanceView({
                renderPassName: LOADING,
                interactive: true,
            }), wrapper = _a.wrapper, triggerTransitionEnd = _a.triggerTransitionEnd;
            expect(wrapper).toContainReactComponent(react_native_performance_1.PerformanceMeasureView, {
                // Interactive is set to false until `transitionEnd` event occurs
                interactive: false,
                renderPassName: LOADING,
            });
            wrapper.act(function () {
                triggerTransitionEnd();
            });
            expect(wrapper).toContainReactComponent(react_native_performance_1.PerformanceMeasureView, {
                interactive: true,
                renderPassName: TRANSITION_END,
            });
        });
    });
    describe('when transitionEnd event fires before user sets screen interactive', function () {
        it('shows final renderPass after transitionEnd', function () {
            var _a = mountReactNavigationPerformanceView({
                renderPassName: LOADING,
                interactive: false,
            }), wrapper = _a.wrapper, triggerTransitionEnd = _a.triggerTransitionEnd;
            // Screen queries data, so is loading on mount
            expect(wrapper).toContainReactComponent(react_native_performance_1.PerformanceMeasureView, {
                renderPassName: LOADING,
                interactive: false,
            });
            wrapper.act(function () {
                triggerTransitionEnd();
            });
            // Screen finishes navigation transition
            expect(wrapper).toContainReactComponent(react_native_performance_1.PerformanceMeasureView, {
                renderPassName: TRANSITION_END,
                interactive: false,
            });
            // Screen updates with network response
            wrapper.setProps({
                renderPassName: INTERACTIVE_NETWORK,
                interactive: true,
            });
            // The final event is recorded
            expect(wrapper).toContainReactComponent(react_native_performance_1.PerformanceMeasureView, {
                renderPassName: INTERACTIVE_NETWORK,
                interactive: true,
            });
        });
    });
    describe('when there is a render with the same name after transition-end', function () {
        it('it does not change the renderPassName', function () {
            var _a = mountReactNavigationPerformanceView({
                renderPassName: LOADING,
                interactive: false,
            }), wrapper = _a.wrapper, triggerTransitionEnd = _a.triggerTransitionEnd;
            // Screen queries data, so is loading on mount
            expect(wrapper).toContainReactComponent(react_native_performance_1.PerformanceMeasureView, {
                renderPassName: LOADING,
                interactive: false,
            });
            wrapper.act(function () {
                triggerTransitionEnd();
            });
            // Screen finishes navigation transition
            expect(wrapper).toContainReactComponent(react_native_performance_1.PerformanceMeasureView, {
                renderPassName: TRANSITION_END,
                interactive: false,
            });
            // Screen re-renders with the same renderPassName as before transition ended
            // This signals the renderPassName is simply reused and we should not change it.
            wrapper.setProps({ renderPassName: LOADING, interactive: false });
            expect(wrapper).toContainReactComponent(react_native_performance_1.PerformanceMeasureView, {
                renderPassName: TRANSITION_END,
                interactive: false,
            });
        });
    });
    describe('when navigation type is tab', function () {
        it('sets interactive to true without transitionEnd event', function () {
            var wrapper = mountReactNavigationPerformanceView({
                renderPassName: LOADING,
                interactive: false,
            }, 'tab').wrapper;
            expect(wrapper).toContainReactComponent(react_native_performance_1.PerformanceMeasureView, {
                renderPassName: LOADING,
                interactive: false,
            });
            // Screen updates with local data
            wrapper.setProps({
                renderPassName: INTERACTIVE_DATABASE,
                interactive: true,
            });
            expect(wrapper).toContainReactComponent(react_native_performance_1.PerformanceMeasureView, {
                renderPassName: INTERACTIVE_DATABASE,
                interactive: true,
            });
        });
    });
    describe('when navigation type is drawer', function () {
        it('sets interactive to true without transitionEnd event', function () {
            var wrapper = mountReactNavigationPerformanceView({
                renderPassName: LOADING,
                interactive: false,
            }, 'drawer').wrapper;
            expect(wrapper).toContainReactComponent(react_native_performance_1.PerformanceMeasureView, {
                renderPassName: LOADING,
                interactive: false,
            });
            // Screen updates with local data
            wrapper.setProps({
                renderPassName: INTERACTIVE_DATABASE,
                interactive: true,
            });
            expect(wrapper).toContainReactComponent(react_native_performance_1.PerformanceMeasureView, {
                renderPassName: INTERACTIVE_DATABASE,
                interactive: true,
            });
        });
    });
    describe('when screen is interactive from the start', function () {
        it('sets transition-end as the last `renderPassName`', function () {
            var _a = mountReactNavigationPerformanceView({
                interactive: true,
            }), wrapper = _a.wrapper, triggerTransitionEnd = _a.triggerTransitionEnd;
            expect(wrapper).toContainReactComponent(react_native_performance_1.PerformanceMeasureView, {
                // The default `renderPassName` is passed only to `PerformanceMarker` which we cannot access from here
                renderPassName: undefined,
                interactive: false,
            });
            wrapper.act(function () {
                triggerTransitionEnd();
            });
            expect(wrapper).toContainReactComponent(react_native_performance_1.PerformanceMeasureView, {
                renderPassName: TRANSITION_END,
                interactive: true,
            });
        });
    });
});
//# sourceMappingURL=ReactNavigationPerformanceView.test.js.map