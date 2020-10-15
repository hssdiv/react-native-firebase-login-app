package com.firebase_react_native_app;

import com.facebook.react.ReactActivity;

import android.content.Intent;
import android.content.res.Configuration;

import org.devio.rn.splashscreen.SplashScreen;
import android.os.Bundle; 

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "firebase_react_native_app";
  }

  @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);
        super.onCreate(savedInstanceState);
    }
}
