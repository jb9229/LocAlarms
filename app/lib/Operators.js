export function objectMap(obj, valMap, keyMap: ?(key) => any) {
  return Object.keys(obj).reduce((val, x) => {
    const key = keyMap ? keyMap(x) : x;
    return Object.assign({}, val, {[key]: valMap(obj[x], key)});
  }, {});
}
