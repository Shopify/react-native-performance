/* eslint-disable @typescript-eslint/ban-ts-comment */
import {BridgedEventTimestampBuilder} from '../BridgedEventTimestamp';
import {getNativeTime} from '../utils';

jest.mock('../utils', () => {
  return {
    getNativeTime: jest.fn(),
  };
});

describe('BridgedEventTimestamp', () => {
  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(1000);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('just records the JS event timestamp when no native timestamp is provided', () => {
    const timestamp = new BridgedEventTimestampBuilder().build();
    expect(timestamp.jsTimestamp).toBe(1000);
    expect(timestamp.nativeTimestamp).toBeUndefined();
  });

  it('records the native timestamp with epoch reference when one is provided as a number', async () => {
    const timestamp = new BridgedEventTimestampBuilder().nativeTimestamp(2000).epochReference().build();
    expect(timestamp.jsTimestamp).toBe(1000);
    expect(await timestamp.nativeTimestamp).toBe(2000);
  });

  it('records the native timestamp with epoch reference when one is provided as a promise', async () => {
    const timestamp = new BridgedEventTimestampBuilder()
      .nativeTimestamp(Promise.resolve(1500))
      .epochReference()
      .build();
    expect(timestamp.jsTimestamp).toBe(1000);
    expect(await timestamp.nativeTimestamp).toBe(1500);
  });

  it("clears the native timestamp when 'undefined' is provided", async () => {
    const timestamp = new BridgedEventTimestampBuilder()
      .nativeTimestamp(1000)
      .nativeTimestamp(undefined)
      .epochReference()
      .build();
    expect(timestamp.jsTimestamp).toBe(1000);
    expect(await timestamp.nativeTimestamp).toBeUndefined();
  });

  it('skips translation when native time is given in epoch', async () => {
    // @ts-ignore
    getNativeTime.mockReturnValueOnce(
      Promise.resolve({
        nativeTimeSinceEpochMillis: 1150,
        nativeUptimeMillis: 500,
      }),
    );

    const timestamp = new BridgedEventTimestampBuilder().nativeTimestamp(900).systemBootReference().build();
    expect(await timestamp.nativeTimestamp).toBe(900);
  });

  it('translates the native timestamp to epoch reference when one is provided in the system boot reference', async () => {
    // @ts-ignore
    getNativeTime.mockReturnValueOnce(
      Promise.resolve({
        // i.e., 150 ms latency over the bridge
        nativeTimeSinceEpochMillis: 1150,
        // i.e., system had been up for 5000ms when the timestamp was 1150 in the native layer
        nativeUptimeMillis: 500,
      }),
    );

    const timestamp = new BridgedEventTimestampBuilder().nativeTimestamp(100).systemBootReference().build();

    /**
     * Reversing the 150 ms latency, the system had been up for (500 - 150) = 350ms when the JS call was made.
     *
     * Requested boot-reference timestamp that needs to be translated: 100.
     *
     * So 350-100 = 250ms had passed b/w the input timestamp and "now".
     * So the translated epoch-reference timestamp must have happened 250ms in the past = 1000 - 250 = 750
     */

    expect(await timestamp.nativeTimestamp).toBe(750);
  });

  it('returns undefined jsNativeLatency if no native timestamp is available', () => {
    expect(new BridgedEventTimestampBuilder().build().jsNativeLatency).toBeUndefined();
  });

  it('calculates the jsNativeLatency if epoch-reference native timestamp is available', async () => {
    expect(await new BridgedEventTimestampBuilder().nativeTimestamp(100).build().jsNativeLatency).toBe(900);
  });

  it('calculates the jsNativeLatency if boot-reference native timestamp is available', async () => {
    // @ts-ignore
    getNativeTime.mockReturnValueOnce(
      Promise.resolve({
        // i.e., 150 ms latency over the bridge
        nativeTimeSinceEpochMillis: 1150,
        // i.e., system had been up for 5000ms when the timestamp was 1150 in the native layer
        nativeUptimeMillis: 500,
      }),
    );

    // translated epoch-reference timestamp = 750
    // jsNativeLatency = 1000 - 750 = 250
    expect(
      await new BridgedEventTimestampBuilder().nativeTimestamp(100).systemBootReference().build().jsNativeLatency,
    ).toBe(250);
  });
});
