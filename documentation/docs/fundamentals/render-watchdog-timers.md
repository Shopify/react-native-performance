---
id: render-watchdog-timers
title: Render Watchdog Timers
slug: /fundamentals/render-watchdog-timers
---

As mentioned in the previous sections, capturing the render-time reports is a two-part process:

1. starting the timer via the `useStartProfiler` hook or `onAppStarted` native call, and
2. ending it via the `PerformanceMeasureView` component.

Additionally, one needs to communicate the transitions among the different render passes via the `interactive` and the `renderPassName` props.

It is possible that a developer may use the `useStartProfiler` hook, but forget to wrap the target screen with an `PerformanceMeasureView`. A developer may also make a mistake while writing the logic to evaluate the `interactive` prop's value such that it never transitions to `true`. Both of these developer errors may lead to interactive `RenderPassReports` not getting generated, since the library will never be able to determine whether the screen became interactive or not.

The library can help you catch these kinds of errors via the use of render watchdog timers. This is an optional opt-in functionality that is recommended to be enabled in at least the development builds of the apps.

```tsx
const App = () => {
  const onReportPrepared = useCallback((report: RenderPassReport) => {
    monorail.produce(convertReportToMonorailObject(report));
  }, []);

  return (
    // renderTimeoutMillis defaults to 10000ms
    <PerformanceProfiler renderTimeoutMillis={5000} useRenderTimeouts onReportPrepared={onReportPrepared}>
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

When enabled, the library will throw `RenderTimeoutError` if a screen's render timer was instantiated, but the said screen didn't reach the interactive state within the specified duration.

### renderTimeoutMillisOverride

`useStartProfiler` can optionally receive a `renderTimeoutMillisOverride: number` prop. When provided for a specific flow, this timeout value is used instead of the default one provided to the `<PerformanceProfiler>` component via the `renderTimeoutMillis` prop.

Please note: providing a `renderTimeoutMillisOverride` does nothing if the `useRenderTimeouts` prop of `<PerformanceProfiler>` component is set to `false`. No watchdog timers are used in that case, just like before.
