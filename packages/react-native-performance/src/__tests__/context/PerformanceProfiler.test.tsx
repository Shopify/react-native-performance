/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import {renderHook} from '@testing-library/react-hooks';

import {PerformanceProfiler} from '../../context';
import useReportEmitter from '../../context/useReportEmitter';
import {OnStateChangedListener, useStateController, useStateControllerInitializer} from '../../state-machine';

jest.mock('../../state-machine/controller/useStateControllerInitializer', () => {
  return jest.fn();
});

jest.mock('../../context/useReportEmitter', () => {
  return jest.fn();
});

describe('context/PerformanceProfiler', () => {
  const mockStateController = {key: 'value'};
  let mockReportEmitter: OnStateChangedListener;

  beforeEach(() => {
    mockReportEmitter = jest.fn();
    // @ts-ignore
    useStateControllerInitializer.mockReturnValue(mockStateController);
    // @ts-ignore
    useReportEmitter.mockReturnValue(mockReportEmitter);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('intializes the state controller via the useStateControllerInitializer hook', () => {
    const wrapper = ({children}: {children: React.ReactElement}) => (
      <PerformanceProfiler onReportPrepared={jest.fn()}>{children}</PerformanceProfiler>
    );

    const resolvedStateController = renderHook(() => useStateController(), {
      wrapper,
    }).result.current;

    expect(resolvedStateController).toBe(mockStateController);
  });

  it('uses the report emitter prepared by the useReportEmitter hook', () => {
    const wrapper = ({children}: {children: React.ReactElement}) => (
      <PerformanceProfiler onReportPrepared={jest.fn()}>{children}</PerformanceProfiler>
    );

    expect(useStateControllerInitializer).not.toHaveBeenCalled();

    renderHook(() => useStateController(), {wrapper});

    expect(useStateControllerInitializer).toHaveBeenCalledWith(
      expect.objectContaining({reportEmitter: mockReportEmitter}),
    );
  });

  it('uses render timeouts by default', () => {
    const wrapper = ({children}: {children: React.ReactElement}) => (
      <PerformanceProfiler onReportPrepared={jest.fn()}>{children}</PerformanceProfiler>
    );
    renderHook(() => useStateController(), {wrapper});
    expect(useStateControllerInitializer).toHaveBeenCalledWith(expect.objectContaining({useRenderTimeouts: true}));
  });

  it('does not use render timeouts if turned off', () => {
    const wrapper = ({children}: {children: React.ReactElement}) => (
      <PerformanceProfiler useRenderTimeouts={false} onReportPrepared={jest.fn()}>
        {children}
      </PerformanceProfiler>
    );
    renderHook(() => useStateController(), {wrapper});
    expect(useStateControllerInitializer).toHaveBeenCalledWith(expect.objectContaining({useRenderTimeouts: false}));
  });

  it('overrides render timeout if provided', () => {
    const wrapper = ({children}: {children: React.ReactElement}) => (
      <PerformanceProfiler renderTimeoutMillis={3000} onReportPrepared={jest.fn()}>
        {children}
      </PerformanceProfiler>
    );
    renderHook(() => useStateController(), {wrapper});
    expect(useStateControllerInitializer).toHaveBeenCalledWith(expect.objectContaining({renderTimeoutMillis: 3000}));
  });

  it('does not use render timeout if turned off, but override is provided', () => {
    const wrapper = ({children}: {children: React.ReactElement}) => (
      <PerformanceProfiler renderTimeoutMillis={3000} useRenderTimeouts={false} onReportPrepared={jest.fn()}>
        {children}
      </PerformanceProfiler>
    );
    renderHook(() => useStateController(), {wrapper});
    expect(useStateControllerInitializer).toHaveBeenCalledWith(expect.objectContaining({useRenderTimeouts: false}));
  });
});
