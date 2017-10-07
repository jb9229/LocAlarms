import React, {Component} from "react";
import {Body, Container, Header, Left, Right, Title} from "native-base";
import {connect} from "react-redux";
import {actionDispatcher} from "../redux";
import {AlarmForm} from "../components/forms/AlarmForm";
import idx from "idx";
import {isDefined} from "../lib/Operators";
import {namespaces, stateSelector} from "../redux/index";
import {HeaderBackButton} from "react-navigation";
import {StyleSheet, View} from "react-native";

@connect(stateSelector(namespaces.status), actionDispatcher)
export class AlarmEditor extends Component {
  render() {
    const initialAlarm = idx(this.props, props => props.navigation.state.params.alarm);
    return <Container>
      <Header>
        <Left>
          <View style={styles.headerBack}>
            <HeaderBackButton
              pressColorAndroid="#f0f0f0"
              tintColor="white"
              onPress={() => {
                this.props.navigation.goBack();
              }}/>
          </View>
        </Left>
        <Body>
        <Title>{isDefined(initialAlarm) ? "Edit Alarm" : "Add Alarm"}</Title>
        </Body>
        <Right/>
      </Header>
      <AlarmForm
        location={this.props.state.status.location}
        connected={this.props.state.status.isConnected}
        onSubmit={(values) => {
          this.props.actions.alarms.alarmFormSubmit(values, initialAlarm);
          this.props.navigation.goBack();
        }}
        initialAlarm={initialAlarm}/>
    </Container>;
  }
}

const styles = StyleSheet.create({
  headerBack: {marginLeft: -10}
});
