package com.localarms;

import android.content.Intent;
import android.os.IBinder;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;

import javax.annotation.Nullable;

public class AlarmService extends HeadlessJsTaskService {
  long lastActive = 0;

  @Override
  protected @Nullable
  HeadlessJsTaskConfig getTaskConfig(Intent intent) {
    long current = System.currentTimeMillis();
    if ((current - lastActive) >= 30 * 1000)
      return new HeadlessJsTaskConfig(
        "checkAlarms",
        null,
        10000, true);
    else return null;
  }

  public void onCreate() {
    super.onCreate();
  }

  @Override
  public IBinder onBind(Intent intent) {
    return null;
  }
}
