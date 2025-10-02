"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_native_performance_navigation_1 = require("@shopify/react-native-performance-navigation");
var react_1 = tslib_1.__importStar(require("react"));
var react_native_1 = require("react-native");
var constants_1 = require("../constants");
var useSimulatedSlowOperation_1 = tslib_1.__importDefault(require("./useSimulatedSlowOperation"));
var Child0 = function () {
    return (react_1.default.createElement(react_native_1.View, null,
        react_1.default.createElement(react_native_1.Text, { style: { color: 'red' } }, "Rendering component 0")));
};
var Child1 = function () {
    return (react_1.default.createElement(react_native_1.View, null,
        react_1.default.createElement(react_native_1.Text, { style: { color: 'blue' } }, "Rendering component 1")));
};
var ConditionalRenderingScreen = function () {
    var _a = tslib_1.__read((0, react_1.useState)(0), 2), componentNumber = _a[0], setComponentNumber = _a[1];
    var slowOperation = (0, useSimulatedSlowOperation_1.default)({
        delaySeconds: 3,
        result: 1,
    });
    (0, react_1.useEffect)(function () {
        var operation = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = setComponentNumber;
                        return [4 /*yield*/, slowOperation()];
                    case 1:
                        _a.apply(void 0, [_b.sent()]);
                        return [2 /*return*/];
                }
            });
        }); };
        operation();
    }, [slowOperation]);
    var childView = componentNumber === 0 ? react_1.default.createElement(Child0, null) : react_1.default.createElement(Child1, null);
    return (react_1.default.createElement(react_native_performance_navigation_1.ReactNavigationPerformanceView, { screenName: constants_1.NavigationKeys.CONDITIONAL_RENDERING_SCREEN, interactive: true, renderPassName: componentNumber === 0 ? 'interactive_0' : 'interactive_1' }, childView));
};
exports.default = ConditionalRenderingScreen;
//# sourceMappingURL=ConditionalRenderingScreen.js.map