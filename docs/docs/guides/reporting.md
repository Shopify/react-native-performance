---
id: reporting
title: Reporting to analytics
slug: /reporting
sidebar_position: 5
---

As was mentioned in [Render Pass Reports](./../fundamentals/render-pass-report.md) chapter, every time a profiled screen is rendered, the library emits a `RenderPassReport` object that can be accessed in the `onReportPrepared` callback of the `PerformanceProfiler` component. Through this callback, one can report the reports to a telemetry service. On this page, we will see an example of how to send `Render Pass Reports` to [Firebase](https://firebase.google.com/).

## Firebase

After integrating [React Native Firebase](https://rnfirebase.io/) to an app and adding [Analytics](https://rnfirebase.io/analytics/usage), sending the reports to Firebase is very easy:

<script src="https://gist.github.com/ElviraBurchik/ca8c842765714b978def5bfbd93ae609.js"></script>


You can find a demo app with Firebase integration in [this repo](https://github.com/ElviraBurchik/react-native-performance-reporting-demo).
