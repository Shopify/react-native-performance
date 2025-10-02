"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var native_1 = require("@react-navigation/native");
var stack_1 = require("@react-navigation/stack");
var react_native_performance_1 = require("@shopify/react-native-performance");
var react_native_performance_lists_profiler_1 = require("@shopify/react-native-performance-lists-profiler");
var client_1 = require("@apollo/client");
var examples_1 = require("./examples");
var PerformanceScreen_1 = tslib_1.__importDefault(require("./examples/PerformanceScreen"));
var FlatListScreen_1 = tslib_1.__importDefault(require("./examples/FlatListScreen"));
var constants_1 = require("./constants");
var TabNavigator_1 = tslib_1.__importDefault(require("./examples/TabNavigator"));
var FastRenderPassesScreen_1 = tslib_1.__importDefault(require("./examples/FastRenderPassesScreen"));
var ConditionalRenderingScreen_1 = tslib_1.__importDefault(require("./examples/ConditionalRenderingScreen"));
var DrawerNavigator_1 = tslib_1.__importDefault(require("./examples/DrawerNavigator"));
var NestedNavigationScreen_1 = tslib_1.__importDefault(require("./examples/NestedNavigationScreen"));
var NestedContextScreen_1 = tslib_1.__importStar(require("./examples/NestedContextScreen"));
var Stack = (0, stack_1.createStackNavigator)();
var NavigationTree = function () {
    return (react_1.default.createElement(native_1.NavigationContainer, null,
        react_1.default.createElement(Stack.Navigator, null,
            react_1.default.createElement(Stack.Screen, { name: constants_1.NavigationKeys.EXAMPLES, component: examples_1.ExamplesScreen }),
            react_1.default.createElement(Stack.Screen, { name: constants_1.NavigationKeys.PERFORMANCE, component: PerformanceScreen_1.default }),
            react_1.default.createElement(Stack.Screen, { name: constants_1.NavigationKeys.TAB_NAVIGATOR, component: TabNavigator_1.default }),
            react_1.default.createElement(Stack.Screen, { name: constants_1.NavigationKeys.DRAWER_NAVIGATOR, component: DrawerNavigator_1.default }),
            react_1.default.createElement(Stack.Screen, { name: constants_1.NavigationKeys.FAST_RENDER_PASSES_SCREEN, component: FastRenderPassesScreen_1.default }),
            react_1.default.createElement(Stack.Screen, { name: constants_1.NavigationKeys.CONDITIONAL_RENDERING_SCREEN, component: ConditionalRenderingScreen_1.default }),
            react_1.default.createElement(Stack.Screen, { name: constants_1.NavigationKeys.FLAT_LIST_SCREEN, component: FlatListScreen_1.default }),
            react_1.default.createElement(Stack.Screen, { name: constants_1.NavigationKeys.NESTED_NAVIGATION_SCREEN, component: NestedNavigationScreen_1.default }),
            react_1.default.createElement(Stack.Screen, { name: constants_1.NavigationKeys.NESTED_PROFILER_CONTEXT, component: NestedProfilerNavigationTree, options: { headerShown: false } }))));
};
function NestedProfilerNavigationTree() {
    return (react_1.default.createElement(Stack.Navigator, null,
        react_1.default.createElement(Stack.Screen, { name: constants_1.NavigationKeys.NESTED_CONTEXT_SCREEN, component: NestedContextScreen_1.default }),
        react_1.default.createElement(Stack.Group, { screenOptions: { presentation: 'modal' } },
            react_1.default.createElement(Stack.Screen, { name: constants_1.NavigationKeys.INNER_NESTED_CONTEXT_SCREEN, component: NestedContextScreen_1.InnerNestedContextScreen }))));
}
var App = function () {
    var apolloClient = (0, react_1.useMemo)(function () {
        return new client_1.ApolloClient({
            uri: 'https://rickandmortyapi.com/graphql',
            cache: new client_1.InMemoryCache(),
        });
    }, []);
    var onInteractiveCallback = (0, react_1.useCallback)(function (TTI, listName) {
        console.log("".concat(listName, "'s TTI: ").concat(TTI));
    }, []);
    var onBlankAreaCallback = (0, react_1.useCallback)(function (offsetStart, offsetEnd, listName) {
        console.log("Blank area for ".concat(listName, ": ").concat(Math.max(offsetStart, offsetEnd)));
    }, []);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(client_1.ApolloProvider, { client: apolloClient },
            react_1.default.createElement(react_native_performance_1.PerformanceProfiler, { logLevel: react_native_performance_1.LogLevel.Debug },
                react_1.default.createElement(react_native_performance_lists_profiler_1.ListsProfiler, { onInteractive: onInteractiveCallback, onBlankArea: onBlankAreaCallback },
                    react_1.default.createElement(NavigationTree, null))))));
};
exports.default = App;
//# sourceMappingURL=App.js.map