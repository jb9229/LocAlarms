import React, {Component} from "react";
import {Body, Container, Header, Icon, Left, Title} from "native-base";
import {connect} from "react-redux";
import {actionDispatcher} from "../redux";
import {AlarmForm} from "../components/AlarmForm";
import {TouchableOpacity} from "react-native";

export class AddAlarm extends Component {
  render() {
    return <Container>
      <Header>
        <Left>
          <TouchableOpacity onPress={() => {
            this.props.navigation.goBack();
          }}>
            <Icon name="arrow-back" inverse/>
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
