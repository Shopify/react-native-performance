export declare class BridgedEventTimestampBuilder {
    private _nativeTimestamp;
    private _systemBootReference;
    nativeTimestamp(nativeTimestamp: Promise<number> | number | undefined): this;
    systemBootReference(): this;
    epochReference(): this;
    build(): BridgedEventTimestamp;
}
export default class BridgedEventTimestamp {
    /**
     * The time it took for the native event to be consumed on the JS side.
     */
    get jsNativeLatency(): Promise<number> | undefined;
    /**
     * The timestamp (in millis since epoch) when the event had occurred.
     */
    readonly nativeTimestamp: Promise<number> | undefined;
    /**
     * The timestamp (in millis since epoch) when the event had been handled on the JS side.
     */
    readonly jsTimestamp: number;
    constructor(jsTimestamp: number, nativeTimestamp: Promise<number> | undefined);
    toString(): string;
}
//# sourceMappingURL=BridgedEventTimestamp.d.ts.map