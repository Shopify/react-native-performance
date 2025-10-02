"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = require("react");
var RenderPassReportGenerator_1 = tslib_1.__importDefault(require("../RenderPassReportGenerator"));
var utils_1 = require("../utils");
var state_machine_1 = require("../state-machine");
function useRenderPassReport(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.destinationScreen, destinationScreenToReportPattern = _c === void 0 ? new RegExp('^.*$') : _c;
    var errorHandler = (0, utils_1.useErrorHandler)();
    var _d = tslib_1.__read((0, react_1.useState)(undefined), 2), latestReport = _d[0], setLatestReport = _d[1];
    var destinationScreenSource = typeof destinationScreenToReportPattern === 'string'
        ? destinationScreenToReportPattern
        : destinationScreenToReportPattern.source;
    var stateController = (0, state_machine_1.useStateController)({
        destinationScreen: destinationScreenSource,
    });
    var onStateChangedListener = (0, react_1.useCallback)(function (affectedScreen, _, newState) {
        if ((0, utils_1.matchesPattern)(affectedScreen, destinationScreenToReportPattern)) {
            (0, RenderPassReportGenerator_1.default)(newState)
                .then(function (report) {
                if (report !== null) {
                    setLatestReport(report);
                }
            })
                .catch(errorHandler);
        }
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [destinationScreenSource, errorHandler]);
    (0, react_1.useEffect)(function () {
        stateController.addStateChangedListener(onStateChangedListener);
        return function () {
            stateController.removeStateChangedListener(onStateChangedListener);
        };
    }, [stateController, onStateChangedListener, destinationScreenSource]);
    return latestReport;
}
exports.default = useRenderPassReport;
//# sourceMappingURL=useRenderPassReport.js.map