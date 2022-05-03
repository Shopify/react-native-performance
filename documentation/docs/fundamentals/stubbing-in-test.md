---
id: stubbing-in-test
title: Stubbing the profiler in tests
slug: /fundamentals/stubbing-in-test
---

As mentioned [before](./global-switch), you can completely turn off performance profiling by setting the `enabled` prop to `false`. You can also use this mechanism to disable profiler in your test environment. Disabling the profiler converts all public APIs into no-ops, ensuring that they have minimal interference with your business logic tests.

We recommend configuring the `PerformanceProfiler` with the `enabled` state set to `false` when setting up the test context under which your test subject components are rendered. For instance, if you're using [react-native-testing-library](https://github.com/callstack/react-native-testing-library):

```tsx
import {render} from 'react-native-testing-library';

const TestRenderContext = ({children}: {children: React.ReactNode}) => {
  return (
    <PerformanceProfiler enabled={false} onReportPrepared={() => {}}>
      {children}
    </PerformanceProfiler>
  );
};

describe('MyScreenTest', () => {
  it('does something', () => {
    render(
      <TestRenderContext>
        <MyScreen />
      </TestRenderContext>,
    );

    // assert things
  });
});
```

Additionally, the library exposes a mock file that can be imported in your jest config script. This file will setup certain mocks needed for the library to work correctly in a test environment:

```ts
// in your jest config file
import '@shopify/react-native-performance/jest-mock';
```
