import Foundation

@objc(RenderCompletionEventEmitter)
class RenderCompletionEventEmitter: RCTEventEmitter {
    private static let RENDER_COMPLETION_EVENT_NAME = "@shopify/react-native-performance/onRenderComplete"
    private var hasListeners = false
    private(set) static var INSTANCE: RenderCompletionEventEmitter? = nil

    override init() {
        super.init()
        RenderCompletionEventEmitter.INSTANCE = self
    }

    @objc override func supportedEvents() -> [String]! {
        return [RenderCompletionEventEmitter.RENDER_COMPLETION_EVENT_NAME]
    }

    func onRenderComplete(
        destinationScreen: String,
        renderPassName: String,
        interactive: Interactive,
        componentInstanceId: String
    ) {
        if (hasListeners) {
            let timestamp = Timestamp.nowMillis()
            sendEvent(withName: RenderCompletionEventEmitter.RENDER_COMPLETION_EVENT_NAME, body: [
                "timestamp": String(timestamp),
                "renderPassName": renderPassName,
                "interactive": interactive.description,
                "destinationScreen": destinationScreen,
                "componentInstanceId": componentInstanceId
            ])
        }
    }

    @objc override static func requiresMainQueueSetup() -> Bool {
        return true
    }

    @objc override func startObserving() {
        super.startObserving()
        hasListeners = true
    }

    @objc override func stopObserving() {
        super.stopObserving()
        hasListeners = false
    }
}
