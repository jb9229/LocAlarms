import _ from "lodash";

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

