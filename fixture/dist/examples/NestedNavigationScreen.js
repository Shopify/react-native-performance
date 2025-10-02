"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var react_native_performance_navigation_1 = require("@shopify/react-native-performance-navigation");
var react_native_1 = require("react-native");
var constants_1 = require("../constants");
var NestedNavigationScreen = function () {
    var push = (0, react_native_performance_navigation_1.useProfiledNavigation)().push;
    return (react_1.default.createElement(react_native_performance_navigation_1.ReactNavigationPerformanceView, { screenName: constants_1.NavigationKeys.NESTED_NAVIGATION_SCREEN, interactive: true },
        react_1.default.createElement(react_native_1.Button, { title: "Navigate to NestedNavigationScreen", onPress: function () { return push(constants_1.NavigationKeys.NESTED_NAVIGATION_SCREEN); } })));
};
exports.default = NestedNavigationScreen;
//# sourceMappingURL=NestedNavigationScreen.js.map