import {eventChannel} from "redux-saga";
import {put, take} from "redux-saga/effects";

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
      let geo = yield take(geoObservable);
      yield put(actionCreators.setLocation(geo));
    }
  } finally {

  }
}

export default {
  actions, reducers, sagas
};
