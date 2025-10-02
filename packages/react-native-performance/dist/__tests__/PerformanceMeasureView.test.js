"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/ban-ts-comment */
var react_1 = tslib_1.__importDefault(require("react"));
var react_native_1 = require("@testing-library/react-native");
var react_test_renderer_1 = require("react-test-renderer");
require("jest-extended");
var utils_1 = require("../utils");
var PerformanceMarker_1 = require("../PerformanceMarker");
var PerformanceMeasureView_1 = tslib_1.__importStar(require("../PerformanceMeasureView"));
var MockStateController_1 = tslib_1.__importDefault(require("./MockStateController"));
var profilerTestWrapper_1 = tslib_1.__importDefault(require("./profilerTestWrapper"));
jest.mock('../PerformanceMarker', function () {
    return {
        getPerformanceMarker: jest.fn(),
    };
});
jest.mock('../utils/inMemoryCounter', function () {
    return jest.fn();
});
var TestView = function (_props) {
    return null;
};
var emptyComponent = function () { return null; };
var inMemoryCounterMock = utils_1.inMemoryCounter;
describe('PerformanceMeasureView', function () {
    var stateController;
    var PerformanceMarker;
    var Wrapper;
    beforeEach(function () {
        inMemoryCounterMock.mockReturnValue('some-uuid');
        // @ts-ignore
        PerformanceMarker = emptyComponent;
        // @ts-ignore
        PerformanceMarker_1.getPerformanceMarker.mockReturnValue(PerformanceMarker);
        stateController = new MockStateController_1.default();
        stateController.isEnabled = true;
        Wrapper = (0, profilerTestWrapper_1.default)(stateController).wrapper;
    });
    afterEach(function () {
        jest.resetAllMocks();
    });
    it('renders children unaddected', function () {
        var props = {
            prop1: 'prop1',
            prop2: 123,
            prop3: false,
            style: {
                flex: 1,
                width: 1,
                height: 2,
            },
        };
        var screen = (0, react_native_1.render)(react_1.default.createElement(Wrapper, null,
            react_1.default.createElement(PerformanceMeasureView_1.default, { screenName: "SomeScreen" },
                react_1.default.createElement(TestView, tslib_1.__assign({}, props)))));
        var view = screen.UNSAFE_getByType(TestView);
        expect(view.props).toStrictEqual(props);
    });
    it('renders measure view with invisible style', function () {
        var screen = (0, react_native_1.render)(react_1.default.createElement(Wrapper, null,
            react_1.default.createElement(PerformanceMeasureView_1.default, { screenName: "SomeScreen" },
                react_1.default.createElement(TestView, null))));
        var view = screen.UNSAFE_getByType(PerformanceMarker);
        expect(view.props.style).toStrictEqual(expect.objectContaining({
            width: 0,
            height: 0,
        }));
    });
    it('configures the default non-interactive render pass name correctly', function () {
        var screen = (0, react_native_1.render)(react_1.default.createElement(Wrapper, null,
            react_1.default.createElement(PerformanceMeasureView_1.default, { screenName: "SomeScreen", interactive: false },
                react_1.default.createElement(TestView, null))));
        var view = screen.UNSAFE_getByType(PerformanceMarker);
        expect(view.props.renderPassName).toBe(PerformanceMeasureView_1.DEFAULT_NON_INTERACTIVE_RENDER_PASS_NAME);
    });
    it('configures the default interactive render pass name correctly', function () {
        var screen = (0, react_native_1.render)(react_1.default.createElement(Wrapper, null,
            react_1.default.createElement(PerformanceMeasureView_1.default, { screenName: "SomeScreen", interactive: true },
                react_1.default.createElement(TestView, null))));
        var view = screen.UNSAFE_getByType(PerformanceMarker);
        expect(view.props.renderPassName).toBe(PerformanceMeasureView_1.DEFAULT_INTERACTIVE_RENDER_PASS_NAME);
    });
    it('configures the destination screen correctly', function () {
        var screen = (0, react_native_1.render)(react_1.default.createElement(Wrapper, null,
            react_1.default.createElement(PerformanceMeasureView_1.default, { screenName: "SomeScreen", interactive: true },
                react_1.default.createElement(TestView, null))));
        var view = screen.UNSAFE_getByType(PerformanceMarker);
        expect(view.props.destinationScreen).toBe('SomeScreen');
    });
    it('configures the interactive value to false correctly', function () {
        var screen = (0, react_native_1.render)(react_1.default.createElement(Wrapper, null,
            react_1.default.createElement(PerformanceMeasureView_1.default, { screenName: "SomeScreen", interactive: false },
                react_1.default.createElement(TestView, null))));
        var view = screen.UNSAFE_getByType(PerformanceMarker);
        expect(view.props.interactive).toBe('FALSE');
    });
    it('configures the interactive value to true correctly', function () {
        var screen = (0, react_native_1.render)(react_1.default.createElement(Wrapper, null,
            react_1.default.createElement(PerformanceMeasureView_1.default, { screenName: "SomeScreen", interactive: true },
                react_1.default.createElement(TestView, null))));
        var view = screen.UNSAFE_getByType(PerformanceMarker);
        expect(view.props.interactive).toBe('TRUE');
    });
    it('configures the renderPassName correctly if one is provided', function () {
        var screen = (0, react_native_1.render)(react_1.default.createElement(Wrapper, null,
            react_1.default.createElement(PerformanceMeasureView_1.default, { screenName: "SomeScreen", renderPassName: "renderPass1" },
                react_1.default.createElement(TestView, null))));
        var view = screen.UNSAFE_getByType(PerformanceMarker);
        expect(view.props.renderPassName).toBe('renderPass1');
    });
    it('does not render the measure view marker if disabled', function () {
        stateController.isEnabled = false;
        var screen = (0, react_native_1.render)(react_1.default.createElement(Wrapper, null,
            react_1.default.createElement(PerformanceMeasureView_1.default, { screenName: "SomeScreen" },
                react_1.default.createElement(TestView, null))));
        var views = screen.UNSAFE_queryAllByType(PerformanceMarker);
        expect(views).toHaveLength(0);
    });
    it('notifies the state controller when the screen is mounted', function () {
        inMemoryCounterMock.mockReturnValueOnce('mock-mount-id');
        expect(stateController.onScreenMounted).not.toHaveBeenCalled();
        (0, react_native_1.render)(react_1.default.createElement(Wrapper, null,
            react_1.default.createElement(PerformanceMeasureView_1.default, { screenName: "SomeScreen" },
                react_1.default.createElement(TestView, null))));
        expect(stateController.onScreenMounted).toHaveBeenCalledTimes(1);
        expect(stateController.onScreenMounted).toHaveBeenCalledWith({
            destinationScreen: 'SomeScreen',
            componentInstanceId: 'mock-mount-id',
        });
    });
    it('does not notify the state controller of a screen mount if the screen re-renders', function () {
        inMemoryCounterMock.mockReturnValueOnce('mock-mount-id');
        inMemoryCounterMock.mockReturnValueOnce('mock-render-id1');
        inMemoryCounterMock.mockReturnValueOnce('mock-render-id2');
        var screen = (0, react_native_1.render)(react_1.default.createElement(Wrapper, null,
            react_1.default.createElement(PerformanceMeasureView_1.default, { screenName: "SomeScreen" },
                react_1.default.createElement(TestView, null))));
        expect(stateController.onScreenMounted).toHaveBeenCalledTimes(1);
        screen.rerender(react_1.default.createElement(Wrapper, null,
            react_1.default.createElement(PerformanceMeasureView_1.default, { screenName: "SomeScreen" },
                react_1.default.createElement(TestView, null))));
        expect(stateController.onScreenMounted).toHaveBeenCalledTimes(1);
        expect(stateController.onScreenMounted).toHaveBeenCalledWith({
            destinationScreen: 'SomeScreen',
            componentInstanceId: 'mock-mount-id',
        });
    });
    it('uses the same promise reference for tracking the componentInstanceId between mounts and unmounts', function () {
        inMemoryCounterMock.mockReturnValueOnce('mock-mount-uuid');
        var screen = (0, react_native_1.render)(react_1.default.createElement(Wrapper, null,
            react_1.default.createElement(PerformanceMeasureView_1.default, { screenName: "SomeScreen" },
                react_1.default.createElement(TestView, null))));
        var mountId = stateController.onScreenMounted.mock.calls[0][0].componentInstanceId;
        (0, react_test_renderer_1.act)(function () {
            screen.unmount();
        });
        var unmountId = stateController.onScreenUnmounted.mock.calls[0][0].componentInstanceId;
        expect(mountId === unmountId).toBe(true);
    });
    it('notifies the state controller when the screen is unmounted', function () {
        inMemoryCounterMock.mockReturnValueOnce('mock-mount-id');
        var screen = (0, react_native_1.render)(react_1.default.createElement(Wrapper, null,
            react_1.default.createElement(PerformanceMeasureView_1.default, { screenName: "SomeScreen" },
                react_1.default.createElement(TestView, null))));
        expect(stateController.onScreenUnmounted).not.toHaveBeenCalled();
        (0, react_test_renderer_1.act)(function () {
            screen.unmount();
        });
        expect(stateController.onScreenUnmounted).toHaveBeenCalledTimes(1);
        expect(stateController.onScreenUnmounted).toHaveBeenCalledWith({
            destinationScreen: 'SomeScreen',
            componentInstanceId: 'mock-mount-id',
        });
    });
    it("notifies the state controller of a new mount followed by the previous instance's unmount", function () {
        var Component1 = function () { return (react_1.default.createElement(Wrapper, null,
            react_1.default.createElement(PerformanceMeasureView_1.default, { screenName: "SomeScreen" },
                react_1.default.createElement(TestView, null)))); };
        var Component2 = function () { return (react_1.default.createElement(Wrapper, null,
            react_1.default.createElement(PerformanceMeasureView_1.default, { screenName: "SomeScreen" },
                react_1.default.createElement(TestView, null)))); };
        inMemoryCounterMock.mockReturnValueOnce('mock-mount-id1');
        inMemoryCounterMock.mockReturnValueOnce('mock-mount-id2');
        var screen = (0, react_native_1.render)(react_1.default.createElement(Component1, null));
        expect(stateController.onScreenMounted).toHaveBeenCalledTimes(1);
        expect(stateController.onScreenMounted).toHaveBeenCalledWith({
            destinationScreen: 'SomeScreen',
            componentInstanceId: 'mock-mount-id1',
        });
        expect(stateController.onScreenUnmounted).not.toHaveBeenCalled();
        screen.rerender(react_1.default.createElement(Component2, null));
        expect(stateController.onScreenMounted).toHaveBeenCalledTimes(2);
        expect(stateController.onScreenMounted).toHaveBeenLastCalledWith({
            destinationScreen: 'SomeScreen',
            componentInstanceId: 'mock-mount-id2',
        });
        expect(stateController.onScreenUnmounted).toHaveBeenCalledTimes(1);
        expect(stateController.onScreenUnmounted).toHaveBeenCalledWith({
            destinationScreen: 'SomeScreen',
            componentInstanceId: 'mock-mount-id1',
        });
        expect(stateController.onScreenUnmounted).not.toHaveBeenCalledBefore(stateController.onScreenMounted);
    });
    it('notifies the state controller when the screen is rendered', function () {
        inMemoryCounterMock.mockReturnValueOnce('mock-mount-id');
        expect(stateController.onRenderPassCompleted).not.toHaveBeenCalled();
        var screen = (0, react_native_1.render)(react_1.default.createElement(Wrapper, null,
            react_1.default.createElement(PerformanceMeasureView_1.default, { screenName: "SomeScreen", renderPassName: "renderPass1" },
                react_1.default.createElement(TestView, null))));
        var view = screen.UNSAFE_getByType(PerformanceMarker);
        view.props.onRenderComplete({
            nativeEvent: {
                timestamp: 2000,
                renderPassName: 'renderPass1',
                interactive: 'TRUE',
                destinationScreen: 'SomeScreen',
                componentInstanceId: 'mock-mount-id',
            },
        });
        expect(stateController.onRenderPassCompleted).toHaveBeenCalledTimes(1);
        expect(stateController.onRenderPassCompleted).toHaveBeenCalledWith({
            timestamp: 2000,
            renderPassName: 'renderPass1',
            interactive: true,
            destinationScreen: 'SomeScreen',
            componentInstanceId: 'mock-mount-id',
        });
    });
});
//# sourceMappingURL=PerformanceMeasureView.test.js.map