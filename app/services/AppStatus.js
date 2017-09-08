import {NetInfo} from "react-native";

export class AppStatusService {
  static connected: boolean = false;

  static start() {
    NetInfo.isConnected.fetch().then(isConnected => {
      AppStatusService.connected = isConnected;
    });
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      (isConnected) => {
        AppStatusService.connected = isConnected;
      }
    );
  }
}
