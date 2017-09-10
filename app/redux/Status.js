import {NetInfo} from "react-native";
import {eventChannel} from "redux-saga";
import {all, call, put, take} from "redux-saga/effects";
import Sound from "react-native-sound";
import Notification from "react-native-push-notification";

const types = {
  startup: "startup",
  setLocation: "setLocation",
  setConnected: "setConnected"
};
const actions = {
  [types.startup]: null,
  [types.setLocation]: null,
  [types.setConnected]: null
};
const reducers = {
  [types.startup]: (state) => ({...state, ready: true}),
  [types.setLocation]: (state, {payload: geo}) => ({...state, location: geo}),
  [types.setConnected]: (state, {payload: isConnected}) => ({...state, isConnected})
};
const sagas = {
  [types.startup]: [startup]
};

function* startup(actionCreators) {
  yield call(setup);
  yield all([call(geo, actionCreators), call(network, actionCreators)]);
}

function* setup() {
  Sound.setCategory('Playback');
  Notification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: (token) => {
      console.log('TOKEN:', token);
    },
    // (required) Called when a remote or local notification is opened or received
    onNotification: (notification) => {
      console.log('NOTIFICATION:', notification);
    },
    senderID: "204453940088",
    permissions: {
      alert: true,
      badge: true,
      sound: true
    },
    popInitialNotification: true,
    requestPermissions: true
  });
}

function* geo(actionCreators) {
  const geoObservable = eventChannel(emitter => {
    navigator.geolocation.getCurrentPosition(emitter, () => {
    });
    const watchID = navigator.geolocation.watchPosition(emitter, () => {
    });
    return () => {
      navigator.geolocation.clearWatch(watchID);
    };
  });
  try {
    while (true) {
      // take(END) will cause the saga to terminate by jumping to the finally block
      yield put(actionCreators.setLocation(yield take(geoObservable)));
    }
  } finally {

  }
}

function* network(actionCreators) {
  const isConnected = eventChannel(emit => {
    NetInfo.isConnected.fetch().then(emit);
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      emit
    );
    return () => {
      NetInfo.isConnected.removeEventListener('connectionChange');
    };
  });
  try {
    while (true) {
      yield put(actionCreators.setConnected(yield take(isConnected)));
    }
  } finally {

  }
}

export default {
  actions, reducers, sagas
};
