import React, {Component} from "react";
import {Body, Container, Content, Form, Header, Icon, Item, Label, Left, Right, Title, View} from "native-base";
import {StyleSheet, TouchableNativeFeedback, TouchableOpacity} from "react-native";
import {Routes} from "../navigation/AppNavigation";
import {connect} from "react-redux";
import {actionDispatcher, namespaces, stateSelector} from "../redux/index";
import {Picker, PickerModes} from "../components/forms/Picker";
import {getSoundFile, SoundFiles} from "../lib/Types";
import autobind from "autobind-decorator";
import Sound from "react-native-sound";
import {isDefined} from "../lib/Operators";

@connect(stateSelector(namespaces.preferences), actionDispatcher)
export class Preferences extends Component {
  state = {
    sound: null
  };

  @autobind
  playSound(val) {
    const setSound = () => {
      const sound = new Sound(getSoundFile(val), (error) => {
        if (!isDefined(error)) {
          sound.setNumberOfLoops(-1);
          sound.play();
        }
      });
      this.setState({sound});
    };
    if (isDefined(this.state.sound)) this.state.sound.stop(setSound);
    else setSound();
  }

  @autobind
  stopSound() {
    if (isDefined(this.state.sound)) this.state.sound.stop();
  }

  render() {
    return <Container>
      <Header>
        <Left>
          <TouchableOpacity onPress={() => {
            this.props.navigation.navigate(Routes.openDrawer);
          }}>
            <Icon name="menu" inverse/>
          </TouchableOpacity>
        </Left>
        <Body>
        <Title>
          Preferences
        </Title>
        </Body>
        <Right/>
      </Header>
      <Content>
        <Form>
          <Item style={styles.item}>
            <Label>
              Alarm sound
            </Label>
            <View style={styles.pickerContainer}>
              <Picker value={this.props.state.preferences.alarmSound}
                      mode={PickerModes.radio}
                      onChange={this.playSound}
                      cancel={this.stopSound}
                      values={[SoundFiles.digital, SoundFiles.buzzer, SoundFiles.beep]}
                      confirm={(val) => {
                        this.props.actions.preferences.setSound(val);
                        this.stopSound();
                      }}/>
            </View>
          </Item>
        </Form>
      </Content>
    </Container>;
  }
}

const styles = StyleSheet.create({
  item: {
    paddingVertical: 10,
    marginRight: 15
  },
  pickerContainer: {
    marginLeft: 7
  }
});
