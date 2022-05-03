---
id: data-operations
title: Removal of data operations
sidebar_position: 2
---

## Removal of data operations

#### 22nd February, 2022

When changing the inner workings of state machine in [this](https://github.com/Shopify/react-native-performance/pull/336) PR, we have had issues with migrating `usePromiseProfiler` and the other derived hooks like `useBuildProfiledAPI`, `useProfiledApolloClient`, and `useProfileStaticAsyncStorage`.

These hooks are tied to a given screen and their timestamps are bundled inside the screen's state as well as in reports. This makes a strong coupling between the `Promise`s these hooks profile and the screen lifecycle.

Additionally, these hooks are not used in any of our apps and making the library leaner would be an achievement in-and-of-itself. We are, however, acknowledging that profiling `Promise`s would be useful but only if we build the solution, so it has a clear end-goal - such as displaying the time it takes for those Promises to resolve in a Mode dashboard. With the current structure of the data, it would be hard to do, though, since the operations are inside render pass reports.

With this in mind, we have decided to remove all profiling of data operations. We plan to revisit this idea in the future.
