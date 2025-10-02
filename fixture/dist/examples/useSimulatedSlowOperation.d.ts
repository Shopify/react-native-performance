export default function useSimulatedSlowOperation<T>({ delaySeconds, result, }: {
    delaySeconds: number;
    result: T;
}): () => Promise<T>;
//# sourceMappingURL=useSimulatedSlowOperation.d.ts.map