import Immutable from 'immutable'
import {createTransform} from "redux-persist";

export const immutableTransform = createTransform(
  (inboundState) => Immutable.isImmutable(inboundState) ? inboundState.toJS() : inboundState,
  (outboundState) => Immutable.fromJS(outboundState)
);
