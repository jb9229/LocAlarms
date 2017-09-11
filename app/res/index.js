import Sound from "react-native-sound";
const beep = new Sound(require("./audio/Beep.mp3"), (err) => {
  if (!err) beep.setNumberOfLoops(-1)
});
const buzzer = new Sound(require("./audio/Buzzer.mp3"), (err) => {
  if (!err) buzzer.setNumberOfLoops(-1)
});
const digital = new Sound(require("./audio/Digital.mp3"), (err) => {
  if (!err) digital.setNumberOfLoops(-1)
});
export {
  beep,
  buzzer,
  digital
};
