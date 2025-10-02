"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamplesScreen = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var react_native_1 = require("react-native");
var react_native_performance_navigation_1 = require("@shopify/react-native-performance-navigation");
var native_1 = require("@react-navigation/native");
var constants_1 = require("../constants");
var ExamplesScreen = function () {
    var navigate = (0, react_native_performance_navigation_1.useProfiledNavigation)().navigate;
    var navigation = (0, native_1.useNavigation)();
    var renderTimeoutMillisOverride = function (screenName) {
        return screenName === constants_1.NavigationKeys.PERFORMANCE ? 6 * 1000 : undefined;
    };
    return (react_1.default.createElement(react_native_performance_navigation_1.ReactNavigationPerformanceView, { screenName: constants_1.NavigationKeys.EXAMPLES, interactive: true },
        react_1.default.createElement(react_native_1.StatusBar, { barStyle: "dark-content" }),
        react_1.default.createElement(react_native_1.FlatList, { keyExtractor: function (item) { return item.destination; }, data: [
                { title: 'Performance', destination: constants_1.NavigationKeys.PERFORMANCE },
                { title: 'Tab Navigator', destination: constants_1.NavigationKeys.TAB_NAVIGATOR },
                {
                    title: 'Drawer Navigator',
                    destination: constants_1.NavigationKeys.DRAWER_NAVIGATOR,
                },
                {
                    title: 'Fast Render Passes Screen',
                    destination: constants_1.NavigationKeys.FAST_RENDER_PASSES_SCREEN,
                },
                {
                    title: 'Nested Navigation Screen',
                    destination: constants_1.NavigationKeys.NESTED_NAVIGATION_SCREEN,
                },
                {
                    title: 'Conditional Rendering Screen',
                    destination: constants_1.NavigationKeys.CONDITIONAL_RENDERING_SCREEN,
                },
                {
                    title: 'FlatList Screen',
                    destination: constants_1.NavigationKeys.FLAT_LIST_SCREEN,
                },
                {
                    title: 'Nested Context Screen',
                    destination: constants_1.NavigationKeys.NESTED_PROFILER_CONTEXT,
                },
            ], renderItem: function (_a) {
                var item = _a.item;
                return (react_1.default.createElement(react_native_1.TouchableOpacity, { style: styles.row, onPress: function (uiEvent) {
                        if (item.destination === constants_1.NavigationKeys.NESTED_PROFILER_CONTEXT) {
                            navigation.navigate(item.destination);
                        }
                        else {
                            navigate({
                                source: constants_1.NavigationKeys.EXAMPLES,
                                uiEvent: uiEvent,
                                renderTimeoutMillisOverride: renderTimeoutMillisOverride(item.destination),
                            }, item.destination);
                        }
                    } },
                    react_1.default.createElement(react_native_1.Text, { style: styles.rowTitle }, item.title),
                    react_1.default.createElement(react_native_1.Image, { style: styles.arrow, source: require('../assets/ic-arrow.png') })));
            } })));
};
exports.ExamplesScreen = ExamplesScreen;
var styles = react_native_1.StyleSheet.create({
    row: {
        padding: 16,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rowTitle: {
        fontSize: 18,
    },
    arrow: {
        resizeMode: 'center',
    },
});
//# sourceMappingURL=ExamplesScreen.js.map