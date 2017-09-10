import React, {Component} from "react";
import {Body, Container, Content, Form, Header, Icon, Item, Label, Left, Right, Title, View} from "native-base";
import {StyleSheet, TouchableOpacity} from "react-native";
import {Routes} from "../navigation/AppNavigation";
import {connect} from "react-redux";
import {actionDispatcher, namespaces, stateSelector} from "../redux/index";
import {Picker, PickerModes} from "../components/forms/Picker";
import {SoundFiles} from "../lib/Types";

@connect(stateSelector(namespaces.preferences), actionDispatcher)
export class Preferences extends Component {
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
                      values={[SoundFiles.analogue, SoundFiles.digital]}
                      onChange={this.props.actions.preferences.setSound}/>
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
