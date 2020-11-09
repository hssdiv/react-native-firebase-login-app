package com.firebase_react_native_app;

import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.widget.Toast;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

public class SensorsModule extends ReactContextBaseJavaModule{
  private static ReactApplicationContext reactContext;

    private SensorManager sensorManager;

  SensorsModule(Context context, ReactApplicationContext reactApplicationContext)  {
    super(reactApplicationContext);


    sensorManager = (SensorManager) context.getSystemService(Context.SENSOR_SERVICE);

    reactContext = reactApplicationContext;
  }

   @Override
  public String getName() {
    return "Sensor";
  }

  private SensorEventListener acceleromenterSensorListener = null;
  private SensorEventListener gyroscopeSensorListener = null;

  @ReactMethod
  public void getAccelerometerData(Callback dataCallback) {
    acceleromenterSensorListener = new SensorEventListener() {
      @Override
      public void onSensorChanged(SensorEvent sensorEvent) {
        float ax = sensorEvent.values[0];
        float ay = sensorEvent.values[1];
        float az = sensorEvent.values[2];
        dataCallback.invoke(ax,ay,az);
        sensorManager.unregisterListener(acceleromenterSensorListener);
      }

      @Override
      public void onAccuracyChanged(Sensor sensor, int i) {
      }
    };
    sensorManager.registerListener(acceleromenterSensorListener, sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER), SensorManager.SENSOR_DELAY_NORMAL);
  }

  @ReactMethod
  public void getGyroscopeData(Callback dataCallback) {
     gyroscopeSensorListener = new SensorEventListener() {
      @Override
      public void onSensorChanged(SensorEvent sensorEvent) {
        float axisX = sensorEvent.values[0];
        float axisY = sensorEvent.values[1];
        float axisZ = sensorEvent.values[2];
        dataCallback.invoke(axisX,axisY,axisZ);
        sensorManager.unregisterListener(gyroscopeSensorListener);
      }

      @Override
      public void onAccuracyChanged(Sensor sensor, int i) {
      }
    };
    sensorManager.registerListener(gyroscopeSensorListener, sensorManager.getDefaultSensor(Sensor.TYPE_GYROSCOPE), SensorManager.SENSOR_DELAY_NORMAL);
  }

  @ReactMethod
  public void showToast(String message) {
    Toast.makeText(getReactApplicationContext(), message, Toast.LENGTH_SHORT).show();
  }
}