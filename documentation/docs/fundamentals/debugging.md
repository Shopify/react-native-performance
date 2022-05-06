---
id: debugging
title: Debugging
slug: /fundamentals/debugging
---

## Error types

The main goal of the package is reporting performance metrics. However, sometimes the library encounters errors - either internal or caused by incorrect usage. By default, the library only reports errors that are _actionable_ and _impact measurements_.

The performance library produces two error types:

- `bug` errors that are tied to internal issues and are handled by the library itself,
- `fatal` errors are thrown when we detect incorrect library usage and are passed to `errorHandler` in `PerformanceProfiler.`

Only `fatal` errors make it to the error handler and get thrown to the app and (possibly) to the error dashboard. Those errors are legit and should be actionable. You can learn more about `fatal` errors [here](../errors).

Internal `bug` errors signalize that something goes wrong or there is an unhandled flow that the library doesn't support yet. They will be shown when you are in **DEBUG** mode. When you stumble upon a `bug` error, we kindly ask you to [report an issue](https://github.com/Shopify/react-native-performance-open-source/issues/new), so we can look into it.

## Logger

We value the developer's console and do not want to overflow it with information the developer might not need at the moment. However, it's possible to log verbose details if needed for debugging performance issues.

**Logging** is divided into multiple levels: error, warn, info, and debug. You can explicitly tell the library which lowest level is needed at the moment. For example, you might want to use `info` level logs when inspecting performance issues and disable them when working on something else.

There are three following log levels available:

- `Error` level would log internal errors and errors signalizing incorrect usage of the library's API
- `Warn` level logs not errors, but warnings that signalize that _something goes not as expected_
- `Info` level logs additional information useful for debugging performance issues + render pass reports.
- `Debug` is the lowest level that includes any additional for debugging the package itself + [state machine](./state-machine) changes.

By default, `PerformanceProfiler` is initialized with the log level `warn.` It means that errors and warnings would appear on the console in debug builds. Since console.\* calls are synchronous, logging happens only in a development environment (when React Native packager is running) to ensure it doesn't degrade the performance of a released application.

To change the log level, change the prop passed to the `PerformanceProfiler`:

```tsx
<PerformanceProfiler logLevel={LogLevel.Debug}>
```
