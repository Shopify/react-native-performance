import Foundation

@objc(ReactNativePerformanceModule)
class ReactNativePerformanceModule: NSObject {
    @objc func getNativeStartupTimestamp(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        let startupTimestamp = ReactNativePerformance.startupTimestamp()
        if (startupTimestamp < 0.0) {
            let message = "[ReactNativePerformance onAppStarted] was never called by the native portion of the app."
            reject(nil, message, PerformanceError.illegalState(message))
            return
        }

        resolve(String(startupTimestamp))
    }

    @objc func getNativeTime(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        let timestamps = [
            "timeSinceEpochMillis": String(Timestamp.nowMillis()),
            "uptimeMillis": String(Timestamp.systemUptimeMillis())
        ]

        resolve(timestamps)
    }

    @objc func getNativeUuid(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        resolve(NSUUID().uuidString)
    }

    @objc static func requiresMainQueueSetup() -> Bool {
        return true
    }
}
