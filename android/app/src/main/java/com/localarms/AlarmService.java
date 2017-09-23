package com.localarms;

import android.content.Intent;
import android.os.IBinder;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;

import javax.annotation.Nullable;

public class AlarmService extends HeadlessJsTaskService {
  @Override
  protected @Nullable
  HeadlessJsTaskConfig getTaskConfig(Intent intent) {
    System.out.println("task config!");
    return new HeadlessJsTaskConfig(
      "checkAlarms",
      null,
      10000, true);
  }

  public void onCreate() {
    super.onCreate();
  }

  @Override
  public IBinder onBind(Intent intent) {
    return null;
  }
}
