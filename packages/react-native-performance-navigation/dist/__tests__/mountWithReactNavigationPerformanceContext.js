"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mountWithReactNavigationPerformanceContext = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var core_1 = require("@react-navigation/core");
require("@quilted/react-testing/matchers");
var react_testing_1 = require("@quilted/react-testing");
var react_native_performance_1 = require("@shopify/react-native-performance");
var mockNavigation = {
    dispatch: jest.fn(),
    goBack: jest.fn(),
    navigate: jest.fn(),
    setParams: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    reset: jest.fn(),
    isFocused: jest.fn(function () { return true; }),
    getParent: jest.fn(),
    getId: jest.fn(),
    getState: jest.fn(),
    canGoBack: jest.fn(function () { return true; }),
    setOptions: jest.fn(),
};
/**
 * Creates a mount with a context of navigation and a performance profiler.
 */
exports.mountWithReactNavigationPerformanceContext = (0, react_testing_1.createMount)({
    context: function (_a) {
        var navigationConfig = _a.navigation;
        var navigation = tslib_1.__assign(tslib_1.__assign({}, mockNavigation), navigationConfig);
        return { navigation: navigation };
    },
    render: function (element, context) {
        var navigation = context.navigation;
        var profiler = (react_1.default.createElement(react_native_performance_1.PerformanceProfiler, { onReportPrepared: jest.fn(), enabled: false },
            react_1.default.createElement(core_1.NavigationContext.Provider, { value: navigation }, element)));
        return profiler;
    },
});
//# sourceMappingURL=mountWithReactNavigationPerformanceContext.js.map