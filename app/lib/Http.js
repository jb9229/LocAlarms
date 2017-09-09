export function getRequest(base, params) {
  let query = Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');
  return fetch(`${base}?${query}`).then(res => res.json());
}
