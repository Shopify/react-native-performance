---
id: errors
title: Errors
slug: /errors
---

## Inspecting `fatal` errors

If you see a `fatal` error in your dashboard, you should inspect the issue since not doing so can likely lead to incorrect TTI (time-to-interactive) measurements. For easier debugging, you can also change the `logLevel` to `LogLevel.Info` where you will see more information about what the package does (to read more about the package's logging, please refer to the [Logger](fundamentals/debugging#logger) documentation). If you are unable to debug the issue, let us know by either opening an issue or we can help you in the [#react-native-performance](https://discord.com/channels/928252803867107358/928253059375726622) channel on Discord. You can also learn more about the errors and their meaning in the section below 👇

## Errors documentation

### PerformanceProfilerUninitializedError

This error indicates that the `PerformanceProfiler` has most likely not been initialized. This can happen when you e.g. run `useStartProfiler` but `PerformanceProfiler` is not mounted in the current view hierarchy.

Read more about how to initialize `PerformanceProfiler` [here](fundamentals/getting-started#ts-initialization).

### RenderTimeoutError

`RenderTimeoutError` is thrown when a given screen is not rendered in the time set by `renderTimeoutMillis`. This is either because `renderTimeoutMillis` is too small or you probably have forgotten to mark the screen `interactive` via the `PerformanceMeasureView`.

Read more about render timers [here](fundamentals/render-watchdog-timers).

### ScreenProfilerNotStartedError

`ScreenProfilerNotStartedError` can occur when `PerformanceMeasureView` is used without running `useStartProfiler` before.

Read more about measuring render times [here](fundamentals/measuring-render-times).

### UnsupportedNavigatorError

If you use `react-native-performance-navigation`, this package has `react-navigation` as its dependency. We currently support only navigators of types `stack`, `tab`, `drawer` and so if there is a new navigator that you would need support for, please [create a new Github issue](https://github.com/Shopify/react-native-performance/issues/new).
