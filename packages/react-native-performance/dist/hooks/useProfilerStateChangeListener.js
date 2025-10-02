"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var state_machine_1 = require("../state-machine");
var utils_1 = require("../utils");
function useProfilerStateChangeListener(_a) {
    var _b = _a.destinationScreen, destinationScreenToReportPattern = _b === void 0 ? new RegExp('^.*$') : _b, onStateChanged = _a.onStateChanged;
    var destinationScreenSource = typeof destinationScreenToReportPattern === 'string'
        ? destinationScreenToReportPattern
        : destinationScreenToReportPattern.source;
    var stateController = (0, state_machine_1.useStateController)({
        destinationScreen: destinationScreenSource,
    });
    var onStateChangedListener = (0, react_1.useCallback)(function (affectedScreen, _, newState) {
        if ((0, utils_1.matchesPattern)(affectedScreen, destinationScreenToReportPattern)) {
            onStateChanged(newState);
        }
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [destinationScreenSource, onStateChanged]);
    (0, react_1.useEffect)(function () {
        var currentState = stateController.getCurrentStateFor(destinationScreenToReportPattern);
        if (currentState !== undefined) {
            onStateChanged(currentState);
        }
        stateController.addStateChangedListener(onStateChangedListener);
        return function () {
            stateController.removeStateChangedListener(onStateChangedListener);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stateController, onStateChangedListener, onStateChanged, destinationScreenSource]);
}
exports.default = useProfilerStateChangeListener;
//# sourceMappingURL=useProfilerStateChangeListener.js.map