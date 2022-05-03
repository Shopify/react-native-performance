---
id: global-switch
title: Global Enable/Disable Switch
slug: /fundamentals/global-switch
---

Performance monitoring is a significantly less critical part of your app than providing actual functionality to the end-user. You may discover some issues with your profiler setup in production, or discover bugs in the library (please report them back! ❤️). Ideally, you should've set up a custom [`errorHandler`](#Error-Handling) for monitoring these situations.

In either case, it is useful to have the ability to turn off performance monitoring completely, and let the app behave as if the library was never integrated.

The package does its best to facilitate this. You can dynamically turn the profiler on or off by setting the `enabled` prop to the `PerformanceProfiler` component.

```tsx
const App = () => {
  const onReportPrepared = useCallback((report: RenderPassReport) => {
    monorail.produce(convertReportToMonorailObject(report));
  }, []);

  const isProfilerEnabled = useFeatureFlag('PERFORMANCE_PROFILER');

  return (
    <PerformanceProfiler onReportPrepared={onReportPrepared} enabled={isProfilerEnabled}>
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

Most apps have some kind of feature-flag setup. These feature flags are driven either via build-time constants or provided by the server. We recommend controlling the enabled state of the performance profiler via such a feature flag. Ideally, a server-driven feature flag would provide the most amount of flexibility, since you can completely turn off the profiler in production without needing to ship a new build.
