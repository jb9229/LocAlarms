import React, {Component} from "react";
import {Field} from "redux-form";
import {attachRender, createFields, formTypes} from "../../lib/ReduxForm";
import {CheckBox, Item, Label, Text} from "native-base";
import {StyleSheet, View} from "react-native";
import autobind from "autobind-decorator";
import {isDefined} from "../../lib/Operators";
import {getSoundFile, SoundFiles} from "../../lib/Types";
import {Picker, PickerModes} from "./Picker";
import {Theme} from "../../theme";

export const fieldData = createFields({
  alarmSound: {initialValue: SoundFiles.digital, label: "Alarm sound", type: formTypes.radio},
  vibrate: {initialValue: true, label: "Vibrate", type: formTypes.checkbox}
});

export class PreferencesForm extends Component {
  fields = attachRender(fieldData, this.renderInput);
  state = {
    sound: null
  };

  @autobind
  playSound(val) {
    const setSound = () => {
      const sound = getSoundFile(val);
      sound.play();
      this.setState({sound});
    };
    if (isDefined(this.state.sound)) this.state.sound.stop(setSound);
    else setSound();
  }

  @autobind
  stopSound() {
    if (isDefined(this.state.sound)) this.state.sound.stop();
  }


  constructor(props) {
    super(props);
  }

  @autobind
  renderInput({input, label, type}) {
    switch (type) {
      case formTypes.radio:
        return <Item style={styles.item}>
          <Label>{label}</Label>
          <View style={styles.pickerContainer}>
            <Picker value={input.value}
                    onChange={this.playSound}
                    cancel={this.stopSound}
                    confirm={(val) => {
                      input.onChange(val);
                      this.stopSound();
                    }}
                    mode={PickerModes.radio}
                    values={[SoundFiles.digital, SoundFiles.buzzer, SoundFiles.beep]}/>
          </View>
        </Item>;
      case formTypes.checkbox:
        return <Item style={styles.item}>
          <Label>{label}</Label>
          <CheckBox color={Theme.brandPrimary}
                    checked={input.value}
                    onPress={() => {
                      input.onChange(!input.value);
                    }}/>
        </Item>;
    }
  }

  render() {
    return <View>
      <Item itemDivider>
        <Text>Preferences</Text>
      </Item>
      <Field {...this.fields.alarmSound}/>
      <Field {...this.fields.vibrate}/>
    </View>;
  }
}

const styles = StyleSheet.create({
  item: {
    paddingVertical: 8,
    marginRight: 15
  },
  pickerContainer: {
    marginLeft: 7
  }
});
