import React, {Component} from 'react';
import {Animated, Modal, StyleSheet, TouchableNativeFeedback, TouchableOpacity} from 'react-native';
import {
  Body,
  Card,
  CardItem,
  Container,
  Content,
  Fab,
  Header,
  Icon,
  Right,
  Switch,
  Text,
  Title,
  Toast,
  View
} from "native-base";
import {Map} from "../components/maps/Map";
import {connect} from "react-redux";
import {actionDispatcher, namespaces, stateSelector} from "../redux";
import {Metrics, Theme} from "../theme";
import {Routes} from "../navigation/AppNavigation";
import autobind from 'autobind-decorator';
import type {Alarm} from "../lib/Types";
import {generateActiveSchedule, inWindow} from "../lib/Schedule";
import moment, {Moment} from "moment";
import Color from "color";
import _ from "lodash";
import {AlarmList} from "../components/AlarmList";
import {execEvery} from "../lib/Operators";

@connect(stateSelector(namespaces.alarms, namespaces.status, namespaces.preferences), actionDispatcher)
export class Home extends Component {
  scroll = new Animated.Value(0);
  mapScale = this.scroll.interpolate({
    inputRange: [-35, 0],
    outputRange: [1.1, 1],
    extrapolateRight: "clamp"
  });
  state = {
    menuOpen: false,
    ignoredIds: [],
    time: moment().startOf("m")
  };

  stop = execEvery(() => {
    this.setState({
      time: moment().startOf("m")
    });
  }, 60000);

  componentWillUnmount() {
    this.stop();
  }

  @autobind
  editAlarm(alarm) {
    this.props.navigation.navigate(Routes.alarmEditor, {alarm});
  }

  @autobind
  deleteAlarm(alarm: Alarm) {
    const delay = 5000;
    const id = setTimeout(() => {
      this.props.actions.alarms.deleteAlarm(alarm.id);
    }, delay);
    Toast.show({
      text: `${alarm.name} was deleted`,
      position: 'bottom',
      buttonText: 'Undo',
      onClose: () => {
        clearTimeout(id);
        this.setState((prev) => ({
          ignoredIds: _.without(prev.ignoredIds, alarm.id)
        }));
      },
      duration: delay
    });
    this.setState((prev) => ({
      ignoredIds: [...prev.ignoredIds, alarm.id]
    }));
  }

  processAlarms() {
    const now = this.state.time;
    const schedules = this.props.state.alarms.reduce((obj, alarm: Alarm) => ({
      ...obj,
      [alarm.id]: generateActiveSchedule(alarm, now)
    }), {});
    return this.props.state.alarms
      .filter((alarm) => this.props.state.preferences.showArchived || schedules[alarm.id].some((schedule) => schedule.end.isAfter(now)))
      .filter((alarm) => !_.includes(this.state.ignoredIds, alarm.id))
      .map((alarm) => ({...alarm, timeTo: this.getTimeTo(alarm, now, schedules[alarm.id])}))
      .sort((a: Alarm & {timeTo: number}, b: Alarm & {timeTo: number}) => {
        return a.timeTo - b.timeTo;
      });
  }

  @autobind
  getTimeTo(alarm, now, schedules=generateActiveSchedule(alarm, now)): string {
    if (inWindow(now, schedules)) {
      return 0;
    }
    for (let schedule: { start: Moment, end: Moment } of schedules) {
      if (schedule.start.isAfter(now)) {
        return moment.duration(schedule.start.diff(now)).asMilliseconds();
      }
    }
    return -1;
  }

  render() {
    const alarms = this.processAlarms();
    return <Container>
      <Header>
        <Body>
        <Title>
          Geo Alarms
        </Title>
        </Body>
        <Right>
          <TouchableOpacity style={styles.horizontalPadding} onPress={() => {
            this.setState({menuOpen: true});
          }}>
            <Icon name="more" inverse/>
          </TouchableOpacity>
        </Right>
      </Header>
      <Modal transparent visible={this.state.menuOpen} animationType="fade" onRequestClose={() => {
      }}>
        <TouchableOpacity style={[StyleSheet.absoluteFill, styles.menuHideDetector]}
                          activeOpacity={0}
                          onPress={() => {
                            this.setState({menuOpen: false});
                          }}>
          <Card style={styles.menuCard}>
            <TouchableNativeFeedback onPress={() => {
              this.props.actions.preferences.setShowArchived(!this.props.state.preferences.showArchived);
            }}>
              <CardItem>
                <Text>Show archived alarms</Text>
                <Switch value={this.props.state.preferences.showArchived}
                        disabled
                        thumbTintColor={Theme.brandPrimary}
                        onTintColor={Color(Theme.brandPrimary).lighten(0.8).string()}
                        tintColor="lightgrey"/>
              </CardItem>
            </TouchableNativeFeedback>
          </Card>
        </TouchableOpacity>
      </Modal>
      <View>
        <Animated.ScrollView
          onScroll={Animated.event([{nativeEvent: {contentOffset: {y: this.scroll}}}], {useNativeDriver: true})}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={2}>
          <Animated.View style={[alarms.length > 0 ? styles.alarmMap : styles.noAlarmMap, {
            transform: [{translateY: Animated.divide(this.scroll, 4)}, {scale: this.mapScale}]
          }]}>
            <Map location={this.props.state.status.location}
                 locations={alarms.map((alarm: Alarm) => ({
                   ...alarm.location,
                   radius: alarm.radius,
                   title: alarm.name
                 }))}/>
          </Animated.View>
          <Content>
            <AlarmList alarms={alarms} editPressed={this.editAlarm} deletePressed={this.deleteAlarm}/>
          </Content>
        </Animated.ScrollView>
      </View>
      <Fab onPress={() => {
        this.props.navigation.navigate(Routes.alarmEditor);
      }}>
        <Icon name="add"/>
      </Fab>
    </Container>;
  }
}

const styles = StyleSheet.create({
  noAlarmMap: {
    height: Metrics.screenHeight - Theme.toolbarHeight
  },
  alarmMap: {
    height: Metrics.screenHeight * 0.85 - Theme.toolbarHeight
  },
  whiteBg: {backgroundColor: "white"},
  fab: {
    position: "absolute",
    bottom: 0,
    right: 0,
    height: 100,
    width: 100
  },
  horizontalPadding: {
    paddingHorizontal: 10
  },
  leftPadding: {
    paddingLeft: 15
  },
  menuHideDetector: {
    elevation: 100,
    zIndex: 100
  },
  menuCard: {
    position: "absolute", right: 0, top: Theme.toolbarHeight - 5
  }
});
