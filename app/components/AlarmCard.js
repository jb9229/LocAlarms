import React, {Component} from "react";
import PropTypes from "prop-types";
import {Body, CardItem, Icon, Text, Title, View} from "native-base";
import {Animated, StyleSheet, TouchableOpacity} from "react-native";
import {Theme} from "../theme";
import autobind from "autobind-decorator";
import {generateActiveSchedule, inWindow} from "../lib/Schedule";
import moment, {Moment} from "moment";
import {execEvery} from "../lib/Operators";

const EDIT_PANEL_HEIGHT = 35;

export class AlarmCard extends Component {
  static propTypes = {
    alarm: PropTypes.object.isRequired,
    onEditPanelOpen: PropTypes.func,
    editPanelOpen: PropTypes.bool,
    editPressed: PropTypes.func,
    deletePressed: PropTypes.func
  };
  animatedHeight = new Animated.Value(0);
  arrowOrientation = this.animatedHeight.interpolate({
    inputRange: [0, EDIT_PANEL_HEIGHT],
    outputRange: ['0deg', '180deg']
  });
  closed = true;
  stop;

  constructor(props) {
    super(props);
    this.stop = execEvery(() => {
      this.forceUpdate();
    }, 60000);
  }

  componentWillUnmount() {
    if (this.stop) this.stop();
  }

  @autobind
  pressed() {
    if (this.closed) {
      this.props.onEditPanelOpen();
    }
    const config = {toValue: this.closed ? EDIT_PANEL_HEIGHT : 0, duration: 300};
    Animated.timing(this.animatedHeight, config).start();
    this.closed = !this.closed;
  }

  componentWillReceiveProps(next) {
    if (next.editPanelOpen === false && !this.closed) {
      Animated.timing(this.animatedHeight, {toValue: 0, duration: 300}).start();
      this.closed = true;
    }
  }

  @autobind
  getTimeTo(): string {
    const now = moment();
    const schedules = generateActiveSchedule(this.props.alarm, now, false);
    if (inWindow(now, schedules)) {return "Is active"}
    for (let schedule: { start: Moment, end: Moment } of schedules) {
      if (schedule.start.isAfter(now)) {
        return `Activates in ${moment.duration(schedule.start.diff(now)).humanize()}`;
      }
    }
    return "Is archived";
  }

  render() {
    return <CardItem bordered>
      <Body>
      <Title inverse thin large>{this.props.alarm.name}</Title>
      <Text subtitle>{this.getTimeTo()}</Text>
      <View style={styles.fullWidth}>
        <Animated.View style={[styles.editPanel, {height: this.animatedHeight}]}>
          <TouchableOpacity style={styles.item} onPress={() => {
            this.props.editPressed(this.props.alarm);
          }}>
            <View style={styles.editPanelItem}>
              <Icon name="build" small style={[styles.editPanelIcon, styles.green]}/>
              <Text style={styles.green}>Edit</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={() => {
            this.props.deletePressed(this.props.alarm);
          }}>
            <View style={styles.editPanelItem}>
              <Icon name="trash" small style={[styles.editPanelIcon, styles.red]}/>
              <Text style={styles.red}>Delete</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
        <TouchableOpacity style={styles.right} onPress={this.pressed}>
          <Animated.View style={{transform: [{rotate: this.arrowOrientation}]}}>
            <Icon name="ios-arrow-down"/>
          </Animated.View>
        </TouchableOpacity>
      </View>
      </Body>
    </CardItem>;
  }
}

const styles = StyleSheet.create({
  editPanel: {
    flexDirection: "row"
  },
  fullWidth: {
    width: "100%"
  },
  right: {
    alignSelf: "flex-end"
  },
  editPanelItem: {
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center"
  },
  editPanelIcon: {
    marginRight: 10
  },
  green: {
    color: Theme.brandSuccess
  },
  red: {
    color: Theme.brandDanger
  },
  item: {
    flex: 1
  }
});
