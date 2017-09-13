import _ from "lodash";
import BackgroundTimer from "react-native-background-timer";

export function objectMap(obj, valMap, keyMap: ?(key) => any) {
  return Object.keys(obj).reduce((val, x) => {
    const key = keyMap ? keyMap(x) : x;
    return Object.assign({}, val, {[key]: valMap(obj[x], key)});
  }, {});
}

/**
 * Returns if a list of objects has entries where every property is defined
 * @param array
 */
export function all(array: any[]): boolean {
  return array.every(obj => allProperties(obj));
}

export function allProperties(obj): boolean {
  return Object.keys(obj).every((key) => {
    if (!_.isNull(obj[key]) && _.isObject(obj[key])) {
      return allProperties(obj[key]);
    } else {
      return isDefined(obj[key]);
    }
  });
}

export function isDefined(x) {
  return !_.isNull(x) && !_.isUndefined(x);
}

/**
 * Returns a list of objects where items have all values defined
 * @param array
 */
export function filterUndefined(array: any[]): any[] {
  return array.filter(allProperties);
}

export function execEvery(fn, ms, useBg = false) {
  let now = new Date(), delay = ms - now % ms;
  let id;
  if (useBg) {
    BackgroundTimer.setTimeout(() => {
      fn();
      id = BackgroundTimer.setInterval(fn, ms)
    }, delay);
    return () => {BackgroundTimer.clearInterval(id)}
  } else {
    setTimeout(() => {
      fn();
      id = setInterval(fn, ms);
    });
    return () => clearInterval(id);
  }
}
