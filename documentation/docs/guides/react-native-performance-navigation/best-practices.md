---
id: best-practices
title: Best practices
slug: /guides/react-native-performance-navigation/best-practices
---

### Conditional Rendering

If you want to show views based on [conditional rendering](https://reactjs.org/docs/conditional-rendering.html), it is important that `ReactNavigationPerformanceMeasureView` is rendered **uncoditionally**. You can take a look at the following example for reference:

```ts
// Property determining which component is rendered
let componentNumber = 0;
// Component0 and Component1 should not be wrapped in `ReactNavigationPerformanceMeasureView`
const childView = componentNumber === 0 ? <Component0 /> : <Component1 />;

<ReactNavigationPerformanceView screenName="MyScreen" interactive renderPassName={`interactive_${componentNumber}`}>
  {childView}
</ReactNavigationPerformanceView>;
```
