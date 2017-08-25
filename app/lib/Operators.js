export function objectMap(obj, mapFunction) {
  return Object.keys(obj).reduce((val, x) => {
    return Object.assign({}, val, {[x]: mapFunction(obj[x])})
  }, {})
}
