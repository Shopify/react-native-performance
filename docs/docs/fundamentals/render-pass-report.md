---
id: render-pass-report
title: Render Pass Reports
slug: /fundamentals/render-pass-report
---

The profiler library measures the render times for the various screens in your app. Everytime a profiled screen is rendered, the library will emit its output as an `RenderPassReport` object. You need to supply an `onReportPrepared` callback to the `PerformanceProfiler` component to receive these reports, and do with them as you please. You may `console.log` these reports, show them in some UI dev tool, or fire them off to a telemetry service.

This callback will be invoked everytime a profiled screen is rendered. A screen may get rendered multiple times. The library expects you to assign unique names to these discrete _render passes_. A `RenderPassReport` will be generated for every such render pass.

Note that this one callback will be invoked for _every_ screen in your app that you profile via the library. That is because we expect all reports to be handled consistently in your app. If, however, you need to subscribe to reports for a given screen, please refer to the `useRenderPassReport` hook instead, which allows you to filter reports by a screen name regex.

### RenderPassReport Structure

The library emits a JSON report for every completed render pass. Here's an example:

```json
{
  "reportId": "3edb5bb5-8799-4322-899d-f5b6faf5dade",
  "resourceAcquisitionStatus": {
    "totalTimeMillis": 5019,
    "components": {
      "AllRickAndMortyCharactersQuery": {
        "durationMillis": 891,
        "status": "completed"
      },
      "simulatedSlowOperation": {
        "durationMillis": 5019,
        "status": "completed"
      },
      "useAsyncStorage('some_key').setItem": {
        "durationMillis": 19,
        "status": "completed"
      },
      "AsyncStorage.setItem('some_key_2')": {
        "durationMillis": 19,
        "status": "completed"
      },
      "useAsyncStorage('some_key').getItem": {
        "durationMillis": 5,
        "status": "completed"
      },
      "AsyncStorage.getItem('some_key_2')": {
        "durationMillis": 8,
        "status": "completed"
      }
    }
  },
  "flowInstanceId": "bc738def-da39-4b7e-8965-c97110c12336",
  "sourceScreen": "PackageExamples",
  "destinationScreen": "SomeScreen",
  "flowStartTimeSinceEpochMillis": 1611603113725.3179,
  "timeToConsumeTouchEventMillis": 2.682223916053772,
  "renderPassName": "interactive",
  "timeToRenderMillis": 5085.299072265625,
  "interactive": true
}
```

This JSON contains these properties:

| Property                        | Type                                                      | Availability | Description                                                                                                                                                                                                                                                     |
| ------------------------------- | --------------------------------------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `reportId`                      | `string`                                                  | always       | A UUID uniquely identifying a report for each render. If you get the same report emitted multiple times from the library (via multiple usages of the `useRenderPassReport` hook, for instance), all of these reports will share the same unique `reportId`.     |
| `resourceAcquisitionStatus`     | [`ResourceAcquisitionStatus`](#ResourceAcquisitionStatus) | always       | Represents the current status of all the profiled data operations when a render pass was completed.                                                                                                                                                             |
| `flowInstanceId`                | `string`                                                  | always       | A UUID uniquely identifying an instance of a flow. All render pass reports originating from a single run of a flow will share the same unique `flowInstanceId`.                                                                                                 |
| `sourceScreen`                  | `string`                                                  | optional     | The source screen for a profiled flow. Can be optionally provided when profiling the [navigation render times](#Measuring-Navigation-Render-Times).                                                                                                             |
| `destinationScreen`             | `string`                                                  | always       | The profiled destination screen.                                                                                                                                                                                                                                |
| `flowStartTimeSinceEpochMillis` | `number`                                                  | always       | The timestamp when a flow was started.                                                                                                                                                                                                                          |
| `timeToConsumeTouchEventMillis` | `number`                                                  | optional     | The library can calculate how long it took for a native touch event to get consumed by the JS `Touchable::onPress` callbacks. It can do so if you [pass along](#Measuring-Navigation-Render-Times) the first argument of the `onPress` callback to the library. |
| `timeToBootJsMillis`            | `number`                                                  | optional     | The time taken for the JS code to boot up. Only available when measuring the [app-startup render times](#Measuring-App-Startup-Render-Time).                                                                                                                    |
| `renderPassName`                | `string`                                                  | optional     | The name of the completed render pass. Not available for an [aborted render pass](#Aborted-Render-Pass).                                                                                                                                                        |
| `timeToRenderMillis`            | `number`                                                  | optional     | The time taken to complete a render pass. Not available for an [aborted render pass](#Aborted-Render-Pass).                                                                                                                                                     |
| `timeToAbortMillis`             | `number`                                                  | optional     | The time taken to abort a render pass. Only available for an [aborted render pass](#Aborted-Render-Pass).                                                                                                                                                       |
| `interactive`                   | `boolean`                                                 | always       | Indicates whether a given render pass led to the screen being interactive or not. Controlled via the `interactive` prop of the `PerformanceMeasureView`. Is always false for an [aborted render pass](#Aborted-Render-Pass).                                    |

<a name="ResourceAcquisitionStatus"></a>

`ResourceAcquisitionStatus` contains the following properties:

| Property          | Type     | Availability | Description                                                                                                                                                                                                                                                 |
| ----------------- | -------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `totalTimeMillis` | `number` | always       | The total time taken by all the `completed` or `cancelled` operations to reach that state. Indicates how long a screen took to fetch (or cancel fetching) its data resources needed for completing a render pass. Is `0` is all `components` are `ongoing`. |
| `components`      | `object` | always       | The keys correspond to the profiled operations' names. The [values](#ResourceAcquisitionComponentStatus) indicate their snapshot statuses when the render pass was completed.                                                                               |

<a name="ResourceAcquisitionComponentStatus"></a>

The values in of the `components` object contain these properties:

| Property         | Type     | Availability | Description                                                                                                                                            |
| ---------------- | -------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `durationMillis` | `number` | optional     | The time taken by a given operation to reach the `completed` or `cancelled` status. Only available if the operation had reached one of these statuses. |
| `status`         | `string` | always       | One of `ongoing`, `cancelled`, or `completed`. Indicates the current status of the profiled data operation when a render pass was completed.           |
