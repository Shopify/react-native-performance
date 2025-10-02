"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var RenderPassReportGenerator_1 = tslib_1.__importDefault(require("../RenderPassReportGenerator"));
var states_1 = require("../state-machine/states");
var BridgedEventTimestamp_1 = require("../BridgedEventTimestamp");
var SOURCE_SCREEN = 'source';
var DESTINATION_SCREEN = 'dest';
describe('RenderPassReportGenerator', function () {
    beforeEach(function () {
        jest.spyOn(Date, 'now').mockReturnValueOnce(100);
    });
    afterEach(function () {
        jest.resetAllMocks();
    });
    it('includes the sourceScreen if the flowStartState contains it', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var flowStartState, renderState, report;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    flowStartState = new states_1.Started({
                        sourceScreen: SOURCE_SCREEN,
                        destinationScreen: DESTINATION_SCREEN,
                        componentInstanceId: 'id',
                        timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().build(),
                        previousState: undefined,
                        snapshotId: Promise.resolve('1'),
                        type: 'flow_start',
                    });
                    renderState = new states_1.Rendered({
                        renderPassName: 'pass_1',
                        interactive: true,
                        timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(1000).build(),
                        destinationScreen: DESTINATION_SCREEN,
                        componentInstanceId: 'id',
                        previousState: flowStartState,
                        snapshotId: Promise.resolve('2'),
                    });
                    return [4 /*yield*/, (0, RenderPassReportGenerator_1.default)(renderState)];
                case 1:
                    report = _a.sent();
                    expect(report === null || report === void 0 ? void 0 : report.sourceScreen).toBe(SOURCE_SCREEN);
                    return [2 /*return*/];
            }
        });
    }); });
    it('includes the destinationScreen', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var flowStartState, renderState, report;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    flowStartState = new states_1.Started({
                        sourceScreen: SOURCE_SCREEN,
                        destinationScreen: DESTINATION_SCREEN,
                        componentInstanceId: 'id',
                        timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().build(),
                        previousState: undefined,
                        snapshotId: Promise.resolve('1'),
                        type: 'flow_start',
                    });
                    renderState = new states_1.Rendered({
                        renderPassName: 'pass_1',
                        interactive: true,
                        timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(1000).build(),
                        destinationScreen: DESTINATION_SCREEN,
                        componentInstanceId: 'id',
                        previousState: flowStartState,
                        snapshotId: Promise.resolve('2'),
                    });
                    return [4 /*yield*/, (0, RenderPassReportGenerator_1.default)(renderState)];
                case 1:
                    report = _a.sent();
                    expect(report === null || report === void 0 ? void 0 : report.destinationScreen).toBe(DESTINATION_SCREEN);
                    return [2 /*return*/];
            }
        });
    }); });
    it("includes the timeToConsumeTouchEventMillis if the flow start state was of type 'flow_start'", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var flowStartState, renderState, report;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    flowStartState = new states_1.Started({
                        sourceScreen: SOURCE_SCREEN,
                        destinationScreen: DESTINATION_SCREEN,
                        componentInstanceId: 'id',
                        timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(40).build(),
                        type: 'flow_start',
                        previousState: undefined,
                        snapshotId: Promise.resolve('1'),
                    });
                    renderState = new states_1.Rendered({
                        renderPassName: 'pass_1',
                        interactive: true,
                        timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(1000).build(),
                        destinationScreen: DESTINATION_SCREEN,
                        componentInstanceId: 'id',
                        previousState: flowStartState,
                        snapshotId: Promise.resolve('2'),
                    });
                    return [4 /*yield*/, (0, RenderPassReportGenerator_1.default)(renderState)];
                case 1:
                    report = _a.sent();
                    expect(report === null || report === void 0 ? void 0 : report.timeToConsumeTouchEventMillis).toBe(60);
                    return [2 /*return*/];
            }
        });
    }); });
    it("includes the timeToBootJsMillis if the flow start state was of type 'app_boot'", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var flowStartState, renderState, report;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    flowStartState = new states_1.Started({
                        destinationScreen: DESTINATION_SCREEN,
                        componentInstanceId: 'id',
                        timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(40).build(),
                        previousState: undefined,
                        snapshotId: Promise.resolve('1'),
                        type: 'app_boot',
                        sourceScreen: undefined,
                    });
                    renderState = new states_1.Rendered({
                        renderPassName: 'pass_1',
                        interactive: true,
                        timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(1000).build(),
                        destinationScreen: DESTINATION_SCREEN,
                        componentInstanceId: 'id',
                        previousState: flowStartState,
                        snapshotId: Promise.resolve('2'),
                    });
                    return [4 /*yield*/, (0, RenderPassReportGenerator_1.default)(renderState)];
                case 1:
                    report = _a.sent();
                    expect(report === null || report === void 0 ? void 0 : report.timeToBootJsMillis).toBe(60);
                    return [2 /*return*/];
            }
        });
    }); });
    it('includes the renderPassName when it is available', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var flowStartState, renderState, report;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    flowStartState = new states_1.Started({
                        destinationScreen: DESTINATION_SCREEN,
                        componentInstanceId: 'id',
                        timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(40).build(),
                        previousState: undefined,
                        snapshotId: Promise.resolve('1'),
                        type: 'app_boot',
                        sourceScreen: undefined,
                    });
                    renderState = new states_1.Rendered({
                        renderPassName: 'pass_1',
                        interactive: true,
                        timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(1000).build(),
                        destinationScreen: DESTINATION_SCREEN,
                        componentInstanceId: 'id',
                        previousState: flowStartState,
                        snapshotId: Promise.resolve('2'),
                    });
                    return [4 /*yield*/, (0, RenderPassReportGenerator_1.default)(renderState)];
                case 1:
                    report = _a.sent();
                    expect(report === null || report === void 0 ? void 0 : report.renderPassName).toBe('pass_1');
                    return [2 /*return*/];
            }
        });
    }); });
    it('excludes the renderPassName when it is not available', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var flowStartState, renderState, report;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    flowStartState = new states_1.Started({
                        destinationScreen: DESTINATION_SCREEN,
                        componentInstanceId: 'id',
                        timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(40).build(),
                        type: 'app_boot',
                        previousState: undefined,
                        snapshotId: Promise.resolve('1'),
                        sourceScreen: undefined,
                    });
                    renderState = new states_1.RenderAborted({
                        timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(1000).build(),
                        destinationScreen: DESTINATION_SCREEN,
                        componentInstanceId: 'id',
                        previousState: flowStartState,
                        snapshotId: Promise.resolve('2'),
                    });
                    return [4 /*yield*/, (0, RenderPassReportGenerator_1.default)(renderState)];
                case 1:
                    report = _a.sent();
                    expect(report === null || report === void 0 ? void 0 : report.renderPassName).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    it('includes the timeToAbortMillis if the render pass aborted on startup', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var flowStartState, renderState, report;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    flowStartState = new states_1.Started({
                        destinationScreen: DESTINATION_SCREEN,
                        componentInstanceId: 'id',
                        timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(40).build(),
                        type: 'app_boot',
                        previousState: undefined,
                        snapshotId: Promise.resolve('1'),
                        sourceScreen: undefined,
                    });
                    renderState = new states_1.RenderAborted({
                        timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(1000).build(),
                        destinationScreen: DESTINATION_SCREEN,
                        componentInstanceId: 'id',
                        previousState: flowStartState,
                        snapshotId: Promise.resolve('2'),
                    });
                    return [4 /*yield*/, (0, RenderPassReportGenerator_1.default)(renderState)];
                case 1:
                    report = _a.sent();
                    // The app_boot timeToAbortMillis does not include the boot times
                    expect(report === null || report === void 0 ? void 0 : report.timeToAbortMillis).toBe(1000 - 100);
                    return [2 /*return*/];
            }
        });
    }); });
    it('includes the timeToAbortMillis (including the the native-touch-event-propagation latency) if the render pass aborted when the flow is started', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var flowStartState, renderState, report;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    flowStartState = new states_1.Started({
                        sourceScreen: SOURCE_SCREEN,
                        destinationScreen: DESTINATION_SCREEN,
                        componentInstanceId: 'id',
                        timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(50).build(),
                        type: 'flow_start',
                        previousState: undefined,
                        snapshotId: Promise.resolve('1'),
                    });
                    renderState = new states_1.RenderAborted({
                        timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(1000).build(),
                        destinationScreen: DESTINATION_SCREEN,
                        componentInstanceId: 'id',
                        previousState: flowStartState,
                        snapshotId: Promise.resolve('2'),
                    });
                    return [4 /*yield*/, (0, RenderPassReportGenerator_1.default)(renderState)];
                case 1:
                    report = _a.sent();
                    // The flow_start timeToAbortMillis includes the native-touch-event-propagation latency, when available
                    expect(report === null || report === void 0 ? void 0 : report.timeToAbortMillis).toBe(1000 - 50);
                    return [2 /*return*/];
            }
        });
    }); });
    it('includes the timeToAbortMillis (excluding the the native-touch-event-propagation latency) if the render pass aborted when the flow is started', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var flowStartState, renderState, report;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    flowStartState = new states_1.Started({
                        sourceScreen: SOURCE_SCREEN,
                        destinationScreen: DESTINATION_SCREEN,
                        componentInstanceId: 'id',
                        timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().build(),
                        type: 'flow_start',
                        previousState: undefined,
                        snapshotId: Promise.resolve('1'),
                    });
                    renderState = new states_1.RenderAborted({
                        timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(1000).build(),
                        destinationScreen: DESTINATION_SCREEN,
                        componentInstanceId: 'id',
                        previousState: flowStartState,
                        snapshotId: Promise.resolve('2'),
                    });
                    return [4 /*yield*/, (0, RenderPassReportGenerator_1.default)(renderState)];
                case 1:
                    report = _a.sent();
                    // The flow_start timeToAbortMillis does not include the native-touch-event-propagation latency, when it is not available
                    expect(report === null || report === void 0 ? void 0 : report.timeToAbortMillis).toBe(1000 - 100);
                    return [2 /*return*/];
            }
        });
    }); });
    it('includes the timeToRenderMillis if the render pass completed on startup', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var flowStartState, renderState, report;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    flowStartState = new states_1.Started({
                        destinationScreen: DESTINATION_SCREEN,
                        componentInstanceId: 'id',
                        timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(40).build(),
                        previousState: undefined,
                        snapshotId: Promise.resolve('1'),
                        type: 'app_boot',
                        sourceScreen: undefined,
                    });
                    renderState = new states_1.Rendered({
                        renderPassName: 'pass1',
                        interactive: true,
                        timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(1000).build(),
                        destinationScreen: DESTINATION_SCREEN,
                        componentInstanceId: 'id',
                        previousState: flowStartState,
                        snapshotId: Promise.resolve('2'),
                    });
                    return [4 /*yield*/, (0, RenderPassReportGenerator_1.default)(renderState)];
                case 1:
                    report = _a.sent();
                    // The app_boot timeToRenderMillis does not include the boot times
                    expect(report === null || report === void 0 ? void 0 : report.timeToRenderMillis).toBe(1000 - 100);
                    return [2 /*return*/];
            }
        });
    }); });
    it('includes the timeToRenderMillis (including the native-touch-event-propagation latency) if the render pass completed when the flow is started', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var flowStartState, renderState, report;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    flowStartState = new states_1.Started({
                        sourceScreen: SOURCE_SCREEN,
                        destinationScreen: DESTINATION_SCREEN,
                        componentInstanceId: 'id',
                        timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(60).build(),
                        type: 'flow_start',
                        previousState: undefined,
                        snapshotId: Promise.resolve('1'),
                    });
                    renderState = new states_1.Rendered({
                        renderPassName: 'pass1',
                        interactive: true,
                        timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(1000).build(),
                        destinationScreen: DESTINATION_SCREEN,
                        componentInstanceId: 'id',
                        previousState: flowStartState,
                        snapshotId: Promise.resolve('2'),
                    });
                    return [4 /*yield*/, (0, RenderPassReportGenerator_1.default)(renderState)];
                case 1:
                    report = _a.sent();
                    // The flow_start timeToRenderMillis includes the native-touch-event-propagation latency, when available
                    expect(report === null || report === void 0 ? void 0 : report.timeToRenderMillis).toBe(1000 - 60);
                    return [2 /*return*/];
            }
        });
    }); });
    it('includes the timeToRenderMillis (excluding the native-touch-event-propagation latency) if the render pass completed when the flow is started', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var flowStartState, renderState, report;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    flowStartState = new states_1.Started({
                        sourceScreen: SOURCE_SCREEN,
                        destinationScreen: DESTINATION_SCREEN,
                        componentInstanceId: 'id',
                        timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().build(),
                        type: 'flow_start',
                        previousState: undefined,
                        snapshotId: Promise.resolve('1'),
                    });
                    renderState = new states_1.Rendered({
                        renderPassName: 'pass1',
                        interactive: true,
                        timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(1000).build(),
                        destinationScreen: DESTINATION_SCREEN,
                        componentInstanceId: 'id',
                        previousState: flowStartState,
                        snapshotId: Promise.resolve('2'),
                    });
                    return [4 /*yield*/, (0, RenderPassReportGenerator_1.default)(renderState)];
                case 1:
                    report = _a.sent();
                    // The flow_start timeToRenderMillis excludes the native-touch-event-propagation latency, when it is not available
                    expect(report === null || report === void 0 ? void 0 : report.timeToRenderMillis).toBe(1000 - 100);
                    return [2 /*return*/];
            }
        });
    }); });
    it('marks the render pass as interactive if the an interactive render pass completed', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var flowStartState, renderState, report;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    flowStartState = new states_1.Started({
                        sourceScreen: SOURCE_SCREEN,
                        destinationScreen: DESTINATION_SCREEN,
                        componentInstanceId: 'id',
                        timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().build(),
                        type: 'flow_start',
                        previousState: undefined,
                        snapshotId: Promise.resolve('1'),
                    });
                    renderState = new states_1.Rendered({
                        renderPassName: 'pass1',
                        interactive: true,
                        timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(1000).build(),
                        destinationScreen: DESTINATION_SCREEN,
                        componentInstanceId: 'id',
                        previousState: flowStartState,
                        snapshotId: Promise.resolve('2'),
                    });
                    return [4 /*yield*/, (0, RenderPassReportGenerator_1.default)(renderState)];
                case 1:
                    report = _a.sent();
                    expect(report === null || report === void 0 ? void 0 : report.interactive).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    it('marks the render pass as non-interactive if the a non-interactive render pass completed', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var flowStartState, renderState, report;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    flowStartState = new states_1.Started({
                        sourceScreen: SOURCE_SCREEN,
                        destinationScreen: DESTINATION_SCREEN,
                        componentInstanceId: 'id',
                        timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().build(),
                        type: 'flow_start',
                        previousState: undefined,
                        snapshotId: Promise.resolve('1'),
                    });
                    renderState = new states_1.Rendered({
                        renderPassName: 'pass1',
                        interactive: false,
                        timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(1000).build(),
                        destinationScreen: DESTINATION_SCREEN,
                        componentInstanceId: 'id',
                        previousState: flowStartState,
                        snapshotId: Promise.resolve('2'),
                    });
                    return [4 /*yield*/, (0, RenderPassReportGenerator_1.default)(renderState)];
                case 1:
                    report = _a.sent();
                    expect(report === null || report === void 0 ? void 0 : report.interactive).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    it('marks the render pass as non-interactive if the render pass aborted', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var flowStartState, renderState, report;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    flowStartState = new states_1.Started({
                        destinationScreen: DESTINATION_SCREEN,
                        componentInstanceId: 'id',
                        timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(40).build(),
                        type: 'app_boot',
                        previousState: undefined,
                        snapshotId: Promise.resolve('1'),
                        sourceScreen: undefined,
                    });
                    renderState = new states_1.RenderAborted({
                        timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(1000).build(),
                        destinationScreen: DESTINATION_SCREEN,
                        componentInstanceId: 'id',
                        previousState: flowStartState,
                        snapshotId: Promise.resolve('2'),
                    });
                    return [4 /*yield*/, (0, RenderPassReportGenerator_1.default)(renderState)];
                case 1:
                    report = _a.sent();
                    expect(report === null || report === void 0 ? void 0 : report.interactive).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    it('does not prepare a new report if there is an older render completed or aborted state with the same snapshotId', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var flowStartState, renderedSnapshotId, firstRenderState, secondRenderState, report;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    flowStartState = new states_1.Started({
                        destinationScreen: DESTINATION_SCREEN,
                        componentInstanceId: 'id',
                        timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(40).build(),
                        type: 'app_boot',
                        previousState: undefined,
                        snapshotId: Promise.resolve('1'),
                        sourceScreen: undefined,
                    });
                    renderedSnapshotId = Promise.resolve('2');
                    firstRenderState = new states_1.Rendered({
                        renderPassName: 'pass1',
                        interactive: false,
                        timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(1000).build(),
                        destinationScreen: DESTINATION_SCREEN,
                        componentInstanceId: 'id',
                        previousState: flowStartState,
                        snapshotId: renderedSnapshotId,
                    });
                    secondRenderState = new states_1.Rendered({
                        renderPassName: 'pass1',
                        interactive: false,
                        timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(1000).build(),
                        destinationScreen: DESTINATION_SCREEN,
                        componentInstanceId: 'id',
                        previousState: firstRenderState,
                        snapshotId: renderedSnapshotId,
                    });
                    return [4 /*yield*/, (0, RenderPassReportGenerator_1.default)(firstRenderState)];
                case 1:
                    report = _a.sent();
                    expect(report).toBeDefined();
                    return [4 /*yield*/, (0, RenderPassReportGenerator_1.default)(secondRenderState)];
                case 2:
                    report = _a.sent();
                    expect(report).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    it('includes the flowStartTimeSinceEpochMillis in the app startup report', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var flowStartState, renderState, report;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    flowStartState = new states_1.Started({
                        destinationScreen: DESTINATION_SCREEN,
                        componentInstanceId: 'id',
                        timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(40).build(),
                        type: 'app_boot',
                        previousState: undefined,
                        snapshotId: Promise.resolve('1'),
                        sourceScreen: undefined,
                    });
                    renderState = new states_1.Rendered({
                        renderPassName: 'pass_1',
                        interactive: true,
                        timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(1000).build(),
                        destinationScreen: DESTINATION_SCREEN,
                        componentInstanceId: 'id',
                        previousState: flowStartState,
                        snapshotId: Promise.resolve('2'),
                    });
                    return [4 /*yield*/, (0, RenderPassReportGenerator_1.default)(renderState)];
                case 1:
                    report = _a.sent();
                    // The app_boot flowStartTimeSinceEpochMillis does not include the boot time.
                    expect(report === null || report === void 0 ? void 0 : report.flowStartTimeSinceEpochMillis).toBe(100);
                    return [2 /*return*/];
            }
        });
    }); });
    it('includes the flowStartTimeSinceEpochMillis (including the native-touch-event-propagation latency) in the flow report', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var flowStartState, renderState, report;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    flowStartState = new states_1.Started({
                        sourceScreen: SOURCE_SCREEN,
                        destinationScreen: DESTINATION_SCREEN,
                        componentInstanceId: 'id',
                        timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(40).build(),
                        type: 'flow_start',
                        previousState: undefined,
                        snapshotId: Promise.resolve('1'),
                    });
                    renderState = new states_1.Rendered({
                        renderPassName: 'pass_1',
                        interactive: true,
                        timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(1000).build(),
                        destinationScreen: DESTINATION_SCREEN,
                        componentInstanceId: 'id',
                        previousState: flowStartState,
                        snapshotId: Promise.resolve('2'),
                    });
                    return [4 /*yield*/, (0, RenderPassReportGenerator_1.default)(renderState)];
                case 1:
                    report = _a.sent();
                    // The flow_start flowStartTimeSinceEpochMillis includes the native-touch-event-propagation latency, when available.
                    expect(report === null || report === void 0 ? void 0 : report.flowStartTimeSinceEpochMillis).toBe(40);
                    return [2 /*return*/];
            }
        });
    }); });
    it('includes the flowStartTimeSinceEpochMillis (excluding the native-touch-event-propagation latency) in the flow report', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var flowStartState, renderState, report;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    flowStartState = new states_1.Started({
                        sourceScreen: SOURCE_SCREEN,
                        destinationScreen: DESTINATION_SCREEN,
                        componentInstanceId: 'id',
                        timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().build(),
                        type: 'flow_start',
                        previousState: undefined,
                        snapshotId: Promise.resolve('1'),
                    });
                    renderState = new states_1.Rendered({
                        renderPassName: 'pass_1',
                        interactive: true,
                        timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(1000).build(),
                        destinationScreen: DESTINATION_SCREEN,
                        componentInstanceId: 'id',
                        previousState: flowStartState,
                        snapshotId: Promise.resolve('2'),
                    });
                    return [4 /*yield*/, (0, RenderPassReportGenerator_1.default)(renderState)];
                case 1:
                    report = _a.sent();
                    // The flow_start flowStartTimeSinceEpochMillis excludes the native-touch-event-propagation latency, when unavailable.
                    expect(report === null || report === void 0 ? void 0 : report.flowStartTimeSinceEpochMillis).toBe(100);
                    return [2 /*return*/];
            }
        });
    }); });
    it('prepares a new report if there are multiple Rendered states with the same renderPassName but different snapshotIds', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var flowStartState, firstRenderState, secondRenderState, report;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    flowStartState = new states_1.Started({
                        destinationScreen: DESTINATION_SCREEN,
                        componentInstanceId: 'id',
                        timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(40).build(),
                        type: 'flow_start',
                        previousState: undefined,
                        snapshotId: Promise.resolve('1'),
                        sourceScreen: undefined,
                    });
                    firstRenderState = new states_1.Rendered({
                        renderPassName: 'pass1',
                        interactive: false,
                        timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(1000).build(),
                        destinationScreen: DESTINATION_SCREEN,
                        componentInstanceId: 'id',
                        previousState: flowStartState,
                        snapshotId: Promise.resolve('2'),
                    });
                    secondRenderState = new states_1.Rendered({
                        renderPassName: 'pass1',
                        interactive: false,
                        timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(2000).build(),
                        destinationScreen: DESTINATION_SCREEN,
                        componentInstanceId: 'id',
                        previousState: firstRenderState,
                        snapshotId: Promise.resolve('3'),
                    });
                    return [4 /*yield*/, (0, RenderPassReportGenerator_1.default)(secondRenderState)];
                case 1:
                    report = _a.sent();
                    expect(report).toBeDefined();
                    expect(report === null || report === void 0 ? void 0 : report.renderPassName).toBe('pass1');
                    expect(report === null || report === void 0 ? void 0 : report.timeToRenderMillis).toBe(2000 - 40);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=RenderPassReportGenerator.test.js.map