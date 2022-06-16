# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [4.1.0](https://github.com/shopify/react-native-performance/compare/@shopify/react-native-performance@4.0.0...@shopify/react-native-performance@4.1.0) (2022-06-16)


### Features

* allow using multiple performance profilers ([#76](https://github.com/shopify/react-native-performance/issues/76)) ([a9b6a97](https://github.com/shopify/react-native-performance/commit/a9b6a97bb4ddecb7d8ba4fc8262f08b78f15fed0))





## [4.0.0] - 2022-05-27

* Public release.

### Features

* render timeout is now enabled by default. Previously it was opt-in functionality ([a052e31](https://github.com/Shopify/react-native-performance/commit/eb460932ba45fa0e446ebf3946dcc3a1789b7327))

### Bug Fixes

* fix flow reset throwing `ScreenProfilerNotStartedError` ([eb46093](https://github.com/Shopify/react-native-performance/commit/a052e317ce62ad86274a8d8ffe982d55f8370427))

### BREAKING CHANGES

* `useStartProfiler` hook no longer accepts `reset` prop. Use a new `useResetFlow` hook instead ([eb46093](https://github.com/Shopify/react-native-performance/commit/a052e317ce62ad86274a8d8ffe982d55f8370427))

## [3.0.6] - 2022-05-03

- ScreenProfilerNotStartedError now includes both `destinationScreen` and `componentInstanceId`

## [3.0.5] - 2022-03-15

- Minor changes

## [3.0.4] - 2022-03-15

- Transpile code for consumers

## [3.0.3] - 2022-03-15

- Enable stricter TS checks

## [3.0.2] - 2022-03-11

- Fix using untranspiled code

## [3.0.1] - 2022-03-04

- Skip transpiling the library

## [3.0.0] - 2022-02-23

- Allow profiling of multiple screen instances with the same screen name without manually resetting the timer

- **Breaking change**: Remove hooks related to `Promise` profiling, namely: `useProfiledAsyncStorage`, `useProfiledStaticAsyncStorage`, `useBuildProfiledAPI`, `useOperationProfiler`, `usePromiseProfiler`, `useStartOperationProfiling`, `useStopOperationProfiling`, `useProfiledApolloClient`, `useProfiledQuery`, `useProfiledMutation`

## [2.0.1] - 2021-11-16

- Minor changes

## [2.0.0] - 2021-11-08

- Add `MissingJSNativeLatencyError`

- Add debug logs for state changes.

- Added new `Logger` level `Info` to distinguish between logs useful for debugging the package itself or for debugging performance issues of users' apps.

- Fix `PerformanceProfilerNotStartedError` and `MultipleFlowsError`
  - Emit report events when `logLevel` is `LogLevel.debug`

- Custom `errorHandler` will no longer replace the default implementation but will be purely additional for e.g. error reporting

- Introduced `Logger` that allows specifying which log levels would be logged to the console.

  - `Debug` - all extended information useful for debugging.
  - `Warn` - warnings that signalize that something goes not as expected.
  - `Error` - both internal errors and errors signalizing incorrect usage of API or problems with the library.

- **Breaking change**: Remove `ProfiledOperationCancelledError`

- Fixed an issue that would cause slow navigation transition when an error gets thrown in parallel.

- Replace grouped internal errors with more specific ones to make the distinction more explicit

## [1.2.3] - 2021-10-07

- Fixed negative timestamps when using `react-native` versions `0.65.x` and `0.66.x`.

## [1.2.2] - 2021-09-22

- Updated readme.md to include information about usage of `backBehavior` option on Tab.Navigator.

- Updated react-test-renderer to v16.13.1.

## [1.2.1] - 2021-05-14

- (iOS only) Mark a screen as natively rendered even if it's not actively appearing
  on the window.
  - Previously, we were only marking an iOS screen as natively rendered when the
    `didMoveToWindow` callback got invoked. That may not happen if the screen is
    not currently active (e.g., an out-of-focus drawer screen).
  - We now mark the view as natively rendered when the native view instance is created.
    This also aligns the iOS implementation with Android.

- Improved the render time of `PerformanceMeasureView` by eliminting the need of
  `uuid` in that component.
  - Calculating `uuid` is a blocking native call that can cause render slow downs
  - `PerformanceMeasureView` needed uuids to track component mounts and unmounts.
    This is now being done by simply having a global in-memory counter.

- Improved the performance of most core APIs that needed to perform a state machine
  transition by refactoring uuid-create calls to async tasks.
  - The state machine's state objects needed to carry UUIDs to uniquely identify
    each state. These UUIDs also make their way to the final output reports as
    the `reportId` or `flowInstanceId`.
  - These UUID-create calls are expensive, since they need to happen on the native
    thread, and need to cross the bridge.
  - Improved the performance by implementing custom UUID-generating module that
    does that work asynchronously.

## [1.2.0] - 2021-05-03

- No changes since 1.1.9. Keeping versions aligned with react-native-performance-common-operations.

## [1.1.9] - 2021-04-30

- Improve the message of the `RenderPassNameReuseError` to include the destination screen
  name.

## [1.1.8] - 2021-04-05

- Fixed an issue that would sometimes throw an error "No matching Mounted state found
  for componentInstanceId...".
  - This would happen if a screen were unmounted after the flow was previously `reset`
    via the `useStartProfiler` hook.

- If a timer is started 2x without first rendering a screen, the library will now simply
  warn of this situation, and will try to continue executing gracefully.
  - Previously, the library would throw an error in this case.
  - It would also not record the new "started" event. It would instead continue
    retaining the state corresponding to the first event.
  - It may have also thrown some `RenderTimeoutErrors`.


## [1.1.7] - 2021-03-29

- Fixed an issue where the library would give `RenderPassNameReuseError`
  warnings excessively.
  - In [v1.1.2](#112---2021-03-18) of the library, we changed the behaviour
    such that render pass name reuse would show a warning instead of throwing
    an error by default.
  - However, we also made an unintended change where the warning would be
    (incorrectly) shown if the screen simply re-renders without going through
    a render pass name change. For example, consider a render chain like:
    `renderPass1 -> renderPass1 -> renderPass2` ("->" implies a re-render).
    Here, the library would show a warning when going through the first
    re-render. Now that won't happen
  - The library would now show warnings only if the same render pass name
    is reused at a later stage: `renderPass1 -> renderPass2 -> renderPass1`.


## [1.1.6] - 2021-03-26

- Fixed an issue where the `sourceScreen` would not be included in the final
  reports, even when one was provided via `useStartProfiler`.


## [1.1.5] - 2021-03-24

- Fixed an issue where using `<PerformanceMeasureView>` in components
  with complex render paths would throw errors saying "No previous state
  was found for screen...".
  - This error would often appear in situations where a screen component would have
    multiple code paths leading to multiple `return` statements. Each of these
    `return` statements would render different sub-components--each with their
    own instance of `<PerformanceMeasureView>`.
  - Although all of these `<PerformanceMeasureView>` instances used the same
    `screenName`, and configured the `renderPassName` and `interactive` props
    correctly, the library would previously sometimes throw the aforementioned
    error. This should now be fixed.


## [1.1.4] - 2021-03-24

- [Android only] Fixed an issue where `PerformanceMeasureView` component would
  not end the timer correctly.
  - If using a watchdog timer, you would be getting unexpected `RenderTimeoutErrors`.
  - You would not be getting render pass reports even when the screen successfully renders.
  - When navigating to a different screen, you might have been getting errors saying
    "The navigation for one screen was already queued up..."
  - https://github.com/Shopify/react-native-performance/pull/57/

## [1.1.3] - 2021-03-23

- Fixed an issue where running the library in a ReactNative-web would
  throw a "TypeError: requireNativeComponent is not a function" error,
  even when the profiler is disabled.
  - The library does not actively support RNWeb, but setting `enabled={false}`
    in that environment should gracefully mimic the absence of the library.
  - https://github.com/Shopify/react-native-performance/pull/53/

## [1.1.2] - 2021-03-18

- A render pass name reuse now shows a warning instead of an error.


## [1.1.1] - 2021-03-11

- The `timeToRenderMillis`, and `timeToAbortMillis` properties now do not include the
  `timeToBootJsMillis` values for a render-pass-report generated on app startup.
  - The previous behaviour would lead to vastly different render/render-abort times
    depending on whether a given screen was opened as a result of app startup or
    in-app navigations. This new behaviour makes these values more comparable.

- `flowStartTimeSinceEpochMillis` for a render-pass-report generated on app startup
  now corresponds the moment in time when the RN portion of the app had started.
  - Previously it used to point to the moment when the native portion of the app
    had started.
  - This change is to align this property with the corresponding change to `timeToRenderMillis`
    and `timeToAbortMillis`.
  - You can still compute the native startup timestamp by subtracting
    `timeToBootJsMillis` from `flowStartTimeSinceEpochMillis`.


## [1.1.0] - 2021-03-10

- Fixes an issue where the library would sometimes skip emitting the
  render-pass-reports for some render passes.
  - This would occur if a screen would go through multiple
    incremental render passes really quickly.

- Calling the native `ReactNativePerformance.onAppStarted` function
  (on both iOS and Android) multiple times no-longer throws exceptions.
  - Useful for brownfield apps, since they go in and out of the RN portion
    of the app multiple times.
  - Everytime the app restarts the RN portion, the app can call `onAppStarted`
    again to reset the native startup timestamp.
  - When the JS `<PerformanceProfiler>` component gets initialized again,
    it'll fetch the up-to-date native startup timestamp again.


## [1.0.1] - 2021-03-03

- Prefix ObjC classes to avoid duplicates


## [1.0.0] - 2021-02-26

- Ready for use in production.
- `useStartProfiler` can now optionally receive a `renderTimeoutMillisOverride: number` prop.
  - When provided for a specific flow, this timeout value is used instead of the default one
    provided to the `<PerformanceProfiler>` component via the `renderTimeoutMillis` prop.
  - Providing a `renderTimeoutMillisOverride` does nothing if the `useRenderTimeouts` prop
    of `<PerformanceProfiler>` component is set to `false`. No watchdog timers are used in that
    case, just like before.


## [0.1.0] - 2021-02-24

- Initial release inheriting all the features of the deprecated `react-native-apdex@0.10.0`.
- Fixed an issue where you might sometimes get the following error on slower devices on app startup:
  `Performance profiler was not initialized correctly. Did you forget to mount the <PerformanceProfiler /> component in the App tree?`

- Don't require iOS apps to have C++ modules enabled
