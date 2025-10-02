"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_SOURCE_NAME = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var drawer_1 = require("@react-navigation/drawer");
var react_native_performance_1 = require("@shopify/react-native-performance");
exports.DEFAULT_SOURCE_NAME = 'Drawer';
var createProfiledNavigation = function (_a) {
    var navigation = _a.navigation, startProfiler = _a.startProfiler, source = _a.source;
    var wrappedNav = Object.create(navigation);
    var profiledDispatch = function (action) {
        // Note that the drawer navigator internally uses custom animated touchables
        // that do not expose the native press timestamps. So we cannot
        // compute the `timeToConsumeTouchEvent`.
        if ('type' in action && action.type === 'NAVIGATE') {
            startProfiler({
                source: source,
            });
        }
        return navigation.dispatch(action);
    };
    wrappedNav.dispatch = profiledDispatch;
    return wrappedNav;
};
function createProfiledDrawerContent(_a) {
    var InnerDrawerContent = _a.InnerDrawerContent, source = _a.source, startProfiler = _a.startProfiler, errorHandler = _a.errorHandler;
    var ProfiledDrawerContent = function (_a) {
        var navigation = _a.navigation, rest = tslib_1.__rest(_a, ["navigation"]);
        var profiledNavigation = createProfiledNavigation({
            navigation: navigation,
            source: source,
            errorHandler: errorHandler,
            startProfiler: startProfiler,
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return react_1.default.createElement(InnerDrawerContent, tslib_1.__assign({}, rest, { navigation: profiledNavigation }));
    };
    return ProfiledDrawerContent;
}
var createProfiledDrawerNavigator = function (_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.source, source = _c === void 0 ? exports.DEFAULT_SOURCE_NAME : _c;
    var BaseDrawer = (0, drawer_1.createDrawerNavigator)();
    var ProfiledDrawer = Object.create(BaseDrawer);
    var ProfiledNavigator = function (_a) {
        var _b = _a.drawerContent, drawerContent = _b === void 0 ? drawer_1.DrawerContent : _b, rest = tslib_1.__rest(_a, ["drawerContent"]);
        var errorHandler = (0, react_native_performance_1.useErrorHandler)();
        var startProfiler = (0, react_native_performance_1.useStartProfiler)();
        var profiledDrawerContent = (0, react_1.useMemo)(function () {
            return createProfiledDrawerContent({
                InnerDrawerContent: drawerContent,
                source: source,
                errorHandler: errorHandler,
                startProfiler: startProfiler,
            });
        }, [drawerContent, errorHandler, startProfiler]);
        return react_1.default.createElement(BaseDrawer.Navigator, tslib_1.__assign({}, rest, { drawerContent: profiledDrawerContent }));
    };
    ProfiledDrawer.Navigator = ProfiledNavigator;
    return ProfiledDrawer;
};
exports.default = createProfiledDrawerNavigator;
//# sourceMappingURL=createProfiledDrawerNavigator.js.map