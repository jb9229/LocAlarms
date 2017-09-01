export function objectMap(obj, valMap, keyMap: ?(key) => any) {
  return Object.keys(obj).reduce((val, x) => {
    const key = keyMap ? keyMap(x) : x;
    return Object.assign({}, val, {[key]: valMap(obj[x], key)})
  }, {})
}

export function arrReplace<T>(array: T[], matchFn: (elem: T, index: number) => boolean, replaceObj: T) {
  const index = arrSearch(array, matchFn);
  return index !== null ? [...array.slice(0, index), replaceObj, ...array.slice(index + 1, array.length)] : array;
}

export function arrPush<T>(array: T[], elem: T) {
  return [...array, elem];
}

export function arrRemove<T>(array: T[], matchFn: (elem: T, index: number) => boolean) {
  const index = arrSearch(array, matchFn);
  return index !== null ? [...array.slice(0, index), ...array.slice(index + 1, array.length)] : array;
}

export function arrSearch<T>(array: T[], matchFn: (elem: T, index: number) => boolean) {
  let index;
  array.forEach((x, i) => {
    if (matchFn(x, i)) {
      index = i;
    }
  });
  return index;
}
