---
id: react-native-performance-navigation-bottom-tabs
title: Bottom Tabs
slug: /guides/react-native-performance-navigation/react-native-performance-navigation-bottom-tabs
---

# react-native-performance-navigation-bottom-tabs

Extension library atop [@shopify/react-native-performance-navigation](../react-native-performance-navigation/getting-started) with additional helper methods for `@react-navigation/bottom-tabs` library.

## Installation

You can install the package by running the following command:

```bash
yarn add @shopify/react-native-performance-navigation-bottom-tabs
```

Note that this package has the following peer dependencies that should be listed in your app's package.json:

```bash
yarn add @react-navigation/core @react-navigation/stack @react-navigation/native @react-navigation/bottom-tabs @shopify/react-native-performance @shopify/react-native-performance-navigation
```

## Usage

#### createProfiledBottomTabNavigator

This utility wraps over the stock `createBottomTabNavigator`, and allows you to profile how long it takes to render the screens hosted inside the different tabs.

There are certain complexities when it comes to profiling the render times of the different tabs. Once a tab is opened, it may be kept in memory if you revisit it, not causing it to re-render. `createProfiledBottomTabNavigator` accounts for such situations.

```tsx
const {Tab, buildProfiledBottomTabBarButton} = createProfiledBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name={NavigationKeys.TAB_NAVIGATOR_SCREEN_1}
        component={TabScreen1}
        options={{
          tabBarButton: buildProfiledBottomTabBarButton(),
        }}
      />
      <Tab.Screen
        name={NavigationKeys.TAB_NAVIGATOR_SCREEN_2}
        component={TabScreen2}
        options={{
          // buildProfiledBottomTabBarButton can optionally receive a `Touchable` prop
          // if you want to use something other than TouchableWithoutFeedback
          tabBarButton: buildProfiledBottomTabBarButton(),
        }}
      />
    </Tab.Navigator>
  );
};
```
