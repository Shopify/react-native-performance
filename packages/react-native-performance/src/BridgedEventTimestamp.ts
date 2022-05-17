import {getNativeTime} from './utils';

export class BridgedEventTimestampBuilder {
  private _nativeTimestamp: Promise<number> | undefined;
  private _systemBootReference = false;

  nativeTimestamp(nativeTimestamp: Promise<number> | number | undefined) {
    if (nativeTimestamp === undefined) {
      this._nativeTimestamp = undefined;
    } else if (typeof nativeTimestamp === 'number') {
      this._nativeTimestamp = Promise.resolve(nativeTimestamp);
    } else {
      this._nativeTimestamp = nativeTimestamp;
    }
    return this;
  }

  systemBootReference() {
    this._systemBootReference = true;
    return this;
  }

  epochReference() {
    this._systemBootReference = false;
    return this;
  }

  build() {
    if (this._nativeTimestamp === undefined) {
      return new BridgedEventTimestamp(Date.now(), undefined);
    }

    if (!this._systemBootReference) {
      return new BridgedEventTimestamp(Date.now(), this._nativeTimestamp);
    }

    const {jsNowWithEpochReference, nativeTimestampWithEpochReference} = translateNativeTimestampToEpochReference(
      this._nativeTimestamp,
    );
    return new BridgedEventTimestamp(jsNowWithEpochReference, nativeTimestampWithEpochReference);
  }
}

export default class BridgedEventTimestamp {
  /**
   * The time it took for the native event to be consumed on the JS side.
   */
  get jsNativeLatency(): Promise<number> | undefined {
    return this.nativeTimestamp && this.nativeTimestamp.then(timestamp => this.jsTimestamp - timestamp);
  }

  /**
   * The timestamp (in millis since epoch) when the event had occurred.
   */
  readonly nativeTimestamp: Promise<number> | undefined;

  /**
   * The timestamp (in millis since epoch) when the event had been handled on the JS side.
   */
  readonly jsTimestamp: number;

  constructor(jsTimestamp: number, nativeTimestamp: Promise<number> | undefined) {
    this.jsTimestamp = jsTimestamp;
    this.nativeTimestamp = nativeTimestamp;
  }

  toString() {
    return (
      `{` +
      `jsTimestamp: ${this.jsTimestamp}, ` +
      `nativeTimestamp: ${this.nativeTimestamp === undefined ? 'undefined' : 'Promise<number>'}, ` +
      `jsNativeLatency: ${this.jsNativeLatency === undefined ? 'undefined' : 'Promise<number>'}` +
      `}`
    );
  }
}

/**
 * Native timestamp we receive for example from a touch event is referencing system boot time.
 * We need to work with time referencing epoch (UNIX) time - this function will translate the timestamp between the two.
 * @param nativeTimestampWithSystemBootReference: Timestamp received from native context from react-native referencing system boot time.
 * @returns Timestamp referencing system boot time.
 */
function translateNativeTimestampToEpochReference(nativeTimestampWithSystemBootReference: Promise<number>) {
  const jsNowWithEpochReference = Date.now();

  const nativeTimestampWithEpochReference = Promise.all([getNativeTime(), nativeTimestampWithSystemBootReference]).then(
    ([
      {nativeTimeSinceEpochMillis: nativeNowWithEpochReference, nativeUptimeMillis: nativeNowWithSystemBootReference},
      nativeTimestampWithSystemBootReference,
    ]) => {
      // If the JS <-> native communication were instantaneous, the nativeTimeSinceEpochMillis === jsNowWithEpochReference.
      // nativeCallLatency captures the deviation from this ideal.
      const bridgeLatency = nativeNowWithEpochReference - jsNowWithEpochReference;
      // The same latency would also be applicable to the system uptime values.
      // So we can reverse calculate what the "JS now" would have been in the system boot time reference system.
      const jsNowWithSystemBootReference = nativeNowWithSystemBootReference - bridgeLatency;
      /**
       * Both `jsNowWithSystemBootReference` and `nativeTimestampSystemBootReference` use the same reference time: system boot.
       * The difference between these two will give the millisecond difference between "now" and the requested timestamp.
       * Since it's a time-delta, it will also be applicable to the other reference system: epoch.
       */
      const millisElapsed = jsNowWithSystemBootReference - nativeTimestampWithSystemBootReference;
      /**
       * If millisElapsed is negative, we assume that `nativeTimestampWithSystemBootReference` is actually not referencing system boot time but epoch time.
       * This change was introduced in the following commit and released with react-native version 0.65.0:
       * https://github.com/facebook/react-native/commit/b08362ade5d68af4b6c66d5cf0dab5f42a2ec894#diff-c9c6bbe068431d9e508c435dba38a9cc4fd488bec4377d4d817f34afdfa89bb2R170
       * However, this was later reverted:
       * https://github.com/facebook/react-native/commit/10fe09c4567a47b62560c914bf6c8716e28355fd#diff-c9c6bbe068431d9e508c435dba38a9cc4fd488bec4377d4d817f34afdfa89bb2L170
       * We should delete this in the future when usage of react-native 0.65.0 drops down and then we can again assume
       * that the native timestamp given is referring to system boot time.
       */
      if (millisElapsed < 0) {
        return nativeTimestampWithSystemBootReference;
      } else {
        return jsNowWithEpochReference - millisElapsed;
      }
    },
  );

  return {
    jsNowWithEpochReference,
    nativeTimestampWithEpochReference,
  };
}
