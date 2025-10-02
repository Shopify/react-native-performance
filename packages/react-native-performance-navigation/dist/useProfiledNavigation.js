"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var native_1 = require("@react-navigation/native");
var react_native_performance_1 = require("@shopify/react-native-performance");
var react_1 = require("react");
var lodash_isequal_1 = tslib_1.__importDefault(require("lodash.isequal"));
var PROFILED_APIS = ['navigate', 'push', 'replace'];
var UnexpectedPropertyType = /** @class */ (function (_super) {
    tslib_1.__extends(UnexpectedPropertyType, _super);
    function UnexpectedPropertyType(destinationScreen, functionName, propertyType) {
        var _this = _super.call(this, "Expected '".concat(functionName, "' to be a function defined on the inner navigator, but it was of type '").concat(propertyType, "'."), 'bug') || this;
        _this.name = 'UnexpectedPropertyType';
        _this.destinationScreen = destinationScreen;
        Object.setPrototypeOf(_this, UnexpectedPropertyType.prototype);
        return _this;
    }
    return UnexpectedPropertyType;
}(react_native_performance_1.PerformanceProfilerError));
function isStartTimerArgs(arg) {
    return ((0, react_native_performance_1.isGestureResponderEvent)(arg === null || arg === void 0 ? void 0 : arg.uiEvent) ||
        typeof (arg === null || arg === void 0 ? void 0 : arg.source) === 'string' ||
        typeof (arg === null || arg === void 0 ? void 0 : arg.renderTimeoutMillisOverride) === 'number' ||
        (0, lodash_isequal_1.default)(arg, {}));
}
function extractStartNavigationArgs(args) {
    var startTimerArgs = {};
    var navArgs = args;
    if (args.length > 0 && isStartTimerArgs(args[0])) {
        startTimerArgs = args[0];
        navArgs = args.slice(1);
    }
    return [startTimerArgs, navArgs];
}
var useProfiledNavigation = function () {
    var navigation = (0, native_1.useNavigation)();
    var startTimer = (0, react_native_performance_1.useStartProfiler)();
    var errorHandler = (0, react_native_performance_1.useErrorHandler)();
    var wrapperBuilder = (0, react_1.useCallback)(function (functionName) {
        if (typeof navigation[functionName] !== 'function') {
            errorHandler(new UnexpectedPropertyType(react_native_performance_1.DESTINATION_SCREEN_NAME_PLACEHOLDER, functionName, typeof navigation[functionName]));
            return undefined;
        }
        var profiledVersion = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _a = tslib_1.__read(extractStartNavigationArgs(args), 2), startTimerArgs = _a[0], navArgs = _a[1];
            try {
                startTimer(startTimerArgs);
            }
            catch (error) {
                errorHandler(error);
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return navigation[functionName].apply(navigation, tslib_1.__spreadArray([], tslib_1.__read(navArgs), false));
        };
        return profiledVersion;
    }, [navigation, startTimer, errorHandler]);
    var profiledNavigation = (0, react_1.useMemo)(function () {
        var profiledNavigation = PROFILED_APIS.reduce(function (profiledNavigation, functionName) {
            if (functionName in navigation) {
                profiledNavigation[functionName] = wrapperBuilder(functionName);
            }
            return profiledNavigation;
        }, {});
        return Object.setPrototypeOf(profiledNavigation, navigation);
    }, [wrapperBuilder, navigation]);
    return profiledNavigation;
};
exports.default = useProfiledNavigation;
//# sourceMappingURL=useProfiledNavigation.js.map