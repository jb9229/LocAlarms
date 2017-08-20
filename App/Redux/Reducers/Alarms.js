import {handleActions} from "redux-actions";
import {add, remove} from "../Actions/Alarms";
import {List} from "immutable";

export const reducer = handleActions({
  [add](state: List, {payload}) {
    return state.push(payload)
  },
  [remove](state, { payload }) {
    return state.remove(state.indexOf(payload));
  }
}, List());
