import {checkAlarms} from "./checkAlarms";

module.exports = async () => {
  await checkAlarms();
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve();
      console.log("done");
    }, 5000);
  });
};
