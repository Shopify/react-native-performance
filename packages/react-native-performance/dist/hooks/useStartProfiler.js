"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var state_machine_1 = require("../state-machine");
var useStartProfiler = function () {
    var stateController = (0, state_machine_1.useStateController)();
    var startTimer = (0, react_1.useCallback)(function (args) {
        stateController.onNavigationStarted({
            sourceScreen: args.source,
            uiEvent: args.uiEvent,
            renderTimeoutMillisOverride: args.renderTimeoutMillisOverride,
        });
    }, [stateController]);
    return startTimer;
};
exports.default = useStartProfiler;
//# sourceMappingURL=useStartProfiler.js.map