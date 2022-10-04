import renderPassReportGenerator from '../RenderPassReportGenerator';
import {Started, Rendered, RenderAborted} from '../state-machine/states';
import {BridgedEventTimestampBuilder} from '../BridgedEventTimestamp';

const SOURCE_SCREEN = 'source';
const DESTINATION_SCREEN = 'dest';

describe('RenderPassReportGenerator', () => {
  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValueOnce(100);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('includes the sourceScreen if the flowStartState contains it', async () => {
    const flowStartState = new Started({
      sourceScreen: SOURCE_SCREEN,
      destinationScreen: DESTINATION_SCREEN,
      componentInstanceId: 'id',
      timestamp: new BridgedEventTimestampBuilder().build(),
      previousState: undefined,
      snapshotId: Promise.resolve('1'),
      type: 'flow_start',
    });

    const renderState = new Rendered({
      renderPassName: 'pass_1',
      interactive: true,
      timestamp: new BridgedEventTimestampBuilder().nativeTimestamp(1000).build(),
      destinationScreen: DESTINATION_SCREEN,
      componentInstanceId: 'id',
      previousState: flowStartState,
      snapshotId: Promise.resolve('2'),
    });

    const report = await renderPassReportGenerator(renderState);
    expect(report?.sourceScreen).toBe(SOURCE_SCREEN);
  });

  it('includes the destinationScreen', async () => {
    const flowStartState = new Started({
      sourceScreen: SOURCE_SCREEN,
      destinationScreen: DESTINATION_SCREEN,
      componentInstanceId: 'id',
      timestamp: new BridgedEventTimestampBuilder().build(),
      previousState: undefined,
      snapshotId: Promise.resolve('1'),
      type: 'flow_start',
    });

    const renderState = new Rendered({
      renderPassName: 'pass_1',
      interactive: true,
      timestamp: new BridgedEventTimestampBuilder().nativeTimestamp(1000).build(),
      destinationScreen: DESTINATION_SCREEN,
      componentInstanceId: 'id',
      previousState: flowStartState,
      snapshotId: Promise.resolve('2'),
    });

    const report = await renderPassReportGenerator(renderState);
    expect(report?.destinationScreen).toBe(DESTINATION_SCREEN);
  });

  it("includes the timeToConsumeTouchEventMillis if the flow start state was of type 'flow_start'", async () => {
    const flowStartState = new Started({
      sourceScreen: SOURCE_SCREEN,
      destinationScreen: DESTINATION_SCREEN,
      componentInstanceId: 'id',
      timestamp: new BridgedEventTimestampBuilder().nativeTimestamp(40).build(),
      type: 'flow_start',
      previousState: undefined,
      snapshotId: Promise.resolve('1'),
    });

    const renderState = new Rendered({
      renderPassName: 'pass_1',
      interactive: true,
      timestamp: new BridgedEventTimestampBuilder().nativeTimestamp(1000).build(),
      destinationScreen: DESTINATION_SCREEN,
      componentInstanceId: 'id',
      previousState: flowStartState,
      snapshotId: Promise.resolve('2'),
    });

    const report = await renderPassReportGenerator(renderState);
    expect(report?.timeToConsumeTouchEventMillis).toBe(60);
  });

  it("includes the timeToBootJsMillis if the flow start state was of type 'app_boot'", async () => {
    const flowStartState = new Started({
      destinationScreen: DESTINATION_SCREEN,
      componentInstanceId: 'id',
      timestamp: new BridgedEventTimestampBuilder().nativeTimestamp(40).build(),
      previousState: undefined,
      snapshotId: Promise.resolve('1'),
      type: 'app_boot',
      sourceScreen: undefined,
    });

    const renderState = new Rendered({
      renderPassName: 'pass_1',
      interactive: true,
      timestamp: new BridgedEventTimestampBuilder().nativeTimestamp(1000).build(),
      destinationScreen: DESTINATION_SCREEN,
      componentInstanceId: 'id',
      previousState: flowStartState,
      snapshotId: Promise.resolve('2'),
    });

    const report = await renderPassReportGenerator(renderState);
    expect(report?.timeToBootJsMillis).toBe(60);
  });

  it('includes the renderPassName when it is available', async () => {
    const flowStartState = new Started({
      destinationScreen: DESTINATION_SCREEN,
      componentInstanceId: 'id',
      timestamp: new BridgedEventTimestampBuilder().nativeTimestamp(40).build(),
      previousState: undefined,
      snapshotId: Promise.resolve('1'),
      type: 'app_boot',
      sourceScreen: undefined,
    });

    const renderState = new Rendered({
      renderPassName: 'pass_1',
      interactive: true,
      timestamp: new BridgedEventTimestampBuilder().nativeTimestamp(1000).build(),
      destinationScreen: DESTINATION_SCREEN,
      componentInstanceId: 'id',
      previousState: flowStartState,
      snapshotId: Promise.resolve('2'),
    });

    const report = await renderPassReportGenerator(renderState);
    expect(report?.renderPassName).toBe('pass_1');
  });

  it('excludes the renderPassName when it is not available', async () => {
    const flowStartState = new Started({
      destinationScreen: DESTINATION_SCREEN,
      componentInstanceId: 'id',
      timestamp: new BridgedEventTimestampBuilder().nativeTimestamp(40).build(),
      type: 'app_boot',
      previousState: undefined,
      snapshotId: Promise.resolve('1'),
      sourceScreen: undefined,
    });

    const renderState = new RenderAborted({
      timestamp: new BridgedEventTimestampBuilder().nativeTimestamp(1000).build(),
      destinationScreen: DESTINATION_SCREEN,
      componentInstanceId: 'id',
      previousState: flowStartState,
      snapshotId: Promise.resolve('2'),
    });

    const report = await renderPassReportGenerator(renderState);
    expect(report?.renderPassName).toBeUndefined();
  });

  it('includes the timeToAbortMillis if the render pass aborted on startup', async () => {
    const flowStartState = new Started({
      destinationScreen: DESTINATION_SCREEN,
      componentInstanceId: 'id',
      timestamp: new BridgedEventTimestampBuilder().nativeTimestamp(40).build(),
      type: 'app_boot',
      previousState: undefined,
      snapshotId: Promise.resolve('1'),
      sourceScreen: undefined,
    });

    const renderState = new RenderAborted({
      timestamp: new BridgedEventTimestampBuilder().nativeTimestamp(1000).build(),
      destinationScreen: DESTINATION_SCREEN,
      componentInstanceId: 'id',
      previousState: flowStartState,
      snapshotId: Promise.resolve('2'),
    });

    const report = await renderPassReportGenerator(renderState);
    // The app_boot timeToAbortMillis does not include the boot times
    expect(report?.timeToAbortMillis).toBe(1000 - 100);
  });

  it('includes the timeToAbortMillis (including the the native-touch-event-propagation latency) if the render pass aborted when the flow is started', async () => {
    const flowStartState = new Started({
      sourceScreen: SOURCE_SCREEN,
      destinationScreen: DESTINATION_SCREEN,
      componentInstanceId: 'id',
      timestamp: new BridgedEventTimestampBuilder().nativeTimestamp(50).build(),
      type: 'flow_start',
      previousState: undefined,
      snapshotId: Promise.resolve('1'),
    });

    const renderState = new RenderAborted({
      timestamp: new BridgedEventTimestampBuilder().nativeTimestamp(1000).build(),
      destinationScreen: DESTINATION_SCREEN,
      componentInstanceId: 'id',
      previousState: flowStartState,
      snapshotId: Promise.resolve('2'),
    });

    const report = await renderPassReportGenerator(renderState);
    // The flow_start timeToAbortMillis includes the native-touch-event-propagation latency, when available
    expect(report?.timeToAbortMillis).toBe(1000 - 50);
  });

  it('includes the timeToAbortMillis (excluding the the native-touch-event-propagation latency) if the render pass aborted when the flow is started', async () => {
    const flowStartState = new Started({
      sourceScreen: SOURCE_SCREEN,
      destinationScreen: DESTINATION_SCREEN,
      componentInstanceId: 'id',
      timestamp: new BridgedEventTimestampBuilder().build(),
      type: 'flow_start',
      previousState: undefined,
      snapshotId: Promise.resolve('1'),
    });

    const renderState = new RenderAborted({
      timestamp: new BridgedEventTimestampBuilder().nativeTimestamp(1000).build(),
      destinationScreen: DESTINATION_SCREEN,
      componentInstanceId: 'id',
      previousState: flowStartState,
      snapshotId: Promise.resolve('2'),
    });

    const report = await renderPassReportGenerator(renderState);
    // The flow_start timeToAbortMillis does not include the native-touch-event-propagation latency, when it is not available
    expect(report?.timeToAbortMillis).toBe(1000 - 100);
  });

  it('includes the timeToRenderMillis if the render pass completed on startup', async () => {
    const flowStartState = new Started({
      destinationScreen: DESTINATION_SCREEN,
      componentInstanceId: 'id',
      timestamp: new BridgedEventTimestampBuilder().nativeTimestamp(40).build(),
      previousState: undefined,
      snapshotId: Promise.resolve('1'),
      type: 'app_boot',
      sourceScreen: undefined,
    });

    const renderState = new Rendered({
      renderPassName: 'pass1',
      interactive: true,
      timestamp: new BridgedEventTimestampBuilder().nativeTimestamp(1000).build(),
      destinationScreen: DESTINATION_SCREEN,
      componentInstanceId: 'id',
      previousState: flowStartState,
      snapshotId: Promise.resolve('2'),
    });

    const report = await renderPassReportGenerator(renderState);
    // The app_boot timeToRenderMillis does not include the boot times
    expect(report?.timeToRenderMillis).toBe(1000 - 100);
  });

  it('includes the timeToRenderMillis (including the native-touch-event-propagation latency) if the render pass completed when the flow is started', async () => {
    const flowStartState = new Started({
      sourceScreen: SOURCE_SCREEN,
      destinationScreen: DESTINATION_SCREEN,
      componentInstanceId: 'id',
      timestamp: new BridgedEventTimestampBuilder().nativeTimestamp(60).build(),
      type: 'flow_start',
      previousState: undefined,
      snapshotId: Promise.resolve('1'),
    });

    const renderState = new Rendered({
      renderPassName: 'pass1',
      interactive: true,
      timestamp: new BridgedEventTimestampBuilder().nativeTimestamp(1000).build(),
      destinationScreen: DESTINATION_SCREEN,
      componentInstanceId: 'id',
      previousState: flowStartState,
      snapshotId: Promise.resolve('2'),
    });

    const report = await renderPassReportGenerator(renderState);
    // The flow_start timeToRenderMillis includes the native-touch-event-propagation latency, when available
    expect(report?.timeToRenderMillis).toBe(1000 - 60);
  });

  it('includes the timeToRenderMillis (excluding the native-touch-event-propagation latency) if the render pass completed when the flow is started', async () => {
    const flowStartState = new Started({
      sourceScreen: SOURCE_SCREEN,
      destinationScreen: DESTINATION_SCREEN,
      componentInstanceId: 'id',
      timestamp: new BridgedEventTimestampBuilder().build(),
      type: 'flow_start',
      previousState: undefined,
      snapshotId: Promise.resolve('1'),
    });

    const renderState = new Rendered({
      renderPassName: 'pass1',
      interactive: true,
      timestamp: new BridgedEventTimestampBuilder().nativeTimestamp(1000).build(),
      destinationScreen: DESTINATION_SCREEN,
      componentInstanceId: 'id',
      previousState: flowStartState,
      snapshotId: Promise.resolve('2'),
    });

    const report = await renderPassReportGenerator(renderState);
    // The flow_start timeToRenderMillis excludes the native-touch-event-propagation latency, when it is not available
    expect(report?.timeToRenderMillis).toBe(1000 - 100);
  });

  it('marks the render pass as interactive if the an interactive render pass completed', async () => {
    const flowStartState = new Started({
      sourceScreen: SOURCE_SCREEN,
      destinationScreen: DESTINATION_SCREEN,
      componentInstanceId: 'id',
      timestamp: new BridgedEventTimestampBuilder().build(),
      type: 'flow_start',
      previousState: undefined,
      snapshotId: Promise.resolve('1'),
    });

    const renderState = new Rendered({
      renderPassName: 'pass1',
      interactive: true,
      timestamp: new BridgedEventTimestampBuilder().nativeTimestamp(1000).build(),
      destinationScreen: DESTINATION_SCREEN,
      componentInstanceId: 'id',
      previousState: flowStartState,
      snapshotId: Promise.resolve('2'),
    });

    const report = await renderPassReportGenerator(renderState);
    expect(report?.interactive).toBe(true);
  });

  it('marks the render pass as non-interactive if the a non-interactive render pass completed', async () => {
    const flowStartState = new Started({
      sourceScreen: SOURCE_SCREEN,
      destinationScreen: DESTINATION_SCREEN,
      componentInstanceId: 'id',
      timestamp: new BridgedEventTimestampBuilder().build(),
      type: 'flow_start',
      previousState: undefined,
      snapshotId: Promise.resolve('1'),
    });

    const renderState = new Rendered({
      renderPassName: 'pass1',
      interactive: false,
      timestamp: new BridgedEventTimestampBuilder().nativeTimestamp(1000).build(),
      destinationScreen: DESTINATION_SCREEN,
      componentInstanceId: 'id',
      previousState: flowStartState,
      snapshotId: Promise.resolve('2'),
    });

    const report = await renderPassReportGenerator(renderState);
    expect(report?.interactive).toBe(false);
  });

  it('marks the render pass as non-interactive if the render pass aborted', async () => {
    const flowStartState = new Started({
      destinationScreen: DESTINATION_SCREEN,
      componentInstanceId: 'id',
      timestamp: new BridgedEventTimestampBuilder().nativeTimestamp(40).build(),
      type: 'app_boot',
      previousState: undefined,
      snapshotId: Promise.resolve('1'),
      sourceScreen: undefined,
    });

    const renderState = new RenderAborted({
      timestamp: new BridgedEventTimestampBuilder().nativeTimestamp(1000).build(),
      destinationScreen: DESTINATION_SCREEN,
      componentInstanceId: 'id',
      previousState: flowStartState,
      snapshotId: Promise.resolve('2'),
    });

    const report = await renderPassReportGenerator(renderState);
    expect(report?.interactive).toBe(false);
  });

  it('does not prepare a new report if there is an older render completed or aborted state with the same snapshotId', async () => {
    const flowStartState = new Started({
      destinationScreen: DESTINATION_SCREEN,
      componentInstanceId: 'id',
      timestamp: new BridgedEventTimestampBuilder().nativeTimestamp(40).build(),
      type: 'app_boot',
      previousState: undefined,
      snapshotId: Promise.resolve('1'),
      sourceScreen: undefined,
    });

    const renderedSnapshotId = Promise.resolve('2');

    const firstRenderState = new Rendered({
      renderPassName: 'pass1',
      interactive: false,
      timestamp: new BridgedEventTimestampBuilder().nativeTimestamp(1000).build(),
      destinationScreen: DESTINATION_SCREEN,
      componentInstanceId: 'id',
      previousState: flowStartState,
      snapshotId: renderedSnapshotId,
    });

    const secondRenderState = new Rendered({
      renderPassName: 'pass1',
      interactive: false,
      timestamp: new BridgedEventTimestampBuilder().nativeTimestamp(1000).build(),
      destinationScreen: DESTINATION_SCREEN,
      componentInstanceId: 'id',
      previousState: firstRenderState,
      snapshotId: renderedSnapshotId,
    });

    let report = await renderPassReportGenerator(firstRenderState);
    expect(report).toBeDefined();
    report = await renderPassReportGenerator(secondRenderState);
    expect(report).toBeNull();
  });

  it('includes the flowStartTimeSinceEpochMillis in the app startup report', async () => {
    const flowStartState = new Started({
      destinationScreen: DESTINATION_SCREEN,
      componentInstanceId: 'id',
      timestamp: new BridgedEventTimestampBuilder().nativeTimestamp(40).build(),
      type: 'app_boot',
      previousState: undefined,
      snapshotId: Promise.resolve('1'),
      sourceScreen: undefined,
    });

    const renderState = new Rendered({
      renderPassName: 'pass_1',
      interactive: true,
      timestamp: new BridgedEventTimestampBuilder().nativeTimestamp(1000).build(),
      destinationScreen: DESTINATION_SCREEN,
      componentInstanceId: 'id',
      previousState: flowStartState,
      snapshotId: Promise.resolve('2'),
    });

    const report = await renderPassReportGenerator(renderState);
    // The app_boot flowStartTimeSinceEpochMillis does not include the boot time.
    expect(report?.flowStartTimeSinceEpochMillis).toBe(100);
  });

  it('includes the flowStartTimeSinceEpochMillis (including the native-touch-event-propagation latency) in the flow report', async () => {
    const flowStartState = new Started({
      sourceScreen: SOURCE_SCREEN,
      destinationScreen: DESTINATION_SCREEN,
      componentInstanceId: 'id',
      timestamp: new BridgedEventTimestampBuilder().nativeTimestamp(40).build(),
      type: 'flow_start',
      previousState: undefined,
      snapshotId: Promise.resolve('1'),
    });

    const renderState = new Rendered({
      renderPassName: 'pass_1',
      interactive: true,
      timestamp: new BridgedEventTimestampBuilder().nativeTimestamp(1000).build(),
      destinationScreen: DESTINATION_SCREEN,
      componentInstanceId: 'id',
      previousState: flowStartState,
      snapshotId: Promise.resolve('2'),
    });

    const report = await renderPassReportGenerator(renderState);
    // The flow_start flowStartTimeSinceEpochMillis includes the native-touch-event-propagation latency, when available.
    expect(report?.flowStartTimeSinceEpochMillis).toBe(40);
  });

  it('includes the flowStartTimeSinceEpochMillis (excluding the native-touch-event-propagation latency) in the flow report', async () => {
    const flowStartState = new Started({
      sourceScreen: SOURCE_SCREEN,
      destinationScreen: DESTINATION_SCREEN,
      componentInstanceId: 'id',
      timestamp: new BridgedEventTimestampBuilder().build(),
      type: 'flow_start',
      previousState: undefined,
      snapshotId: Promise.resolve('1'),
    });

    const renderState = new Rendered({
      renderPassName: 'pass_1',
      interactive: true,
      timestamp: new BridgedEventTimestampBuilder().nativeTimestamp(1000).build(),
      destinationScreen: DESTINATION_SCREEN,
      componentInstanceId: 'id',
      previousState: flowStartState,
      snapshotId: Promise.resolve('2'),
    });

    const report = await renderPassReportGenerator(renderState);
    // The flow_start flowStartTimeSinceEpochMillis excludes the native-touch-event-propagation latency, when unavailable.
    expect(report?.flowStartTimeSinceEpochMillis).toBe(100);
  });

  it('prepares a new report if there are multiple Rendered states with the same renderPassName but different snapshotIds', async () => {
    const flowStartState = new Started({
      destinationScreen: DESTINATION_SCREEN,
      componentInstanceId: 'id',
      timestamp: new BridgedEventTimestampBuilder().nativeTimestamp(40).build(),
      type: 'flow_start',
      previousState: undefined,
      snapshotId: Promise.resolve('1'),
      sourceScreen: undefined,
    });

    const firstRenderState = new Rendered({
      renderPassName: 'pass1',
      interactive: false,
      timestamp: new BridgedEventTimestampBuilder().nativeTimestamp(1000).build(),
      destinationScreen: DESTINATION_SCREEN,
      componentInstanceId: 'id',
      previousState: flowStartState,
      snapshotId: Promise.resolve('2'),
    });

    const secondRenderState = new Rendered({
      renderPassName: 'pass1',
      interactive: false,
      timestamp: new BridgedEventTimestampBuilder().nativeTimestamp(2000).build(),
      destinationScreen: DESTINATION_SCREEN,
      componentInstanceId: 'id',
      previousState: firstRenderState,
      snapshotId: Promise.resolve('3'),
    });

    const report = await renderPassReportGenerator(secondRenderState);
    expect(report).toBeDefined();
    expect(report?.renderPassName).toBe('pass1');
    expect(report?.timeToRenderMillis).toBe(2000 - 40);
  });
});
