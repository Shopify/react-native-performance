"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var graphql_tag_1 = tslib_1.__importDefault(require("graphql-tag"));
var react_native_performance_navigation_1 = require("@shopify/react-native-performance-navigation");
var react_native_1 = require("react-native");
var native_1 = require("@react-navigation/native");
var client_1 = require("@apollo/client");
var constants_1 = require("../constants");
var AllRickAndMortyCharacters = (0, graphql_tag_1.default)(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n  query AllRickAndMortyCharacters {\n    characters {\n      results {\n        name\n      }\n    }\n  }\n"], ["\n  query AllRickAndMortyCharacters {\n    characters {\n      results {\n        name\n      }\n    }\n  }\n"])));
function useRickAndMortyData() {
    var _this = this;
    var client = (0, client_1.useApolloClient)();
    var _a = tslib_1.__read((0, react_1.useState)({ queryState: 'loading' }), 2), _b = _a[0], response = _b.response, queryState = _b.queryState, setQueryState = _a[1];
    var doQuery = (0, react_1.useCallback)(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var cacheResponse, error_1, networkResponse;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.query({
                            query: AllRickAndMortyCharacters,
                            fetchPolicy: 'cache-only',
                        })];
                case 1:
                    cacheResponse = _a.sent();
                    if (cacheResponse.data.characters !== undefined) {
                        setQueryState({ response: cacheResponse.data, queryState: 'cache' });
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    return [3 /*break*/, 3];
                case 3: return [4 /*yield*/, client.query({
                        query: AllRickAndMortyCharacters,
                        fetchPolicy: 'network-only',
                    })];
                case 4:
                    networkResponse = _a.sent();
                    setQueryState({ response: networkResponse.data, queryState: 'network' });
                    return [2 /*return*/];
            }
        });
    }); }, [client]);
    return {
        doQuery: doQuery,
        response: response,
        queryState: queryState,
    };
}
var FastRenderPassesScreen = function () {
    var _a = useRickAndMortyData(), queryState = _a.queryState, doQuery = _a.doQuery;
    var interactive = queryState !== 'loading';
    var renderPassName = queryState;
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(function () {
        doQuery();
    }, [doQuery]));
    return (react_1.default.createElement(react_native_performance_navigation_1.ReactNavigationPerformanceView, { screenName: constants_1.NavigationKeys.FAST_RENDER_PASSES_SCREEN, interactive: interactive, renderPassName: renderPassName },
        react_1.default.createElement(react_native_1.Text, null, renderPassName)));
};
exports.default = FastRenderPassesScreen;
var templateObject_1;
//# sourceMappingURL=FastRenderPassesScreen.js.map