package com.shopify.reactnativeperformance

import android.os.SystemClock
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableNativeMap
import java.util.UUID

class ReactNativePerformanceModule(reactContext: ReactContext) :
    ReactContextBaseJavaModule(reactContext as ReactApplicationContext) {
    override fun getName() = "Performance"

    @ReactMethod
    fun getNativeStartupTimestamp(promise: Promise) {
        ReactNativePerformance.nativeStartupTimestamp?.let {
            promise.resolve(it.toString())
        } ?: promise.reject(IllegalStateException(
            "ReactNativePerformance.onAppStarted was never called by the native portion of the app."
        ))
    }

    @ReactMethod
    fun getNativeTime(promise: Promise) {
        val timeSinceEpochMillis = System.currentTimeMillis()
        val uptimeMillis = SystemClock.uptimeMillis()

        val timestamps = WritableNativeMap().apply {
            putString("timeSinceEpochMillis", timeSinceEpochMillis.toString())
            putString("uptimeMillis", uptimeMillis.toString())
        }

        promise.resolve(timestamps)
    }

    @ReactMethod
    fun getNativeUuid(promise: Promise) {
        promise.resolve(UUID.randomUUID().toString())
    }
}
