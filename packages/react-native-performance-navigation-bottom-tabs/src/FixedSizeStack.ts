export default class FixedSizeStack<T> {
  private readonly maxSize: number;
  private readonly stack = new Array<T>();

  constructor(maxSize: number) {
    this.maxSize = maxSize;
    if (maxSize <= 0) {
      throw new Error(`maxSize must be > 0: ${maxSize}.`);
    }
  }

  push(item: T): void {
    const deleteCount = this.stack.length - this.maxSize + 1;
    if (deleteCount > 0) {
      this.stack.splice(0, deleteCount);
    }
    this.stack.push(item);
  }

  pop(): T | undefined {
    return this.stack.pop();
  }
}
