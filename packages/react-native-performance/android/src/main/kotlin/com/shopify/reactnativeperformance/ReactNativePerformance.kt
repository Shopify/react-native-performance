package com.shopify.reactnativeperformance

object ReactNativePerformance {
    internal var nativeStartupTimestamp: Long? = null
        private set

    @JvmStatic
    fun onAppStarted() {
        nativeStartupTimestamp = System.currentTimeMillis()
    }
}
