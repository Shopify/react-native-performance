"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ErrorHandlerStateController_1 = tslib_1.__importDefault(require("../../../state-machine/controller/ErrorHandlerStateController"));
var MockStateController_1 = tslib_1.__importDefault(require("../../MockStateController"));
describe('state-machine/controller/ErrorHandlerStateController', function () {
    var innerStateController;
    var errorHandler;
    var stateController;
    beforeEach(function () {
        innerStateController = new MockStateController_1.default();
        errorHandler = jest.fn();
        stateController = new ErrorHandlerStateController_1.default(innerStateController, errorHandler);
    });
    afterEach(function () {
        jest.resetAllMocks();
    });
    it("executes the inner state controller's APIs", function () {
        var args = { property: 'value' };
        for (var functionName in stateController) {
            if (Object.prototype.hasOwnProperty.call(stateController, functionName)) {
                if (typeof stateController[functionName] === 'function' &&
                    typeof innerStateController[functionName] === 'function') {
                    var outerFn = stateController[functionName].bind(stateController);
                    var innerFn = innerStateController[functionName].bind(innerStateController);
                    expect(innerFn).not.toHaveBeenCalled();
                    outerFn(args);
                    expect(innerFn).toHaveBeenCalledTimes(1);
                    expect(innerFn).toHaveBeenCalledWith(args);
                }
            }
        }
    });
    it('routes the errors through the error handler', function () {
        var args = { property: 'value' };
        var _loop_1 = function (functionName) {
            if (Object.prototype.hasOwnProperty.call(stateController, functionName)) {
                if (typeof stateController[functionName] === 'function' &&
                    typeof innerStateController[functionName] === 'function') {
                    var mockError_1 = new Error('some error message');
                    var outerFn = stateController[functionName].bind(stateController);
                    var innerFn = innerStateController[functionName].bind(innerStateController);
                    innerFn.mockImplementation(function () {
                        throw mockError_1;
                    });
                    expect(errorHandler).not.toHaveBeenCalled();
                    outerFn(args);
                    expect(errorHandler).toHaveBeenCalledTimes(1);
                    expect(errorHandler).toHaveBeenCalledWith(mockError_1);
                    errorHandler.mockClear();
                }
            }
        };
        for (var functionName in stateController) {
            _loop_1(functionName);
        }
    });
});
//# sourceMappingURL=ErrorHandlerStateController.test.js.map