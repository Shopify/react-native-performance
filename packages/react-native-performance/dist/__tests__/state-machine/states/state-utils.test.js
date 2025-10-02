"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var states_1 = require("../../../state-machine/states");
var State_1 = tslib_1.__importDefault(require("../../../state-machine/states/State"));
var state_utils_1 = require("../../../state-machine/states/state-utils");
var BridgedEventTimestamp_1 = require("../../../BridgedEventTimestamp");
var MockState = /** @class */ (function (_super) {
    tslib_1.__extends(MockState, _super);
    function MockState(_a) {
        var _this = this;
        var payload = _a.payload, rest = tslib_1.__rest(_a, ["payload"]);
        _this = _super.call(this, tslib_1.__assign(tslib_1.__assign({}, rest), { timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(1000).build() })) || this;
        _this.payload = payload;
        return _this;
    }
    MockState.prototype.getStateName = function () {
        return MockState.STATE_NAME;
    };
    MockState.prototype.cloneAsChild = function () {
        return new MockState(tslib_1.__assign(tslib_1.__assign({}, this), { previousState: this }));
    };
    MockState.STATE_NAME = 'MockState';
    return MockState;
}(State_1.default));
describe('state-machine/states/state-utils', function () {
    describe('reverseTraverse', function () {
        it('traverses the states', function () {
            var state1 = new MockState({
                destinationScreen: 'some_screen',
                componentInstanceId: 'id',
                previousState: undefined,
                snapshotId: Promise.resolve('1'),
            });
            var state2 = new MockState({
                destinationScreen: 'some_screen',
                componentInstanceId: 'id',
                previousState: state1,
                snapshotId: Promise.resolve('2'),
            });
            var state3 = new MockState({
                destinationScreen: 'some_screen',
                componentInstanceId: 'id',
                previousState: state2,
                snapshotId: Promise.resolve('3'),
            });
            var actualVisitedStates = new Array();
            (0, state_utils_1.reverseTraverse)(state3, function (currentPass) {
                actualVisitedStates.push(currentPass);
            });
            expect(actualVisitedStates).toStrictEqual([state3, state2, state1]);
            actualVisitedStates = [];
            (0, state_utils_1.reverseTraverse)(state2, function (currentPass) {
                actualVisitedStates.push(currentPass);
            });
            expect(actualVisitedStates).toStrictEqual([state2, state1]);
            actualVisitedStates = [];
            (0, state_utils_1.reverseTraverse)(state1, function (currentPass) {
                actualVisitedStates.push(currentPass);
            });
            expect(actualVisitedStates).toStrictEqual([state1]);
        });
        it('stops traversing when the operation returns true', function () {
            var state1 = new MockState({
                destinationScreen: 'some_screen',
                componentInstanceId: 'id',
                previousState: undefined,
                snapshotId: Promise.resolve('1'),
            });
            var state2 = new MockState({
                destinationScreen: 'some_screen',
                componentInstanceId: 'id',
                previousState: state1,
                snapshotId: Promise.resolve('2'),
            });
            var state3 = new MockState({
                destinationScreen: 'some_screen',
                componentInstanceId: 'id',
                previousState: state2,
                snapshotId: Promise.resolve('3'),
            });
            var actualVisitedStates = new Array();
            (0, state_utils_1.reverseTraverse)(state3, function (currentPass) {
                actualVisitedStates.push(currentPass);
                if (currentPass === state2) {
                    return true;
                }
            });
            expect(actualVisitedStates).toStrictEqual([state3, state2]);
        });
        it('continues traversing when the operation returns false', function () {
            var state1 = new MockState({
                destinationScreen: 'some_screen',
                componentInstanceId: 'id',
                previousState: undefined,
                snapshotId: Promise.resolve('1'),
            });
            var state2 = new MockState({
                destinationScreen: 'some_screen',
                componentInstanceId: 'id',
                previousState: state1,
                snapshotId: Promise.resolve('2'),
            });
            var state3 = new MockState({
                destinationScreen: 'some_screen',
                componentInstanceId: 'id',
                previousState: state2,
                snapshotId: Promise.resolve('3'),
            });
            var actualVisitedStates = new Array();
            (0, state_utils_1.reverseTraverse)(state3, function (currentPass) {
                actualVisitedStates.push(currentPass);
                return false;
            });
            expect(actualVisitedStates).toStrictEqual([state3, state2, state1]);
        });
    });
    describe('reverseReduce', function () {
        it('reduces the entire state history', function () {
            var state1 = new MockState({
                destinationScreen: 'some_screen',
                componentInstanceId: 'id',
                previousState: undefined,
                payload: '1',
                snapshotId: Promise.resolve('1'),
            });
            var state2 = new MockState({
                destinationScreen: 'some_screen',
                componentInstanceId: 'id',
                previousState: state1,
                payload: '2',
                snapshotId: Promise.resolve('2'),
            });
            var state3 = new MockState({
                destinationScreen: 'some_screen',
                componentInstanceId: 'id',
                previousState: state2,
                payload: '3',
                snapshotId: Promise.resolve('3'),
            });
            var reduced = (0, state_utils_1.reverseReduce)(state3, function (state, reduced) {
                if (state instanceof MockState) {
                    return reduced + state.payload;
                }
                else {
                    throw new Error("Unknown state in chain: ".concat(state, "."));
                }
            }, '');
            expect(reduced).toBe('321');
        });
    });
    describe('getFlowStartState', function () {
        it('returns this if this is a flow start state', function () {
            var state1 = new states_1.Started({});
            var state2 = new states_1.Started({});
            expect((0, state_utils_1.getFlowStartState)(state1)).toBe(state1);
            expect((0, state_utils_1.getFlowStartState)(state2)).toBe(state2);
        });
        it('throws an error if a non-flow start state has an undefined previous state', function () {
            var state1 = new MockState({
                destinationScreen: 'some_screen',
                componentInstanceId: 'id',
                previousState: undefined,
                snapshotId: Promise.resolve('1'),
            });
            var flowStartState;
            expect(function () {
                flowStartState = (0, state_utils_1.getFlowStartState)(state1);
            }).toThrowError(state_utils_1.UndefinedPreviousStateError);
            expect(flowStartState).toBeUndefined();
        });
    });
});
//# sourceMappingURL=state-utils.test.js.map