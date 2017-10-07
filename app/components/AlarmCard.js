import React, {Component} from "react";
import PropTypes from "prop-types";
import {Body, CardItem, Text, Title} from "native-base";
import {StyleSheet, TouchableOpacity, View} from "react-native";
import moment from "moment";

export class AlarmCard extends Component {
  static propTypes = {
    alarm: PropTypes.object.isRequired,
    pressed: PropTypes.func,
    longPressed: PropTypes.func,
    timeTo: PropTypes.number.isRequired
  };

  getTimeText() {
    if (this.props.timeTo === 0) return "Is active";
    else if (this.props.timeTo === -1) return "Is archived";
    else return moment.duration(this.props.timeTo).humanize();
  }

  render() {
    return <TouchableOpacity onPress={this.props.pressed} onLongPress={this.props.longPressed}>
      <View>
        <CardItem>
          <Body>
          <Title inverse thin large>{this.props.alarm.name}</Title>
          <Text subtitle>{this.getTimeText()}</Text>
          </Body>
        </CardItem>
      </View>
    </TouchableOpacity>;
  }
}

const styles = StyleSheet.create({
  bordered: {
    borderBottomColor: "#aaaaaa",
    borderBottomWidth: 5
  }
});
