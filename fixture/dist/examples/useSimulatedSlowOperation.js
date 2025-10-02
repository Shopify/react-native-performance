"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
function useSimulatedSlowOperation(_a) {
    var delaySeconds = _a.delaySeconds, result = _a.result;
    return (0, react_1.useCallback)(function () {
        var promise = new Promise(function (resolve) {
            setTimeout(function () {
                resolve(result);
            }, delaySeconds * 1000);
        });
        return promise;
    }, [delaySeconds, result]);
}
exports.default = useSimulatedSlowOperation;
//# sourceMappingURL=useSimulatedSlowOperation.js.map