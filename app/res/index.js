import Sound from "react-native-sound";

const beep = new Sound("beep.mp3", Sound.MAIN_BUNDLE, (err) => {
  if (!err) beep.setNumberOfLoops(-1);
});
const buzzer = new Sound("buzzer.mp3", Sound.MAIN_BUNDLE, (err) => {
  if (!err) buzzer.setNumberOfLoops(-1);
});
const digital = new Sound("digital.mp3", Sound.MAIN_BUNDLE, (err) => {
  if (!err) digital.setNumberOfLoops(-1);
});
export {
  beep,
  buzzer,
  digital
};
