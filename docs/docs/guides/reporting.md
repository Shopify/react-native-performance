---
id: reporting
title: Reporting to analytics
slug: /reporting
sidebar_position: 5
---

As was mentioned in [Render Pass Reports](./../fundamentals/render-pass-report.md) chapter, every time a profiled screen is rendered, the library emits a `RenderPassReport` object that can be accessed in the `onReportPrepared` callback of the `PerformanceProfiler` component. Through this callback, one can report the reports to a telemetry service. On this page, we will see an example of how to send `Render Pass Reports` to [Firebase](https://firebase.google.com/).

## Firebase

After integrating [React Native Firebase](https://rnfirebase.io/) to an app and adding [Analytics](https://rnfirebase.io/analytics/usage), sending the reports to Firebase is very easy:

``` tsx
import {PerformanceProfiler, LogLevel} from '@shopify/react-native-performance';
import analytics from '@react-native-firebase/analytics';


const App = () => {
...
  return (
    ...
      <PerformanceProfiler
        logLevel={LogLevel.Debug}
        onReportPrepared={async report =>
          await analytics().logEvent('react_native_performance', report)
        }>
      </PerformanceProfiler>
    </>
  );
};

export default App;
```


You can find a demo app with Firebase integration in [this repo](https://github.com/ElviraBurchik/react-native-performance-reporting-demo).
