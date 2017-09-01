import React, {Component} from "react";
import PropTypes from "prop-types";
import {Body, CardItem, Icon, Text, Title, View} from "native-base";
import {Animated, StyleSheet, TouchableOpacity} from "react-native";
import {Theme} from "../theme";

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

  pressed() {
    const closed = this.animatedHeight.__getValue() === 0;
    if (closed) {
      this.props.onEditPanelOpen();
    }
    const config = {toValue: closed ? EDIT_PANEL_HEIGHT : 0, duration: 200};
    Animated.timing(this.animatedHeight, config).start();
  }

  componentWillReceiveProps(next) {
    if (next.editPanelOpen === false && this.animatedHeight.__getValue() !== 0) {
      Animated.timing(this.animatedHeight, {toValue: 0, duration: 200}).start();
    }
  }

  render() {
    return <CardItem bordered>
      <Body>
      <Title inverse thin large>6:00 PM</Title>
      <Text subtitle>{this.props.alarm.name}</Text>
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
        <TouchableOpacity style={styles.right} onPress={() => {
          this.pressed();
        }}>
          <Animated.View style={{transform: [{rotate: this.arrowOrientation}]}}>
            <Icon name="ios-arrow-down" small/>
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
