"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = require("react");
var useProfilerStateChangeListener_1 = tslib_1.__importDefault(require("./useProfilerStateChangeListener"));
function useProfilerState(_a) {
    var destinationScreen = _a.destinationScreen;
    var _b = tslib_1.__read((0, react_1.useState)(undefined), 2), state = _b[0], setState = _b[1];
    (0, useProfilerStateChangeListener_1.default)({
        destinationScreen: destinationScreen,
        onStateChanged: setState,
    });
    return state;
}
exports.default = useProfilerState;
//# sourceMappingURL=useProfilerState.js.map