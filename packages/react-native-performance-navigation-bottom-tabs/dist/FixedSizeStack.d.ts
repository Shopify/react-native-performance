export default class FixedSizeStack<T> {
    private readonly maxSize;
    private readonly stack;
    constructor(maxSize: number);
    push(item: T): void;
    pop(): T | undefined;
}
//# sourceMappingURL=FixedSizeStack.d.ts.map