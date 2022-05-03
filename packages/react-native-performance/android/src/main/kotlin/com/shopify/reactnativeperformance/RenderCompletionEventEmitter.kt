package com.shopify.reactnativeperformance

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.modules.core.DeviceEventManagerModule

object RenderCompletionEventEmitter {
  private const val RENDER_COMPLETION_EVENT_NAME = "@shopify/react-native-performance/onRenderComplete"

  fun onRenderComplete(
    context: ReactContext,
    destinationScreen: String,
    renderPassName: String,
    interactive: Interactive,
    componentInstanceId: String
  ) {
    val event = Arguments.createMap().apply {
        putString("timestamp", System.currentTimeMillis().toString())
        putString("renderPassName", renderPassName)
        putString("interactive", interactive.toString())
        putString("destinationScreen", destinationScreen)
        putString("componentInstanceId", componentInstanceId)
    }
    context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        .emit(RENDER_COMPLETION_EVENT_NAME, event)
  }
}
