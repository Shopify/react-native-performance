"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissingTabBarTimestampError = exports.DEFAULT_SOURCE_NAME = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var bottom_tabs_1 = require("@react-navigation/bottom-tabs");
var react_native_performance_1 = require("@shopify/react-native-performance");
var react_native_1 = require("react-native");
var FixedSizeStack_1 = tslib_1.__importDefault(require("./FixedSizeStack"));
exports.DEFAULT_SOURCE_NAME = 'BottomTabBar';
var MissingTabBarTimestampError = /** @class */ (function (_super) {
    tslib_1.__extends(MissingTabBarTimestampError, _super);
    function MissingTabBarTimestampError(destinationScreen) {
        var _this = _super.call(this, 'Could not capture the native touch timestamp of the tab bar button. ' +
            'As a result, the TTI timer will not start when the navigation button was pressed. ' +
            'Instead, it will start when the JS Touchable.onPress code was executed. This may lead to imprecise TTI ' +
            'values (shorter than what the user actually perceived).', 'bug') || this;
        _this.name = 'MissingTabBarTimestampError';
        _this.destinationScreen = destinationScreen;
        Object.setPrototypeOf(_this, MissingTabBarTimestampError.prototype);
        return _this;
    }
    return MissingTabBarTimestampError;
}(react_native_performance_1.PerformanceProfilerError));
exports.MissingTabBarTimestampError = MissingTabBarTimestampError;
function ProfiledTabBarComponent(_a) {
    var navigation = _a.navigation, tabPressEventRecorder = _a.tabPressEventRecorder, InnerTabBar = _a.InnerTabBar, source = _a.source, rest = tslib_1.__rest(_a, ["navigation", "tabPressEventRecorder", "InnerTabBar", "source"]);
    var startTimer = (0, react_native_performance_1.useStartProfiler)();
    var errorHandler = (0, react_native_performance_1.useErrorHandler)();
    var wrappedNavigation = (0, react_1.useMemo)(function () {
        var wrappedNavigation = Object.create(navigation);
        var emit = function (event) {
            if (event.type === 'tabPress') {
                var lastRecordedEvent = tabPressEventRecorder.pop();
                if (!lastRecordedEvent || !('timestamp' in lastRecordedEvent.nativeEvent)) {
                    errorHandler(new MissingTabBarTimestampError(react_native_performance_1.DESTINATION_SCREEN_NAME_PLACEHOLDER));
                }
                var uiEvent = lastRecordedEvent && 'timestamp' in lastRecordedEvent.nativeEvent
                    ? {
                        nativeEvent: {
                            timestamp: lastRecordedEvent.nativeEvent.timestamp,
                        },
                    }
                    : undefined;
                startTimer({
                    source: source,
                    uiEvent: uiEvent,
                });
            }
            return navigation.emit(event);
        };
        wrappedNavigation.emit = emit;
        return wrappedNavigation;
    }, [errorHandler, navigation, source, startTimer, tabPressEventRecorder]);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return react_1.default.createElement(InnerTabBar, tslib_1.__assign({}, rest, { navigation: wrappedNavigation }));
}
function createProfiledBottomTabNavigator(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.source, source = _c === void 0 ? exports.DEFAULT_SOURCE_NAME : _c;
    var tabPressEventRecorder = new FixedSizeStack_1.default(1);
    var Tab = (0, bottom_tabs_1.createBottomTabNavigator)();
    function buildProfiledTabBar(_a) {
        var navigation = _a.navigation, _b = _a.InnerTabBar, InnerTabBar = _b === void 0 ? bottom_tabs_1.BottomTabBar : _b, rest = tslib_1.__rest(_a, ["navigation", "InnerTabBar"]);
        return (react_1.default.createElement(ProfiledTabBarComponent, tslib_1.__assign({ navigation: navigation, tabPressEventRecorder: tabPressEventRecorder, InnerTabBar: InnerTabBar, source: source }, rest)));
    }
    var ProfiledNavigator = function (props) {
        return (react_1.default.createElement(Tab.Navigator, tslib_1.__assign({}, props, { tabBar: function (tabBarProps) { return buildProfiledTabBar(tslib_1.__assign(tslib_1.__assign({}, tabBarProps), { InnerTabBar: props.tabBar })); } })));
    };
    function buildProfiledBottomTabBarButton(_a) {
        var _b = _a === void 0 ? {} : _a, Touchable = _b.Touchable;
        var ProfiledTouchable = function (_a) {
            var onPress = _a.onPress, style = _a.style, children = _a.children, rest = tslib_1.__rest(_a, ["onPress", "style", "children"]);
            var profilerStartingOnPress = (0, react_1.useCallback)(function (event) {
                tabPressEventRecorder.push(event);
                onPress === null || onPress === void 0 ? void 0 : onPress(event);
            }, [onPress]);
            var TouchableComponent = Touchable !== null && Touchable !== void 0 ? Touchable : react_native_1.TouchableWithoutFeedback;
            return (
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            react_1.default.createElement(TouchableComponent, tslib_1.__assign({ onPress: profilerStartingOnPress }, rest),
                react_1.default.createElement(react_native_1.View, { style: style }, children)));
        };
        return ProfiledTouchable;
    }
    var ProfiledTab = Object.create(Tab);
    ProfiledTab.Navigator = ProfiledNavigator;
    return { Tab: ProfiledTab, buildProfiledBottomTabBarButton: buildProfiledBottomTabBarButton };
}
exports.default = createProfiledBottomTabNavigator;
//# sourceMappingURL=createProfiledBottomTabNavigator.js.map