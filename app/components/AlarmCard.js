import React, {Component} from "react";
import PropTypes from "prop-types";
import {Body, CardItem, Text, Title} from "native-base";
import {StyleSheet, TouchableOpacity} from "react-native";
import autobind from "autobind-decorator";
import {generateActiveSchedule, inWindow} from "../lib/Schedule";
import moment, {Moment} from "moment";

export class AlarmCard extends Component {
  static propTypes = {
    alarm: PropTypes.object.isRequired,
    pressed: PropTypes.func,
    time: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      timeText: this.getTimeTo(props.time)
    }
  }

  componentWillReceiveProps(next) {
    console.log(next);
    if (!next.time.isSame(this.props.time)) {
      this.setState({timeText: this.getTimeTo(next.time)});
    }
  }

  @autobind
  getTimeTo(now): string {
    const schedules = generateActiveSchedule(this.props.alarm, now);
    if (inWindow(now, schedules)) {
      return "Is active";
    }
    for (let schedule: { start: Moment, end: Moment } of schedules) {
      if (schedule.start.isAfter(now)) {
        return `Activates in ${moment.duration(schedule.start.diff(now)).humanize()}`;
      }
    }
    return "Is archived";
  }

  render() {
    return <TouchableOpacity onPress={this.props.pressed}>
      <CardItem>
        <Body>
        <Title inverse thin large>{this.props.alarm.name}</Title>
        <Text subtitle>{this.state.timeText}</Text>
        </Body>
      </CardItem>
    </TouchableOpacity>;
  }
}

const styles = StyleSheet.create({
  bordered: {
    borderBottomColor: "#aaaaaa",
    borderBottomWidth: 5
  }
});
