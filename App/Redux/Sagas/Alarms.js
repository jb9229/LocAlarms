export function* logger(api, action) {
  console.log(api);
  console.log("this is action", action);
}
