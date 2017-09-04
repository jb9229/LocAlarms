import React, {Component} from "react";
import {Body, Container, Header, Icon, Left, Title} from "native-base";
import {connect} from "react-redux";
import {actionDispatcher} from "../redux";
import {AlarmForm} from "../components/forms/AlarmForm";
import {TouchableOpacity} from "react-native";
import idx from "idx";

@connect(null, actionDispatcher)
export class AlarmEditor extends Component {
  render() {
    const initialAlarm = idx(this.props, props => props.navigation.state.params.alarm);
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
      <AlarmForm
        onSubmit={(values) => {
          this.props.alarms.alarmFormSubmit(values, initialAlarm);
          this.props.navigation.goBack();
        }}
        initialAlarm={initialAlarm}/>
    </Container>;
  }
}
