"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InnerNestedContextScreen = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var react_native_performance_navigation_1 = require("@shopify/react-native-performance-navigation");
var react_native_1 = require("react-native");
var react_native_performance_1 = require("@shopify/react-native-performance");
var constants_1 = require("../constants");
/**
 * NOTE: This screen shouldn't be used as an example since we don't generally recommend mixing multiple profilers.
 * Nested profilers only make sense when transitioning between JS and native layers in a hybrid use case.
 * For example, in brown-field apps, gradually adopting React Native.
 * Please stick with only profiler per App if there is no serious matter to do otherwise.
 */
var NestedContextScreen = function () {
    var navigate = (0, react_native_performance_navigation_1.useProfiledNavigation)().navigate;
    return (react_1.default.createElement(react_native_performance_1.PerformanceProfiler, { logLevel: react_native_performance_1.LogLevel.Debug },
        react_1.default.createElement(react_native_performance_navigation_1.ReactNavigationPerformanceView, { screenName: constants_1.NavigationKeys.NESTED_CONTEXT_SCREEN, interactive: true },
            react_1.default.createElement(react_native_1.Button, { title: "Present new screen inside nested Profiler Context", onPress: function () { return navigate(constants_1.NavigationKeys.INNER_NESTED_CONTEXT_SCREEN); } }))));
};
var InnerNestedContextScreen = function () {
    var text = 'This is a screen rendered in a nested Profiler Context\n\n You should see no errors in the logs';
    return (react_1.default.createElement(react_native_performance_navigation_1.ReactNavigationPerformanceView, { screenName: constants_1.NavigationKeys.INNER_NESTED_CONTEXT_SCREEN, interactive: true },
        react_1.default.createElement(react_native_1.View, { style: styles.textContainer },
            react_1.default.createElement(react_native_1.Text, { style: styles.text }, text))));
};
exports.InnerNestedContextScreen = InnerNestedContextScreen;
exports.default = NestedContextScreen;
var styles = react_native_1.StyleSheet.create({
    text: {
        textAlignVertical: 'center',
        textAlign: 'center',
        fontSize: 18,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
});
//# sourceMappingURL=NestedContextScreen.js.map