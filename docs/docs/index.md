---
id: welcome
title: Welcome
slug: /
---

# React Native Performance

<img src="https://github.com/Shopify/react-native-performance/actions/workflows/react-native-performance.yml/badge.svg?branch=main" alt="Build status"/>
<img src="https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg" alt="lerna"/> <img src="https://img.shields.io/npm/l/@shopify/react-native-performance" alt="license: MIT"/> <img src="https://img.shields.io/discord/928252803867107358" alt="Discord chat"/>

## Welcome to React Native Performance 👋

**React Native Performance is a group of packages built at Shopify for profiling React Native app performance.**

![Examples of profiling a screen with multiple renders](./mutiple-renders-demo.gif)

## Getting started

React Native Performance monorepo contains several packages:

- [react-native-performance](fundamentals/getting-started) - a core library for measuring the render times for the different flows in your app.
- Extension libraries atop of [react-native-performance](fundamentals/getting-started):
  - [react-native-performance-navigation](guides/react-native-performance-navigation/getting-started) - useful higher-order profiles as well as additional components for easier profiling of apps using the [React Navigation library](https://reactnavigation.org/).
    - [react-native-performance-navigation-bottom-tabs](guides/react-native-performance-navigation/react-native-performance-navigation-bottom-tabs) - extension library atop [react-native-performance-navigation](guides/react-native-performance-navigation/getting-started) with additional helper methods for `@react-navigation/bottom-tabs` library.
    - [react-native-performance-navigation-drawer](guides/react-native-performance-navigation/react-native-performance-navigation-drawer) - extension library atop [react-native-performance-navigation](guides/react-native-performance-navigation/getting-started) with additional helper methods for `@react-navigation/drawer` library.
- [react-native-performance-lists-profiler](guides/react-native-performance-lists-profiler) contains utilities for profiling `FlatList`.
- [flipper-plugin-react-native-performance](guides/react-native-performance-lists-profiler.md) contains a Flipper plugin to make lists profiling easier. The plugin visualises TTI, blank areas, and its averages.


:::note
[react-native-performance](fundamentals/getting-started) is the core library which provides basic building blocks for profiling operations but we recommend using the other packages for convenience and alignment with other Shopify apps.
:::

To know more about the individual packages, follow the links to their documentation.
