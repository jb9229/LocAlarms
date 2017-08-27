import React, {Component} from "react";
import PropTypes from "prop-types";
import {CardItem, Icon, Text} from "native-base";

export class AlarmCard extends Component {
  static propTypes = {
    alarm: PropTypes.object.isRequired
  };

  render() {
    return <CardItem>
      <Icon active name="alarm"/>
      <Text>{this.props.alarm.name}</Text>
    </CardItem>
  }
}
