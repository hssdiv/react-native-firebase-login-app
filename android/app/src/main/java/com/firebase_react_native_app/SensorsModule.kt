package com.firebase_react_native_app

import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.widget.Toast
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class SensorsModule internal constructor(context: Context, reactApplicationContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactApplicationContext) {
    private val sensorManager: SensorManager
    override fun getName(): String {
        return "Sensor"
    }

    private var acceleromenterSensorListener: SensorEventListener? = null
    private var gyroscopeSensorListener: SensorEventListener? = null

    @ReactMethod
    fun getAccelerometerData(dataCallback: Callback) {
        acceleromenterSensorListener = object : SensorEventListener {
            override fun onSensorChanged(sensorEvent: SensorEvent) {
                val ax = sensorEvent.values[0]
                val ay = sensorEvent.values[1]
                val az = sensorEvent.values[2]
                dataCallback.invoke(ax, ay, az)
                sensorManager.unregisterListener(acceleromenterSensorListener)
            }

            override fun onAccuracyChanged(sensor: Sensor, i: Int) {}
        }
        sensorManager.registerListener(acceleromenterSensorListener, sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER), SensorManager.SENSOR_DELAY_NORMAL)
    }

    @ReactMethod
    fun getGyroscopeData(dataCallback: Callback) {
        gyroscopeSensorListener = object : SensorEventListener {
            override fun onSensorChanged(sensorEvent: SensorEvent) {
                val axisX = sensorEvent.values[0]
                val axisY = sensorEvent.values[1]
                val axisZ = sensorEvent.values[2]
                dataCallback.invoke(axisX, axisY, axisZ)
                sensorManager.unregisterListener(gyroscopeSensorListener)
            }

            override fun onAccuracyChanged(sensor: Sensor, i: Int) {}
        }
        sensorManager.registerListener(gyroscopeSensorListener, sensorManager.getDefaultSensor(Sensor.TYPE_GYROSCOPE), SensorManager.SENSOR_DELAY_NORMAL)
    }

    @ReactMethod
    fun showToast(message: String?) {
        Toast.makeText(reactApplicationContext, message, Toast.LENGTH_SHORT).show()
    }

    companion object {
        private lateinit var reactContext: ReactApplicationContext
    }

    init {
        sensorManager = context.getSystemService(Context.SENSOR_SERVICE) as SensorManager
        reactContext = reactApplicationContext
    }
}