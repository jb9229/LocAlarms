export function objectMap(obj, mapFunction, keyMap: ?(key) => any) {
  return Object.keys(obj).reduce((val, x) => {
    let key = keyMap ? keyMap(x) : x;
    return Object.assign({}, val, {[key]: mapFunction(obj[x], key)})
  }, {})
}
