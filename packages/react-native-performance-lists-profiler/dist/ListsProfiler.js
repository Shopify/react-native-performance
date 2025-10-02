"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var react_native_flipper_1 = require("react-native-flipper");
var ListsProfilerContext_1 = require("./ListsProfilerContext");
var bootstrapPlugin = function () {
    return new Promise(function (resolve) {
        (0, react_native_flipper_1.addPlugin)({
            getId: function () { return '@shopify/react-native-performance'; },
            onConnect: function (connection) {
                return resolve(connection);
            },
            onDisconnect: function () { },
            runInBackground: function () { return true; },
        });
    });
};
/**
 * Wrap your app with this component to get events from all the lists wrapped with their performance view.
 * For example, `FlatList` must be wrapped in the `FlatListPerformanceView`.
 */
var ListsProfiler = function (_a) {
    var _b = _a.onInteractive, onInteractive = _b === void 0 ? function () { } : _b, _c = _a.onBlankArea, onBlankArea = _c === void 0 ? function () { } : _c, children = _a.children;
    var connection;
    bootstrapPlugin()
        .then(function (conn) {
        connection = conn;
    })
        .catch(function (error) {
        throw error;
    });
    var onInteractiveCallback = (0, react_1.useCallback)(function (TTI, listName) {
        onInteractive(TTI, listName);
        connection === null || connection === void 0 ? void 0 : connection.send('newListTTIData', {
            TTI: TTI,
            listName: listName,
        });
    }, [connection, onInteractive]);
    var onBlankAreaCallback = (0, react_1.useCallback)(function (offsetStart, offsetEnd, listName) {
        onBlankArea(offsetStart, offsetEnd, listName);
        var blankArea = Math.max(Math.max(offsetStart, offsetEnd), 0);
        connection === null || connection === void 0 ? void 0 : connection.send('newBlankData', {
            offset: blankArea,
            listName: listName,
        });
    }, [connection, onBlankArea]);
    return (react_1.default.createElement(ListsProfilerContext_1.ListsProfilerContextProvider, { value: {
            onInteractive: onInteractiveCallback,
            onBlankArea: onBlankAreaCallback,
        } }, children));
};
exports.default = ListsProfiler;
//# sourceMappingURL=ListsProfiler.js.map