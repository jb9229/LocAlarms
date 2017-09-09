import {eventChannel} from "redux-saga";
import {take, put} from "redux-saga/effects";

const types = {
  startup: "startup",
  setLocation: "setLocation"
};
const actions = {
  [types.startup]: null,
  [types.setLocation]: null
};
const reducers = {
  [types.startup]: (state) => ({...state, ready: true}),
  [types.setLocation]: (state, {payload: geo}) => ({...state, location: geo})
};
const sagas = {
  [types.startup]: [startup]
};

function* startup(actionCreators) {
  let geo = yield new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, () => {
    });
  });
  yield put(actionCreators.setLocation(geo));

  const geoObservable = eventChannel(emitter => {
    const watchID = navigator.geolocation.watchPosition((location) => {
      emitter(location)
    }, () => {
    });
    return () => {
      navigator.geolocation.clearWatch(watchID);
    }
  });
  try {
    while (true) {
      // take(END) will cause the saga to terminate by jumping to the finally block
      geo = yield take(geoObservable);
      yield put(actionCreators.setLocation(geo));
    }
  } finally {

  }
}

export default {
  actions, reducers, sagas
};
