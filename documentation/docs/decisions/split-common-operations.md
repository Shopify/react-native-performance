---
id: split-common-operations
title: Splitting `react-native-performance-common-operations`
sidebar_position: 2
---

#### November 11, 2021

Teams have reported that in order to use `react-native-performance-common-operations` they need to install dependencies they actually do not use - such as Shop [having to install](https://github.com/Shopify/react-native-performance/issues/91) `@react-navigation/drawer` even though it is not used anywhere in that repo.

To mitigate this issue, we have decided to split `react-native-performance-common-operations` into multiple packages:

- `react-native-performance-navigation`
- `react-native-performance-navigation-drawer`
- `react-native-performance-navigation-bottom-tabs`
- `react-native-performance-async-storage`
- `react-native-performance-apollo`

You can read more about the decision [here](https://github.com/Shopify/react-native-performance/issues/175).
