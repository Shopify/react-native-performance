import {Started} from '../../../state-machine/states';
import State, {StateProps} from '../../../state-machine/states/State';
import {
  getFlowStartState,
  reverseReduce,
  reverseTraverse,
  UndefinedPreviousStateError,
} from '../../../state-machine/states/state-utils';
import {BridgedEventTimestampBuilder} from '../../../BridgedEventTimestamp';

class MockState extends State {
  static readonly STATE_NAME = 'MockState';
  readonly payload: string | undefined;

  constructor({payload, ...rest}: {payload?: string} & Omit<StateProps, 'timestamp'>) {
    super({
      ...rest,
      timestamp: new BridgedEventTimestampBuilder().nativeTimestamp(1000).build(),
    });
    this.payload = payload;
  }

  getStateName() {
    return MockState.STATE_NAME;
  }

  protected cloneAsChild() {
    return new MockState({
      ...this,
      previousState: this,
    });
  }
}

describe('state-machine/states/state-utils', () => {
  describe('reverseTraverse', () => {
    it('traverses the states', () => {
      const state1 = new MockState({
        destinationScreen: 'some_screen',
        componentInstanceId: 'id',
        previousState: undefined,
        snapshotId: Promise.resolve('1'),
      });

      const state2 = new MockState({
        destinationScreen: 'some_screen',
        componentInstanceId: 'id',
        previousState: state1,
        snapshotId: Promise.resolve('2'),
      });

      const state3 = new MockState({
        destinationScreen: 'some_screen',
        componentInstanceId: 'id',
        previousState: state2,
        snapshotId: Promise.resolve('3'),
      });

      let actualVisitedStates = new Array<State>();
      reverseTraverse(state3, currentPass => {
        actualVisitedStates.push(currentPass);
      });

      expect(actualVisitedStates).toStrictEqual([state3, state2, state1]);

      actualVisitedStates = [];

      reverseTraverse(state2, currentPass => {
        actualVisitedStates.push(currentPass);
      });

      expect(actualVisitedStates).toStrictEqual([state2, state1]);

      actualVisitedStates = [];

      reverseTraverse(state1, currentPass => {
        actualVisitedStates.push(currentPass);
      });

      expect(actualVisitedStates).toStrictEqual([state1]);
    });

    it('stops traversing when the operation returns true', () => {
      const state1 = new MockState({
        destinationScreen: 'some_screen',
        componentInstanceId: 'id',
        previousState: undefined,
        snapshotId: Promise.resolve('1'),
      });

      const state2 = new MockState({
        destinationScreen: 'some_screen',
        componentInstanceId: 'id',
        previousState: state1,
        snapshotId: Promise.resolve('2'),
      });

      const state3 = new MockState({
        destinationScreen: 'some_screen',
        componentInstanceId: 'id',
        previousState: state2,
        snapshotId: Promise.resolve('3'),
      });

      const actualVisitedStates = new Array<State>();
      reverseTraverse(state3, currentPass => {
        actualVisitedStates.push(currentPass);
        if (currentPass === state2) {
          return true;
        }
      });

      expect(actualVisitedStates).toStrictEqual([state3, state2]);
    });

    it('continues traversing when the operation returns false', () => {
      const state1 = new MockState({
        destinationScreen: 'some_screen',
        componentInstanceId: 'id',
        previousState: undefined,
        snapshotId: Promise.resolve('1'),
      });

      const state2 = new MockState({
        destinationScreen: 'some_screen',
        componentInstanceId: 'id',
        previousState: state1,
        snapshotId: Promise.resolve('2'),
      });

      const state3 = new MockState({
        destinationScreen: 'some_screen',
        componentInstanceId: 'id',
        previousState: state2,
        snapshotId: Promise.resolve('3'),
      });

      const actualVisitedStates = new Array<State>();
      reverseTraverse(state3, currentPass => {
        actualVisitedStates.push(currentPass);
        return false;
      });

      expect(actualVisitedStates).toStrictEqual([state3, state2, state1]);
    });
  });

  describe('reverseReduce', () => {
    it('reduces the entire state history', () => {
      const state1 = new MockState({
        destinationScreen: 'some_screen',
        componentInstanceId: 'id',
        previousState: undefined,
        payload: '1',
        snapshotId: Promise.resolve('1'),
      });

      const state2 = new MockState({
        destinationScreen: 'some_screen',
        componentInstanceId: 'id',
        previousState: state1,
        payload: '2',
        snapshotId: Promise.resolve('2'),
      });

      const state3 = new MockState({
        destinationScreen: 'some_screen',
        componentInstanceId: 'id',
        previousState: state2,
        payload: '3',
        snapshotId: Promise.resolve('3'),
      });

      const reduced = reverseReduce(
        state3,
        (state, reduced) => {
          if (state instanceof MockState) {
            return reduced + state.payload;
          } else {
            throw new Error(`Unknown state in chain: ${state}.`);
          }
        },
        '',
      );

      expect(reduced).toBe('321');
    });
  });

  describe('getFlowStartState', () => {
    it('returns this if this is a flow start state', () => {
      const state1 = new Started({} as any);
      const state2 = new Started({} as any);

      expect(getFlowStartState(state1)).toBe(state1);
      expect(getFlowStartState(state2)).toBe(state2);
    });

    it('throws an error if a non-flow start state has an undefined previous state', () => {
      const state1 = new MockState({
        destinationScreen: 'some_screen',
        componentInstanceId: 'id',
        previousState: undefined,
        snapshotId: Promise.resolve('1'),
      });

      let flowStartState: State | undefined;
      expect(() => {
        flowStartState = getFlowStartState(state1);
      }).toThrowError(UndefinedPreviousStateError);

      expect(flowStartState).toBeUndefined();
    });
  });
});
