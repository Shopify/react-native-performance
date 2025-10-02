"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_native_performance_navigation_1 = require("@shopify/react-native-performance-navigation");
var react_native_performance_lists_profiler_1 = require("@shopify/react-native-performance-lists-profiler");
var react_1 = tslib_1.__importStar(require("react"));
var react_native_1 = require("react-native");
var constants_1 = require("../constants");
var generateArray = function (size) {
    return Array.from(Array(size).keys());
};
var FlatListScreen = function () {
    var data = (0, react_1.useRef)(generateArray(3000)).current;
    return (react_1.default.createElement(react_native_performance_navigation_1.ReactNavigationPerformanceView, { screenName: constants_1.NavigationKeys.FLAT_LIST_SCREEN, interactive: true },
        react_1.default.createElement(react_native_performance_lists_profiler_1.FlatListPerformanceView, { listName: "FlatList" },
            react_1.default.createElement(react_native_1.FlatList, { keyExtractor: function (item) {
                    return item.toString();
                }, renderItem: function (_a) {
                    var item = _a.item;
                    var backgroundColor = item % 2 === 0 ? '#00a1f1' : '#ffbb00';
                    return (react_1.default.createElement(react_native_1.View, { style: [styles.container, { backgroundColor: backgroundColor }] },
                        react_1.default.createElement(react_native_1.Text, null,
                            "Cell Id: ",
                            item)));
                }, data: data }))));
};
var styles = react_native_1.StyleSheet.create({
    container: {
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 120,
        backgroundColor: '#00a1f1',
    },
});
exports.default = FlatListScreen;
//# sourceMappingURL=FlatListScreen.js.map