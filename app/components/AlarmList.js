import React, {Component} from "react";
import PropTypes from "prop-types";
import {ListView, StyleSheet, View} from "react-native";
import {Button, Icon, List} from "native-base";
import {AlarmCard} from "./AlarmCard";
import type {Alarm} from "../lib/Types";

export class AlarmList extends Component {
  static propTypes = {
    alarms: PropTypes.array,
    editPressed: PropTypes.func,
    deletePressed: PropTypes.func
  };

  render() {
    const renderDelete = alarm =>
      <Button full danger onPress={() => this.props.deletePressed(alarm)}>
        <Icon active name="trash"/>
      </Button>;
    return <View>
      {this.props.alarms.length > 0 &&
      <List dataSource={new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }).cloneWithRows(this.props.alarms)}
            renderRow={(data: Alarm & { timeTo: number }) =>
              <View style={styles.bordered}>
                <AlarmCard alarm={data}
                           timeTo={data.timeTo}
                           pressed={() => this.props.editPressed(data)}/>
              </View>}
            style={styles.whiteBg}
            renderLeftHiddenRow={renderDelete}
            renderRightHiddenRow={renderDelete}
            leftOpenValue={75}
            rightOpenValue={-75}/>}
    </View>;
  }
}

const styles = StyleSheet.create({
  whiteBg: {
    backgroundColor: "white"
  },
  bordered: {
    borderBottomColor: "#aaaaaa", borderBottomWidth: 2 * StyleSheet.hairlineWidth
  }
});
