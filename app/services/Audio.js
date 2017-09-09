import Sound from "react-native-sound";
import {isDefined} from "../lib/NullCheck";

// Enable playback in silence mode (iOS only)
Sound.setCategory('Playback');

export class AudioService {
  static sounds: Map<string, Sound> = new Map();

  /**
   *
   * @param requireSound File returned by require
   * @param id
   */
  static loop(requireSound: any, id: string) {
    if (!isDefined(AudioService.sounds.get(id))) {
      let sound = new Sound(requireSound, (error: ?any) => {
        if (error) {
          return;
        }
        sound.setNumberOfLoops(-1);
        sound.play();
      });
      AudioService.sounds.set(id, sound);
    }
  }

  static stop(id: string) {
    const sound = AudioService.sounds.get(id);
    if (sound) sound.stop();
  }
}
