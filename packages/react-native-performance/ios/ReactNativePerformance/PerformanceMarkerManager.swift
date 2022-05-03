import Foundation

@objc(PerformanceMarkerManager)
class PerformanceMarkerManager: RCTViewManager {
    override func view() -> UIView! {
        return PerformanceMarker()
    }

    override static func requiresMainQueueSetup() -> Bool {
        return true
    }
}
