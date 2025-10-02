"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = require("react");
var RenderPassReportGenerator_1 = tslib_1.__importDefault(require("../RenderPassReportGenerator"));
var Logger_1 = tslib_1.__importStar(require("../utils/Logger"));
function useReportEmitter(_a) {
    var onReportPrepared = _a.onReportPrepared, errorHandler = _a.errorHandler;
    var reportEmitter = (0, react_1.useCallback)(function (_, __, newState) {
        (0, RenderPassReportGenerator_1.default)(newState)
            .then(function (report) {
            if (report !== null) {
                if (Logger_1.default.logLevel <= Logger_1.LogLevel.Info) {
                    Logger_1.default.info("Render Pass Report: ".concat(JSON.stringify(report, undefined, 2)));
                }
                onReportPrepared(report);
            }
        })
            .catch(errorHandler);
    }, [onReportPrepared, errorHandler]);
    return reportEmitter;
}
exports.default = useReportEmitter;
//# sourceMappingURL=useReportEmitter.js.map