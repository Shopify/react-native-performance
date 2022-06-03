---
id: getting-started
title: Getting started
slug: /guides/react-native-performance-navigation/getting-started
---

`@shopify/react-native-performance-navigation` package is a companion to the [react-native-performance](../../fundamentals/getting-started).

It contains some additional higher-order profilers that we anticipate most apps would find helpful, as well as `ReactNavigationPerformanceView`, built on top of vanilla `PerformanceMeasureView` with the addition of optimizations for [React Navigation library](https://reactnavigation.org/).

This package has two goals:

- Provide utilities that are directly consumable by apps, or
- Provide code references showcasing how one can build custom profilers on top of the foundational blocks provided by `react-native-performance`.
  - If your app uses a different version of a peer dependency as declared by this package, you can adapt the provided implementations to work for you until you can migrate.

Note that there are additional helper packages to be used with the [React Navigation library](https://reactnavigation.org/):

- [react-native-performance-navigation-drawer](./react-native-performance-navigation-drawer.md)
- [react-native-performance-navigation-bottom-tabs](./react-native-performance-navigation-bottom-tabs.md)

## Installation

You can install the package by running the following command:

```bash
$ yarn add @shopify/react-native-performance-navigation
```

Note that this package has the following peer dependencies that should be listed in your app's package.json:

```bash
$ yarn add @react-navigation/core @react-navigation/stack @react-navigation/native @shopify/react-native-performance
```

### ReactNavigationPerformanceView

As mentioned before, `ReactNavigationPerformanceView` acts as a replacement for `PerformanceMeasureView` to be used along with `react-navigation`. Its API is the same, however, it has a new render pass called `transition-end` and influences when `interactive` is set to true.
Whenever there is a navigation transition between screen A and screen B, `ReactNavigationPerformanceView` ensures that screen B is not marked as `interactive` until the transition has been successfully completed - this is because the destination screen is not interactive during the transition itself.
After the end of the transition, you will see another render pass event with a name of `transition-end`. With this event, the screen can also be considered `interactive` (but it does not have to, depending on your use case).
