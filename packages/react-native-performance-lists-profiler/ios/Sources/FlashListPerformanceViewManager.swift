import Foundation
import React

@objc(FlashListPerformanceViewManager)
class FlashListPerformanceViewManager: RCTViewManager {
    override func view() -> UIView! {
        let blankAreaView = BlankAreaView()
        blankAreaView.shouldCheckRCTView = true
        blankAreaView.cells = { scrollView in
            // Comparing with a raw string since we cannot import React in this file
            let container = scrollView.subviews.first(where: { $0 is RCTScrollContentView })?.subviews.first
            let autoLayoutView = container?.subviews.first(where: { "\(type(of: $0.self))" == "AutoLayoutView" })
            let cells = autoLayoutView?.subviews ?? []
            let additionalViews = container?.subviews.filter { "\(type(of: $0.self))" != "AutoLayoutView" } ?? []
            return cells + additionalViews
        }
        return blankAreaView
    }

    override static func requiresMainQueueSetup() -> Bool {
        return true
    }
}
