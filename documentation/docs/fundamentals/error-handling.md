---
id: error-handling
title: Error Handling
slug: /fundamentals/error-handling
---

The library does a best-effort job of guiding you correct any mistakes that you might make when using the APIs. You can specify how you want to react to these errors if you'd like:

```tsx
const App = () => {
  const onReportPrepared = useCallback((report: RenderPassReport) => {
    monorail.produce(convertReportToMonorailObject(report));
  }, []);

  const errorHandler = useCallback((error: Error) => {
    // Do stuff with error
  }, []);

  return (
    <PerformanceProfiler onReportPrepared={onReportPrepared} errorHandler={errorHandler}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Screen1" component={Screen1} />
          <Stack.Screen name="Screen2" component={Screen2} />
        </Stack.Navigator>
      </NavigationContainer>
    </PerformanceProfiler>
  );
};
```

This `errorHandler` is also invoked when a [render watchdog timer](./render-watchdog-timers.md) gets triggered, or if the library encounters any unexpected errors (best-effort job).

The `error` argument will be of type `PerformanceProfilerError` most of the times, except when it's truly an unforeseen error. Please file a bug report in the latter case. A `PerformanceProfilerError` also contains a `destinationScreen` that might help you handle these errors better.

All errors are logged to the console by default - that includes errors that are most likely a bug in the library code. Internal library errors will not be passed to `errorHandler`. That means the errors that do get passed to `errorHandler` callback are most likely caused by incorrect usage of the library and we recommend reporting them to a bug reporting service to your choice by providing a custom `errorHandler`.
