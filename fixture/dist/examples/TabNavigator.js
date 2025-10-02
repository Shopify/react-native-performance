"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var react_native_1 = require("react-native");
var react_native_performance_1 = require("@shopify/react-native-performance");
var react_native_performance_navigation_1 = require("@shopify/react-native-performance-navigation");
var react_native_performance_navigation_bottom_tabs_1 = require("@shopify/react-native-performance-navigation-bottom-tabs");
var constants_1 = require("../constants");
var _a = (0, react_native_performance_navigation_bottom_tabs_1.createProfiledBottomTabNavigator)(), Tab = _a.Tab, buildProfiledBottomTabBarButton = _a.buildProfiledBottomTabBarButton;
var GlobalStateContext = react_1.default.createContext(undefined);
var TabScreen = function (_a) {
    var navigationKey = _a.navigationKey;
    var screenName = constants_1.NavigationKeys[navigationKey];
    var globalState = (0, react_1.useContext)(GlobalStateContext);
    var _b = (0, react_native_performance_1.useResetFlow)(), resetFlow = _b.resetFlow, componentInstanceId = _b.componentInstanceId;
    var isFirstRender = (0, react_1.useRef)(true);
    if (globalState !== undefined) {
        if (isFirstRender.current) {
            isFirstRender.current = false;
        }
        else {
            console.log("Resetting flow for screen: ".concat(screenName));
            resetFlow({
                destination: screenName,
            });
        }
    }
    console.log("JS-rendering ".concat(screenName, "."));
    return (react_1.default.createElement(react_native_performance_navigation_1.ReactNavigationPerformanceView, { screenName: screenName, interactive: globalState !== undefined, renderPassName: globalState === undefined ? 'loading' : "interactive_".concat(globalState.counter), componentInstanceId: componentInstanceId }, globalState && (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(react_native_1.Text, null,
            "Hello ",
            screenName,
            ". Counter: ",
            globalState.counter),
        react_1.default.createElement(react_native_1.Button, { onPress: globalState.incrementCounter, title: "Increment counter" })))));
};
var TabScreen1 = function () {
    return react_1.default.createElement(TabScreen, { navigationKey: "TAB_NAVIGATOR_SCREEN_1" });
};
var TabScreen2 = function () {
    return react_1.default.createElement(TabScreen, { navigationKey: "TAB_NAVIGATOR_SCREEN_2" });
};
var TabNavigator = function () {
    var _a = tslib_1.__read((0, react_1.useState)({
        counter: 0,
        incrementCounter: function () {
            setContextValue(function (currentContext) {
                return tslib_1.__assign(tslib_1.__assign({}, currentContext), { counter: currentContext.counter + 1 });
            });
        },
    }), 2), contextValue = _a[0], setContextValue = _a[1];
    return (react_1.default.createElement(GlobalStateContext.Provider, { value: contextValue },
        react_1.default.createElement(Tab.Navigator, null,
            react_1.default.createElement(Tab.Screen, { name: constants_1.NavigationKeys.TAB_NAVIGATOR_SCREEN_1, component: TabScreen1, options: {
                    tabBarButton: buildProfiledBottomTabBarButton(),
                } }),
            react_1.default.createElement(Tab.Screen, { name: constants_1.NavigationKeys.TAB_NAVIGATOR_SCREEN_2, component: TabScreen2, options: {
                    tabBarButton: buildProfiledBottomTabBarButton(),
                } }))));
};
exports.default = TabNavigator;
//# sourceMappingURL=TabNavigator.js.map