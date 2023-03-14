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
    var interactive: Boolean? by PerformanceMarkerProp()
    var componentInstanceId: String? by PerformanceMarkerProp()

    init {
        this.isEnabled = false;
    }

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        sendRenderCompletionEventIfNeeded()
    }


    private var reportedOnce = false

    private fun sendRenderCompletionEventIfNeeded() {
        val _destinationScreen = this.destinationScreen
        val _renderPassName = this.renderPassName
        val _interactive = this.interactive
        val _componentInstanceId = this.componentInstanceId

        if (_destinationScreen == null || _renderPassName == null || _interactive == null || _componentInstanceId == null) {
            return
        }

        if (reportedOnce) {
            return
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
    fun setInteractive(view: PerformanceMarker, interactive: Boolean) {
        view.interactive = interactive
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
