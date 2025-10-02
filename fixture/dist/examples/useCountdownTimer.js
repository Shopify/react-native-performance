"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = require("react");
function useCountdownTimer(_a) {
    var durationSeconds = _a.durationSeconds;
    var _b = tslib_1.__read((0, react_1.useState)(durationSeconds), 2), secondsLeft = _b[0], setSecondsLeft = _b[1];
    var _c = tslib_1.__read((0, react_1.useState)(0), 2), restartCounter = _c[0], setRestartCounter = _c[1];
    (0, react_1.useEffect)(function () {
        setSecondsLeft(durationSeconds);
        var intervalId = setInterval(function () {
            setSecondsLeft(function (currentSecondsLeft) {
                var newSecondsLeft = currentSecondsLeft - 1;
                if (newSecondsLeft <= 0) {
                    clearInterval(intervalId);
                }
                return newSecondsLeft;
            });
        }, 1000);
        return function () {
            clearInterval(intervalId);
        };
    }, [durationSeconds, restartCounter]);
    var restart = (0, react_1.useCallback)(function () {
        setRestartCounter(function (counter) { return counter + 1; });
        setSecondsLeft(durationSeconds);
    }, [durationSeconds]);
    return [secondsLeft, restart];
}
exports.default = useCountdownTimer;
//# sourceMappingURL=useCountdownTimer.js.map