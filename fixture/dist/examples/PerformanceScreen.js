"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var react_native_1 = require("react-native");
var react_native_performance_1 = require("@shopify/react-native-performance");
var react_native_performance_navigation_1 = require("@shopify/react-native-performance-navigation");
var graphql_tag_1 = tslib_1.__importDefault(require("graphql-tag"));
var react_native_gesture_handler_1 = require("react-native-gesture-handler");
var client_1 = require("@apollo/client");
var constants_1 = require("../constants");
var useSimulatedSlowOperation_1 = tslib_1.__importDefault(require("./useSimulatedSlowOperation"));
var useCountdownTimer_1 = tslib_1.__importDefault(require("./useCountdownTimer"));
var RENDER_DELAY_SECONDS = 5;
var AllRickAndMortyCharacters = (0, graphql_tag_1.default)(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n  query AllRickAndMortyCharacters {\n    characters {\n      results {\n        name\n      }\n    }\n  }\n"], ["\n  query AllRickAndMortyCharacters {\n    characters {\n      results {\n        name\n      }\n    }\n  }\n"])));
var PerformanceScreen = function () {
    var navigation = (0, react_native_performance_navigation_1.useProfiledNavigation)();
    var _a = tslib_1.__read((0, react_1.useState)(), 2), simulatedSlowData = _a[0], setSimulatedSlowData = _a[1];
    var _b = tslib_1.__read((0, useCountdownTimer_1.default)({
        durationSeconds: RENDER_DELAY_SECONDS,
    }), 2), secondsLeft = _b[0], restartTimer = _b[1];
    var simulatedSlowOperation = (0, useSimulatedSlowOperation_1.default)({
        delaySeconds: RENDER_DELAY_SECONDS,
        result: '<some simulated slow API result>',
    });
    var rickAndMortyQueryResult = (0, client_1.useQuery)(AllRickAndMortyCharacters);
    var _c = (0, react_native_performance_1.useResetFlow)(), resetFlow = _c.resetFlow, componentInstanceId = _c.componentInstanceId;
    (0, react_1.useEffect)(function () {
        (function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var data;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, simulatedSlowOperation()];
                    case 1:
                        data = _a.sent();
                        setSimulatedSlowData(data);
                        return [2 /*return*/];
                }
            });
        }); })();
    }, [simulatedSlowOperation]);
    var rendered = rickAndMortyQueryResult.data !== undefined && simulatedSlowData !== undefined;
    var goHome = (0, react_1.useCallback)(function (uiEvent) {
        navigation.navigate({ uiEvent: uiEvent }, { name: constants_1.NavigationKeys.EXAMPLES, params: {} });
    }, [navigation]);
    var RenderedBody = (0, react_1.useMemo)(function () {
        return (react_1.default.createElement(react_native_gesture_handler_1.ScrollView, null,
            react_1.default.createElement(react_native_1.Text, { style: styles.helperText },
                "Rendered: ",
                JSON.stringify({ simulatedSlowData: simulatedSlowData })),
            react_1.default.createElement(react_native_1.Text, { style: styles.helperText },
                "All Rick and Morty characters: ",
                JSON.stringify(rickAndMortyQueryResult.data))));
    }, [simulatedSlowData, rickAndMortyQueryResult]);
    var WaitingBody = (0, react_1.useMemo)(function () {
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(react_native_1.ActivityIndicator, null),
            react_1.default.createElement(react_native_1.Text, { style: styles.helperText },
                "Rendering in: ",
                secondsLeft,
                " seconds.")));
    }, [secondsLeft]);
    var renderStateProps;
    if (rendered) {
        renderStateProps = {
            interactive: true,
        };
    }
    else {
        renderStateProps = {
            interactive: false,
            renderPassName: "loading_".concat(RENDER_DELAY_SECONDS - secondsLeft),
        };
    }
    var onFakePullToRefresh = (0, react_1.useCallback)(function (uiEvent) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var data;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    resetFlow({ uiEvent: uiEvent, destination: constants_1.NavigationKeys.PERFORMANCE, renderTimeoutMillisOverride: 6 * 1000 });
                    restartTimer();
                    setSimulatedSlowData(undefined);
                    rickAndMortyQueryResult.refetch();
                    return [4 /*yield*/, simulatedSlowOperation()];
                case 1:
                    data = _a.sent();
                    setSimulatedSlowData(data);
                    return [2 /*return*/];
            }
        });
    }); }, [resetFlow, restartTimer, rickAndMortyQueryResult, simulatedSlowOperation]);
    return (react_1.default.createElement(react_native_performance_navigation_1.ReactNavigationPerformanceView, tslib_1.__assign({ screenName: constants_1.NavigationKeys.PERFORMANCE }, renderStateProps, { componentInstanceId: componentInstanceId }),
        react_1.default.createElement(react_native_1.Button, { onPress: onFakePullToRefresh, title: "Simulate Pull-to-refresh" }),
        react_1.default.createElement(react_native_1.Button, { title: "Go to home", onPress: goHome }),
        react_1.default.createElement(react_native_1.StatusBar, { barStyle: "dark-content" }),
        react_1.default.createElement(react_native_1.SafeAreaView, { style: styles.container }, rendered ? RenderedBody : WaitingBody)));
};
var styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        margin: 64,
    },
    helperText: {
        margin: 16,
        textAlign: 'center',
    },
});
exports.default = PerformanceScreen;
var templateObject_1;
//# sourceMappingURL=PerformanceScreen.js.map