package com.localarms;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Handler;
import android.os.Looper;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.UiThreadUtil;

public class Alarm extends BroadcastReceiver {
  @Override
  public void onReceive(final Context context, Intent intent) {
    final Intent service = new Intent(context, AlarmService.class);

    HeadlessJsTaskService.acquireWakeLockNow(context);
    UiThreadUtil.runOnUiThread(new Runnable() {
      @Override
      public void run() {
        context.startService(service);
      }
    });

  }

  public void setAlarm(Context context) {
    System.out.println("set alarm!!!!!");
    AlarmManager am = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
    Intent i = new Intent(context, Alarm.class);
    PendingIntent pi = PendingIntent.getBroadcast(context, 0, i, 0);
    am.setRepeating(AlarmManager.RTC, System.currentTimeMillis(), 1000 * 60, pi);
  }
}
