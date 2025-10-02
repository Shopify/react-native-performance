/// <reference types="jest" />
import { StateController } from '../state-machine';
export default class MockStateController implements StateController {
    configureRenderTimeout: jest.Mock<any, any>;
    addStateChangedListener: jest.Mock<any, any>;
    removeStateChangedListener: jest.Mock<any, any>;
    onAppStarted: jest.Mock<any, any>;
    onNavigationStarted: jest.Mock<any, any>;
    onScreenMounted: jest.Mock<any, any>;
    onScreenUnmounted: jest.Mock<any, any>;
    onFlowReset: jest.Mock<any, any>;
    onRenderPassCompleted: jest.Mock<any, any>;
    getCurrentStateFor: jest.Mock<any, any>;
    stopFlowIfNeeded: jest.Mock<any, any>;
    isEnabled: boolean;
}
//# sourceMappingURL=MockStateController.d.ts.map