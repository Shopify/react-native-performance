package com.shopify.reactnativeperformance

import android.content.Context
import android.view.View
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.uimanager.events.RCTEventEmitter
import kotlin.reflect.KProperty
import kotlin.properties.ReadWriteProperty
import com.facebook.react.common.MapBuilder

private const val RENDER_COMPLETION_EVENT_NAME = "@shopify/react-native-performance/onRenderComplete"

class PerformanceMarker(context: Context?) : View(context) {

    var destinationScreen: String? by PerformanceMarkerProp()
    var renderPassName: String? by PerformanceMarkerProp()
    var interactive: Interactive? by PerformanceMarkerProp()
    var componentInstanceId: String? by PerformanceMarkerProp()

    init {
        setWillNotDraw(true)
    }

    private var reportedOnce = false

    /**
      We're choosing to send the onRenderComplete event back to JS the moment the view instance is created
      + the JS props are made available. We're not waiting until the view goes through the measure/layout/draw cycle.

      This is because on Android, the view may not go through this cycle until it has an active window on which
      it can paint itself. This means that if the corresponding JS component is not in focus, the native UI will
      not actually paint itself immediately.

      As a tradeoff, we call the view as render-complete the moment the view is instantiated in memory.
      This has an obvious drawback that we won't be including the time spent on the measure/layout/draw cycle.
      But that should be relatively negligible in the bigger scheme of things. Also note that we're using the
      moment when `PerformanceMarker` is rendered as a proxy for when the rest of its siblings (the actual
      screen content) is rendered. So we're already using these kinds of approximations at the native layer.
      Adding this 1 additional approximation shouldn't affect the final render times significantly.
    */
    private fun sendRenderCompletionEventIfNeeded() {
        val _destinationScreen = this.destinationScreen
        val _renderPassName = this.renderPassName
        val _interactive = this.interactive
        val _componentInstanceId = this.componentInstanceId

        if (_destinationScreen == null || _renderPassName == null || _interactive == null || _componentInstanceId == null) {
            return
        }

        if (reportedOnce) {
            throw IllegalStateException("Cannot report render completion event multiple times.")
        }

        reportedOnce = true

        val event = Arguments.createMap().apply {
            putString("timestamp", System.currentTimeMillis().toString())
            putString("renderPassName", _renderPassName)
            putString("interactive", _interactive.toString())
            putString("destinationScreen", _destinationScreen)
            putString("componentInstanceId", _componentInstanceId)
        }

        val reactContext = context as ReactContext
        reactContext
            .getJSModule(RCTEventEmitter::class.java)
            .receiveEvent(id, "onRenderComplete", event)
    }

    private class PerformanceMarkerProp<T : Any> : ReadWriteProperty<PerformanceMarker, T?> {
        private var field: T? = null

        override operator fun getValue(thisRef: PerformanceMarker, property: KProperty<*>): T? {
            return field;
        }

        override operator fun setValue(thisRef: PerformanceMarker, property: KProperty<*>, value: T?) {
            if (value == null) {
                throw IllegalArgumentException("Property '${property.name}' cannot be set to null.")
            }

            if (field != null) {
                throw IllegalStateException("Property '${property.name}' cannot be set multiple times. " +
                    "Make sure that you're asking React Native to create a new native instance " +
                    "when changing the '${property.name}' prop by supplying the 'key' prop as well.")
            }

            field = value
            thisRef.sendRenderCompletionEventIfNeeded()
        }
    }
}

class PerformanceMarkerManager : SimpleViewManager<PerformanceMarker>() {
    override fun createViewInstance(reactContext: ThemedReactContext): PerformanceMarker {
        return PerformanceMarker(reactContext)
    }

    @ReactProp(name = "destinationScreen")
    fun setDestinationScreen(view: PerformanceMarker, destinationScreen: String) {
        view.destinationScreen = destinationScreen
    }

    @ReactProp(name = "renderPassName")
    fun setRenderPassName(view: PerformanceMarker, renderPassName: String) {
        view.renderPassName = renderPassName
    }

    @ReactProp(name = "interactive")
    fun setInteractive(view: PerformanceMarker, interactive: String) {
        view.interactive = Interactive(interactive)
    }

    @ReactProp(name = "componentInstanceId")
    fun setComponentInstanceId(view: PerformanceMarker, componentInstanceId: String) {
        view.componentInstanceId = componentInstanceId
    }

    override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any> {
        return MapBuilder.builder<String, Any>().put(
                "onRenderComplete",
                MapBuilder.of(
                        "registrationName", "onRenderComplete")
        ).build();
    }

    override fun getName() = "PerformanceMarker"
}
