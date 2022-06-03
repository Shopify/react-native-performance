---
id: react-native-performance-navigation-drawer
title: Drawer
slug: /guides/react-native-performance-navigation/react-native-performance-navigation-drawer
---

# react-native-performance-navigation-drawer

Extension library atop [@shopify/react-native-performance-navigation](../react-native-performance-navigation/getting-started) with additional helper methods for `@react-navigation/drawer` library.

## Installation

You can install the package by running the following command:

```bash
$ yarn add @shopify/react-native-performance-navigation-drawer
```

Note that this package has the following peer dependencies that should be listed in your app's package.json:

```bash
$ yarn add @react-navigation/core @react-navigation/stack @react-navigation/native @react-navigation/drawer-tabs @shopify/react-native-performance @shopify/react-native-performance-navigation react-native-reanimated react-native-gesture-handler
```

## Usage

#### createProfiledDrawerNavigator

This utility wraps over the stock `createDrawerNavigator`, and allows you to profile how long it takes to render the screens hosted inside the different tabs.

There are certain complexities when it comes to profiling the render times of the different tabs. Once a tab is opened, it may be kept in memory if you revisit it, not causing it to re-render. `createProfiledDrawerNavigator` accounts for such situations.

```tsx
const Drawer = createProfiledDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name={NavigationKeys.DRAWER_NAVIGATOR_SCREEN_1} component={TabScreen1} />
      <Drawer.Screen name={NavigationKeys.DRAWER_NAVIGATOR_SCREEN_2} component={TabScreen2} />
    </Drawer.Navigator>
  );
};
```
