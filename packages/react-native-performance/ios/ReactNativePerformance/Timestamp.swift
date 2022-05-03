import Foundation

@objc public class Timestamp: NSObject {
    @objc public static func nowMillis() -> TimeInterval {
        Date().timeIntervalSince1970 * 1000
    }

    @objc public static func systemUptimeMillis() -> TimeInterval {
        ProcessInfo.processInfo.systemUptime * 1000
    }
}
