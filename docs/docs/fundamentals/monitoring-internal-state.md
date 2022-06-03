---
id: monitoring-internal-state
title: Monitoring Internal State
slug: /fundamentals/monitoring-internal-state
---

The library internally keeps track of all the profiled screens via a [state machine](#State-Machine). Although you shouldn't need to do this in production, it might be useful to get a dump of these state machine transitions for debugging purposes at development time. You can do so via:

```tsx
const StateLogger = () => {
  const state = useProfilerState({
    // optional. Defaults to every profiled screen
    destinationScreen: new RegExp('^Home.*$'),
  });
  useEffect(() => {
    console.log('State:', JSON.stringify(state));
  }, [state]);
};
```

Note that `useProfilerState` hook — just like all other profiler TypeScript APIs — must be rendered as a child of the `PerformanceProfiler` component.
