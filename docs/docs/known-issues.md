---
id: known-issues
title: Known issues
slug: /known-issues
---

## initialRouteName

If you use a [bottom tab](https://reactnavigation.org/docs/bottom-tab-navigator) or a [drawer](https://reactnavigation.org/docs/drawer-navigator/) navigator with `initialRouteName` referring to a different screen than the first one, `react-native-performance` might report inaccurate measurements. To fix that, make sure that `backBehavior` is set to `history`:

```diff
- <Tab.Navigator initialRouteName="Screen2">
+ <Tab.Navigator initialRouteName="Screen2" backBehavior="history">
  <Tab.Screen
    name="Screen1"
    component={Screen1}
  />
  <Tab.Screen
    name="Screen2"
    component={Screen2}
  />
</Tab.Navigator>
```

The bug is tracked in [this](https://github.com/Shopify/react-native-performance/issues/118) issue.

## Kotlin Compile Error

If you are building from a bare React-Native project it's possible to encounter the error

```
Build file '/Users/<youruser>/repos/ShopifyPerformance/node_modules/@shopify/react-native-performance/android/build.gradle' line: 3
* What went wrong:
A problem occurred evaluating project ':shopify_react-native-performance'.
> Plugin with id 'kotlin-android' not found.
```

If this is the case you'll need to add the Kotlin Gradle plugin to your top level Android `build.gradle` file.

```
buildscript {
  ext.kotlin_version = '1.6.21'
  ...

  dependencies {
    ...
    classpath('org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version')
  }
}
```
