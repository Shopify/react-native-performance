import Foundation

@objc class PerformanceMarker: UIView {
    private var reportedOnce: Bool = false
    private var renderPassName: String? = nil
    private var interactive: Interactive? = nil
    private var destinationScreen: String? = nil
    private var componentInstanceId: String? = nil
    private var onRenderComplete: RCTDirectEventBlock? = nil

    @objc func setOnRenderComplete(_ onRenderComplete: @escaping RCTDirectEventBlock) {
        assertSetOnlyOnce(currentVal: self.onRenderComplete, newVal: onRenderComplete, propertyName: "onRenderComplete")
        self.onRenderComplete = onRenderComplete
        self.sendRenderCompletionEventIfNeeded()
    }

    @objc func setComponentInstanceId(_ componentInstanceId: String) {
        assertSetOnlyOnce(currentVal: self.componentInstanceId, newVal: componentInstanceId, propertyName: "componentInstanceId")
        self.componentInstanceId = componentInstanceId
        self.sendRenderCompletionEventIfNeeded()
    }

    @objc func setRenderPassName(_ renderPassName: String) {
        assertSetOnlyOnce(currentVal: self.renderPassName, newVal: renderPassName, propertyName: "renderPassName")
        self.renderPassName = renderPassName
        self.sendRenderCompletionEventIfNeeded()
    }

    @objc func setInteractive(_ interactive: String) {
        let parsedInteractive = Interactive(stringValue: interactive)
        assertSetOnlyOnce(currentVal: self.interactive, newVal: parsedInteractive, propertyName: "interactive")
        self.interactive = parsedInteractive
        self.sendRenderCompletionEventIfNeeded()
    }

    @objc func setDestinationScreen(_ destinationScreen: String) {
        assertSetOnlyOnce(currentVal: self.destinationScreen, newVal: destinationScreen, propertyName: "destinationScreen")
        self.destinationScreen = destinationScreen
        self.sendRenderCompletionEventIfNeeded()
    }

    private func assertSetOnlyOnce<T>(currentVal: T?, newVal: T?, propertyName: String) {
        if (newVal == nil) {
            assertionFailure("'\(propertyName)' cannot be set to nil.")
        }

        if (currentVal != nil) {
            assertionFailure("'\(propertyName)' cannot be set multiple times. Make sure that you're asking React Native to create a new native instance when changing the '\(propertyName)' by supplying the 'key' prop as well.")
        }
    }

    private func sendRenderCompletionEventIfNeeded() {
        guard
        !reportedOnce,
        let renderPassName = renderPassName,
        let interactive = interactive,
        let destinationScreen = destinationScreen,
        let componentInstanceId = componentInstanceId,
        let onRenderComplete = onRenderComplete
        else {
            return
        }

        reportedOnce = true

        let timestamp = Timestamp.nowMillis()
        let onRenderCompleteEvent = [
            "timestamp": String(timestamp),
            "renderPassName": renderPassName,
            "interactive": interactive.description,
            "destinationScreen": destinationScreen,
            "componentInstanceId": componentInstanceId
        ]

        onRenderComplete(onRenderCompleteEvent)

    }
}
