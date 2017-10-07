import React, {Component} from "react";
import PropTypes from "prop-types";
import {ListView, View, StyleSheet} from "react-native";
import {Button, Icon, List} from "native-base";
import {AlarmCard} from "./AlarmCard";
import type {Alarm} from "../lib/Types";
import moment, {Moment} from "moment";
import {execEvery} from "../lib/Operators";

export class AlarmList extends Component {
  static propTypes = {
    alarms: PropTypes.array,
    editPressed: PropTypes.func,
    deletePressed: PropTypes.func
  };

  state = {
    time: moment().startOf("m")
  };

  stop = execEvery(() => {
    console.log(moment().startOf("m"));
    this.setState({
      time: moment().startOf("m")
    });
  }, 60000);

  componentWillUnmount() {
    this.stop();
  }

  render() {
    const alarms = this.props.alarms.map((alarm)=> ({
      ...alarm,
      time: moment()
    }));
    const renderDelete = alarm =>
      <Button full danger onPress={() => {
        this.deleteAlarm(alarm);
      }}>
        <Icon active name="trash"/>
      </Button>;
    return <View>
      {alarms.length > 0 &&
      <List dataSource={new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(alarms)}
            renderRow={(data: Alarm & { time: Moment }) =>
              <View style={{borderBottomColor: "#aaaaaa", borderBottomWidth: 2 * StyleSheet.hairlineWidth}}>
              <AlarmCard alarm={data}
                         time={data.time}
                         pressed={() => this.props.editPressed(data)}
                         style={{
                           borderColor: "#aaaaaa",
                           borderWidth: 5
                         }}/>
              </View>
                }
            renderLeftHiddenRow={renderDelete}
            renderRightHiddenRow={renderDelete}
            leftOpenValue={75}
            style={{backgroundColor: "white"}}
            rightOpenValue={-75}/>
      }
    </View>;
  }
}
