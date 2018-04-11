package com.localarms.location;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.location.Location;
import android.os.Vibrator;
import android.support.v4.content.LocalBroadcastManager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.Timer;
import java.util.TimerTask;

public class GeoLocationModule extends ReactContextBaseJavaModule {
  private Timer repeateVibrate;

  public GeoLocationModule(ReactApplicationContext reactContext) {
    super(reactContext);
    BroadcastReceiver geoLocationReceiver = new BroadcastReceiver() {
      @Override
      public void onReceive(Context context, Intent intent) {
        Location message = intent.getParcelableExtra("message");
        GeoLocationModule.this.sendEvent(message);
      }
    };
    LocalBroadcastManager.getInstance(getReactApplicationContext()).registerReceiver(geoLocationReceiver, new IntentFilter("GeoLocationUpdate"));
  }

  @Override
  public String getName() {
    return "GeoLocation";
  }

  @ReactMethod
  public void setUp(Callback trigger) {
  }

  @ReactMethod
  public void startService(Promise promise) {
    String result = "Success";
    try {
      Intent intent = new Intent(GeoLocationService.FOREGROUND);
      intent.setClass(this.getReactApplicationContext(), GeoLocationService.class);
      getReactApplicationContext().startService(intent);
    } catch (Exception e) {
      promise.reject(e);
      return;
    }
    promise.resolve(result);
  }

  @ReactMethod
  public void vibrate() {
    final Vibrator v = (Vibrator) getReactApplicationContext().getSystemService(Context.VIBRATOR_SERVICE);
    if (repeateVibrate == null) {
      repeateVibrate = new Timer();
      final TimerTask task = new TimerTask() {
        @Override
        public void run() {
          v.vibrate(400);

        }
      };
      repeateVibrate.scheduleAtFixedRate(task, 0, 750);
    }
  }

  @ReactMethod
  public void cancelVibrate() {
    if (repeateVibrate != null) {
      repeateVibrate.cancel();
      repeateVibrate.purge();
      repeateVibrate = null;
    }
  }

  @ReactMethod
  public void stopService(Promise promise) {
    String result = "Success";
    try {
      Intent intent = new Intent(GeoLocationService.FOREGROUND);
      intent.setClass(this.getReactApplicationContext(), GeoLocationService.class);
      this.getReactApplicationContext().stopService(intent);
    } catch (Exception e) {
      promise.reject(e);
      return;
    }
    promise.resolve(result);
  }

  private void sendEvent(Location message) {
    WritableMap map = Arguments.createMap();
    WritableMap coordMap = Arguments.createMap();
    coordMap.putDouble("latitude", message.getLatitude());
    coordMap.putDouble("longitude", message.getLongitude());
    coordMap.putDouble("accuracy", message.getAccuracy());
    coordMap.putDouble("altitude", message.getAltitude());
    coordMap.putDouble("heading", message.getBearing());
    coordMap.putDouble("speed", message.getSpeed());

    map.putMap("coords", coordMap);
    map.putDouble("timestamp", message.getTime());

    getReactApplicationContext()
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit("updateLocation", map);
  }
}
