/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import {render} from '@testing-library/react-native';
import {HostComponent} from 'react-native';
import {act} from 'react-test-renderer';

import 'jest-extended';
import {inMemoryCounter} from '../utils';
import {getPerformanceMarker, PerformanceMarkerProps} from '../PerformanceMarker';
import PerformanceMeasureView, {
  DEFAULT_INTERACTIVE_RENDER_PASS_NAME,
  DEFAULT_NON_INTERACTIVE_RENDER_PASS_NAME,
} from '../PerformanceMeasureView';

import MockStateController from './MockStateController';
import profilerTestWrapper from './profilerTestWrapper';

jest.mock('../PerformanceMarker', () => {
  return {
    getPerformanceMarker: jest.fn(),
  };
});
jest.mock('../utils/inMemoryCounter', () => {
  return jest.fn();
});

const TestView = (_props: {[key: string]: any}) => {
  return null;
};
const emptyComponent = () => {
  return null;
};

const inMemoryCounterMock = inMemoryCounter as jest.Mock;
describe('PerformanceMeasureView', () => {
  let stateController: MockStateController;
  let PerformanceMarker: HostComponent<PerformanceMarkerProps>;
  let Wrapper: (_: {children: React.ReactElement}) => JSX.Element;

  beforeEach(() => {
    inMemoryCounterMock.mockReturnValue('some-uuid');
    // @ts-ignore
    PerformanceMarker = emptyComponent();
    // @ts-ignore
    getPerformanceMarker.mockReturnValue(PerformanceMarker);

    stateController = new MockStateController();
    stateController.isEnabled = true;
    Wrapper = profilerTestWrapper(stateController).wrapper;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders children unaddected', () => {
    const props = {
      prop1: 'prop1',
      prop2: 123,
      prop3: false,
      style: {
        flex: 1,
        width: 1,
        height: 2,
      },
    };

    const screen = render(
      <Wrapper>
        <PerformanceMeasureView screenName="SomeScreen">
          <TestView {...props} />
        </PerformanceMeasureView>
      </Wrapper>,
    );

    const view = screen.UNSAFE_getByType(TestView);
    expect(view.props).toStrictEqual(props);
  });

  it('renders measure view with invisible style', () => {
    const screen = render(
      <Wrapper>
        <PerformanceMeasureView screenName="SomeScreen">
          <TestView />
        </PerformanceMeasureView>
      </Wrapper>,
    );
    const view = screen.UNSAFE_getByType(PerformanceMarker);
    expect(view.props.style).toStrictEqual(
      expect.objectContaining({
        width: 0,
        height: 0,
      }),
    );
  });

  it('configures the default non-interactive render pass name correctly', () => {
    const screen = render(
      <Wrapper>
        <PerformanceMeasureView screenName="SomeScreen" interactive={false}>
          <TestView />
        </PerformanceMeasureView>
      </Wrapper>,
    );

    const view = screen.UNSAFE_getByType(PerformanceMarker);

    expect(view.props.renderPassName).toBe(DEFAULT_NON_INTERACTIVE_RENDER_PASS_NAME);
  });

  it('configures the default interactive render pass name correctly', () => {
    const screen = render(
      <Wrapper>
        <PerformanceMeasureView screenName="SomeScreen" interactive>
          <TestView />
        </PerformanceMeasureView>
      </Wrapper>,
    );

    const view = screen.UNSAFE_getByType(PerformanceMarker);

    expect(view.props.renderPassName).toBe(DEFAULT_INTERACTIVE_RENDER_PASS_NAME);
  });

  it('configures the destination screen correctly', () => {
    const screen = render(
      <Wrapper>
        <PerformanceMeasureView screenName="SomeScreen" interactive>
          <TestView />
        </PerformanceMeasureView>
      </Wrapper>,
    );

    const view = screen.UNSAFE_getByType(PerformanceMarker);

    expect(view.props.destinationScreen).toBe('SomeScreen');
  });

  it('configures the interactive value to false correctly', () => {
    const screen = render(
      <Wrapper>
        <PerformanceMeasureView screenName="SomeScreen" interactive={false}>
          <TestView />
        </PerformanceMeasureView>
      </Wrapper>,
    );

    const view = screen.UNSAFE_getByType(PerformanceMarker);

    expect(view.props.interactive).toBe('FALSE');
  });

  it('configures the interactive value to true correctly', () => {
    const screen = render(
      <Wrapper>
        <PerformanceMeasureView screenName="SomeScreen" interactive>
          <TestView />
        </PerformanceMeasureView>
      </Wrapper>,
    );

    const view = screen.UNSAFE_getByType(PerformanceMarker);

    expect(view.props.interactive).toBe('TRUE');
  });

  it('configures the renderPassName correctly if one is provided', () => {
    const screen = render(
      <Wrapper>
        <PerformanceMeasureView screenName="SomeScreen" renderPassName="renderPass1">
          <TestView />
        </PerformanceMeasureView>
      </Wrapper>,
    );

    const view = screen.UNSAFE_getByType(PerformanceMarker);

    expect(view.props.renderPassName).toBe('renderPass1');
  });

  it('does not render the measure view marker if disabled', () => {
    stateController.isEnabled = false;
    const screen = render(
      <Wrapper>
        <PerformanceMeasureView screenName="SomeScreen">
          <TestView />
        </PerformanceMeasureView>
      </Wrapper>,
    );
    const views = screen.UNSAFE_queryAllByType(PerformanceMarker);
    expect(views).toHaveLength(0);
  });

  it('notifies the state controller when the screen is mounted', () => {
    inMemoryCounterMock.mockReturnValueOnce('mock-mount-id');

    expect(stateController.onScreenMounted).not.toHaveBeenCalled();
    render(
      <Wrapper>
        <PerformanceMeasureView screenName="SomeScreen">
          <TestView />
        </PerformanceMeasureView>
      </Wrapper>,
    );

    expect(stateController.onScreenMounted).toHaveBeenCalledTimes(1);
    expect(stateController.onScreenMounted).toHaveBeenCalledWith({
      destinationScreen: 'SomeScreen',
      componentInstanceId: 'mock-mount-id',
    });
  });

  it('does not notify the state controller of a screen mount if the screen re-renders', () => {
    inMemoryCounterMock.mockReturnValueOnce('mock-mount-id');
    inMemoryCounterMock.mockReturnValueOnce('mock-render-id1');
    inMemoryCounterMock.mockReturnValueOnce('mock-render-id2');

    const screen = render(
      <Wrapper>
        <PerformanceMeasureView screenName="SomeScreen">
          <TestView />
        </PerformanceMeasureView>
      </Wrapper>,
    );

    expect(stateController.onScreenMounted).toHaveBeenCalledTimes(1);

    screen.rerender(
      <Wrapper>
        <PerformanceMeasureView screenName="SomeScreen">
          <TestView />
        </PerformanceMeasureView>
      </Wrapper>,
    );

    expect(stateController.onScreenMounted).toHaveBeenCalledTimes(1);
    expect(stateController.onScreenMounted).toHaveBeenCalledWith({
      destinationScreen: 'SomeScreen',
      componentInstanceId: 'mock-mount-id',
    });
  });

  it('uses the same promise reference for tracking the componentInstanceId between mounts and unmounts', () => {
    inMemoryCounterMock.mockReturnValueOnce('mock-mount-uuid');
    const screen = render(
      <Wrapper>
        <PerformanceMeasureView screenName="SomeScreen">
          <TestView />
        </PerformanceMeasureView>
      </Wrapper>,
    );

    const {componentInstanceId: mountId} = stateController.onScreenMounted.mock.calls[0][0];

    act(() => {
      screen.unmount();
    });

    const {componentInstanceId: unmountId} = stateController.onScreenUnmounted.mock.calls[0][0];

    expect(mountId === unmountId).toBe(true);
  });

  it('notifies the state controller when the screen is unmounted', () => {
    inMemoryCounterMock.mockReturnValueOnce('mock-mount-id');
    const screen = render(
      <Wrapper>
        <PerformanceMeasureView screenName="SomeScreen">
          <TestView />
        </PerformanceMeasureView>
      </Wrapper>,
    );

    expect(stateController.onScreenUnmounted).not.toHaveBeenCalled();

    act(() => {
      screen.unmount();
    });

    expect(stateController.onScreenUnmounted).toHaveBeenCalledTimes(1);
    expect(stateController.onScreenUnmounted).toHaveBeenCalledWith({
      destinationScreen: 'SomeScreen',
      componentInstanceId: 'mock-mount-id',
    });
  });

  it("notifies the state controller of a new mount followed by the previous instance's unmount", () => {
    const Component1 = () => (
      <Wrapper>
        <PerformanceMeasureView screenName="SomeScreen">
          <TestView />
        </PerformanceMeasureView>
      </Wrapper>
    );

    const Component2 = () => (
      <Wrapper>
        <PerformanceMeasureView screenName="SomeScreen">
          <TestView />
        </PerformanceMeasureView>
      </Wrapper>
    );

    inMemoryCounterMock.mockReturnValueOnce('mock-mount-id1');
    inMemoryCounterMock.mockReturnValueOnce('mock-mount-id2');

    const screen = render(<Component1 />);

    expect(stateController.onScreenMounted).toHaveBeenCalledTimes(1);
    expect(stateController.onScreenMounted).toHaveBeenCalledWith({
      destinationScreen: 'SomeScreen',
      componentInstanceId: 'mock-mount-id1',
    });
    expect(stateController.onScreenUnmounted).not.toHaveBeenCalled();

    screen.rerender(<Component2 />);

    expect(stateController.onScreenMounted).toHaveBeenCalledTimes(2);
    expect(stateController.onScreenMounted).toHaveBeenLastCalledWith({
      destinationScreen: 'SomeScreen',
      componentInstanceId: 'mock-mount-id2',
    });
    expect(stateController.onScreenUnmounted).toHaveBeenCalledTimes(1);
    expect(stateController.onScreenUnmounted).toHaveBeenCalledWith({
      destinationScreen: 'SomeScreen',
      componentInstanceId: 'mock-mount-id1',
    });

    expect(stateController.onScreenUnmounted).not.toHaveBeenCalledBefore(stateController.onScreenMounted);
  });

  it('notifies the state controller when the screen is rendered', () => {
    inMemoryCounterMock.mockReturnValueOnce('mock-mount-id');

    expect(stateController.onRenderPassCompleted).not.toHaveBeenCalled();

    const screen = render(
      <Wrapper>
        <PerformanceMeasureView screenName="SomeScreen" renderPassName="renderPass1">
          <TestView />
        </PerformanceMeasureView>
      </Wrapper>,
    );

    const view = screen.UNSAFE_getByType(PerformanceMarker);

    view.props.onRenderComplete({
      nativeEvent: {
        timestamp: 2000,
        renderPassName: 'renderPass1',
        interactive: 'TRUE',
        destinationScreen: 'SomeScreen',
        componentInstanceId: 'mock-mount-id',
      },
    });

    expect(stateController.onRenderPassCompleted).toHaveBeenCalledTimes(1);
    expect(stateController.onRenderPassCompleted).toHaveBeenCalledWith({
      timestamp: 2000,
      renderPassName: 'renderPass1',
      interactive: true,
      destinationScreen: 'SomeScreen',
      componentInstanceId: 'mock-mount-id',
    });
  });
});
