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
import {generateActiveSchedule} from "../lib/Schedule";
import moment from "moment";
import Color from "color";
import _ from "lodash";
import {AlarmList} from "../components/AlarmList";

@connect(stateSelector(namespaces.alarms, namespaces.status, namespaces.preferences), actionDispatcher)
export class Home extends Component {
  scroll = new Animated.Value(0);
  mapScale = this.scroll.interpolate({
    inputRange: [-35, 0],
    outputRange: [1.1, 1],
    extrapolateRight: "clamp"
  });
  scrollRef;
  state = {
    menuOpen: false,
    ignoredIds: []
  };

  @autobind
  editAlarm(alarm) {
    this.props.navigation.navigate(Routes.alarmEditor, {alarm});
  }

  @autobind
  deleteAlarm(alarm: Alarm) {
    const delay = 5000;
    const id = setTimeout(() => {
      this.props.deletePressed(alarm);
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

  filterPastAlarm() {
    const now = moment();
    return this.props.state.alarms.map((alarm) => ({
      ...alarm,
      isArchived: generateActiveSchedule(alarm, now).some((schedule) => schedule.end.isAfter(now))
    })).filter((alarm) => this.props.state.preferences.showArchived ? true : alarm.isArchived)
      .filter((alarm) => !_.includes(this.state.ignoredIds, alarm.id));
  }

  render() {
    const alarms = this.filterPastAlarm();
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
          ref={(elem) => {
            if (!this.scrollRef && elem && elem._component) this.scrollRef = elem._component;
          }}
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
