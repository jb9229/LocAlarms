import React, {Component} from "react";
import {Body, Container, Header, Icon, Left, Title} from "native-base";
import {connect} from "react-redux";
import {actionDispatcher} from "../Redux";
import {AlarmForm} from "../Components/AlarmForm";
import {TouchableOpacity} from "react-native";

export class AddAlarm extends Component {
  render() {
    return <Container>
      <Header>
        <Left>
          <TouchableOpacity onPress={() => {this.props.navigation.navigate('DrawerOpen')}}>
          <Icon name="menu" inverse/>
          </TouchableOpacity>
        </Left>
        <Body>
        <Title>Redux Form</Title>
        </Body>
      </Header>
      <AlarmForm/>
    </Container>
  }
}

export const AddAlarmContainer = connect(null, actionDispatcher)(AddAlarm);
