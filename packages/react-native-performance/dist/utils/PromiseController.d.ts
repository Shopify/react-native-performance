export default class PromiseController<T> {
    readonly promise: Promise<T>;
    private _hasCompleted;
    private _result;
    private _rejectionReason;
    private innerResolve;
    private innerReject;
    constructor();
    resolve(result: T): void;
    reject(rejectionReason: Error): void;
    get result(): T | undefined;
    get rejectionReason(): Error | undefined;
    get hasCompleted(): boolean;
}
//# sourceMappingURL=PromiseController.d.ts.map