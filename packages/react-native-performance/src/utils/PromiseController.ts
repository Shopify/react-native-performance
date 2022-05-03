export default class PromiseController<T> {
  readonly promise: Promise<T>;

  private _hasCompleted: boolean;
  private _result: T | undefined;
  private _rejectionReason: Error | undefined;
  private innerResolve: (result: T) => void;
  private innerReject: (rejectionReason: Error) => void;

  constructor() {
    this._hasCompleted = false;
    this.promise = new Promise<T>((resolve, reject) => {
      this.innerResolve = resolve;
      this.innerReject = reject;
    });
  }

  resolve(result: T) {
    this._hasCompleted = true;
    this._result = result;
    this.innerResolve(result);
  }

  reject(rejectionReason: Error) {
    this._hasCompleted = true;
    this._rejectionReason = rejectionReason;
    this.innerReject(rejectionReason);
  }

  get result(): T | undefined {
    return this._result;
  }

  get rejectionReason(): Error | undefined {
    return this._rejectionReason;
  }

  get hasCompleted(): boolean {
    return this._hasCompleted;
  }
}
