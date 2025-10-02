"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = require("react");
var state_machine_1 = require("../state-machine");
var useComponentInstanceId_1 = tslib_1.__importDefault(require("./useComponentInstanceId"));
var useResetFlow = function () {
    var stateController = (0, state_machine_1.useStateController)();
    var componentInstanceId = (0, useComponentInstanceId_1.default)();
    var resetFlow = (0, react_1.useCallback)(function (args) {
        stateController.onFlowReset({
            sourceScreen: args.source,
            destinationScreen: args.destination,
            uiEvent: args.uiEvent,
            renderTimeoutMillisOverride: args.renderTimeoutMillisOverride,
            componentInstanceId: componentInstanceId,
        });
    }, [stateController, componentInstanceId]);
    return { resetFlow: resetFlow, componentInstanceId: componentInstanceId };
};
exports.default = useResetFlow;
//# sourceMappingURL=useResetFlow.js.map