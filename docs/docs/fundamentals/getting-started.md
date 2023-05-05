---
id: getting-started
title: Getting started
slug: /fundamentals/getting-started
---

## Installation

You can install the package by running the following command:

```bash
yarn add @shopify/react-native-performance
```

Since this package contains code that needs to be natively linked, you'll have to run pod install:

```bash
npx pod-install
```

## Vanilla React-Native Setup

The Performance profiler library needs to be initialized in all 3 parts of your app: Android Native, iOS Native, and TS.

### Android Native Initialization <a name="Android-Native-Initialization"></a>

Add this snippet to your Android `MainApplication.java`. Make sure that the `ReactNativePerformance.onAppStarted()` is the first line in the `onCreate`. We want to initialize the profiler as early as possible in the App's lifecycle.

```java
import com.shopify.reactnativeperformance.ReactNativePerformance;

// ...

@Override
public void onCreate() {
  ReactNativePerformance.onAppStarted();
  super.onCreate();
  // other stuff
}
```

You might also need to initialize your bug reporting service pretty early on in your app's lifecycle. We recommend initializing the library _before_ the bug reporting service, so that the time taken to initialize the latter is included in your app startup times. This, of course, leaves you vulnerable to the situation where initializing the library causes an app crash, and that does not get reported to your bug reporting service. Nevertheless, `onAppStarted` method call is simple enough that we feel confident recommending it to be excluded from the bug reporter's coverage.

### iOS Native Initialization <a name="iOS-Native-Initialization"></a>

Similarly, add this snipped in your iOS `AppDelegate.m`. Again, ensure that the `[ReactNativePerformance onAppStarted]` is the first line in the app startup routine.

```objc
#import <ReactNativePerformance/ReactNativePerformance.h>

// ...

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [ReactNativePerformance onAppStarted];
  // other stuff
}
```

## Expo Setup

To use the `@shopify/react-native-performance` library in your project you'll need to set up the `app.json` to contain the following contents under the `plugins` section

```json
"plugins": [
  "@shopify/react-native-performance/app.plugin.js"
],
```

The above setup will allow you to use most of the other performance plugins as well. If you want to use the Flipper plugins you'll need to install `react-native-flipper` and `expo-build-properties` and set flipper to true for iOS. See the example below.

```json
"plugins": [
  "@shopify/react-native-performance/app.plugin.js",
  [
    "expo-build-properties",
    {
      "ios": {
        "flipper": true
      }
    }
  ]
],
```

Finally run `npx expo prebuild` and the project will be set up for you. Keep in mind that, if a third-party library uses `"useFrameworks": "static"` for iOS, integrating Flipper will not work since it is incompatible. See the [Expo Documentation](https://docs.expo.dev/guides/using-flipper/#limitations) on this subject

### TS Initialization

Mount the `<PerformanceProfiler/>` component somewhere high up in your App tree. For example:

```tsx
import {RenderPassReport, PerformanceProfiler} from '@shopify/react-native-performance';

const App = () => {
  const onReportPrepared = useCallback((report: RenderPassReport) => {
    monorail.produce(convertReportToMonorailObject(report));
  }, []);

  return (
    <PerformanceProfiler onReportPrepared={onReportPrepared}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Screen1" component={Screen1} />
          <Stack.Screen name="Screen2" component={Screen2} />
        </Stack.Navigator>
      </NavigationContainer>
    </PerformanceProfiler>
  );
};
```
