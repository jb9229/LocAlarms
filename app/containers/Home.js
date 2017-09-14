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
  View
} from "native-base";
import {Map} from "../components/maps/Map";
import {connect} from "react-redux";
import {actionDispatcher} from "../redux";
import {Metrics, Theme} from "../theme";
import {AlarmCard} from "../components/AlarmCard";
import {Routes} from "../navigation/AppNavigation";
import autobind from 'autobind-decorator';
import type {Alarm} from "../lib/Types";
import {namespaces, stateSelector} from "../redux/index";
import {generateActiveSchedule} from "../lib/Schedule";
import moment from "moment";
import Color from "color";

@connect(stateSelector(namespaces.alarms, namespaces.status, namespaces.preferences), actionDispatcher)
export class Home extends Component {
  scroll = new Animated.Value(0);
  fabScale = this.scroll.interpolate({
    inputRange: [0, 30],
    outputRange: [1, 0.01], // bug on android where scale 0 causes issues
    extrapolate: "clamp"
  });
  mapScale = this.scroll.interpolate({
    inputRange: [-35, 0],
    outputRange: [1.1, 1],
    extrapolateRight: "clamp"
  });
  headerUp = false;
  scrollRef;

  constructor(props) {
    super(props);
    this.state = {
      editPanelOpen: -1,
      menuOpen: false
    };
  }

  @autobind
  deleteAlarm(alarm) {
    this.props.actions.alarms.deleteAlarm(alarm.id);
    this.setState({
      editPanelOpen: -1
    });
  }

  @autobind
  editAlarm(alarm) {
    this.props.navigation.navigate(Routes.alarmEditor, {alarm});
    this.setState({
      editPanelOpen: -1
    });
  }

  filterPastAlarm() {
    const now = moment();
    return this.props.state.alarms.filter((alarm: Alarm) => generateActiveSchedule(alarm, now).some((schedule) => schedule.end.isAfter(now)));
  }

  render() {
    const alarms = this.props.state.preferences.showArchived ? this.props.state.alarms : this.filterPastAlarm();
    const fab = <Fab onPress={() => {
      this.props.navigation.navigate(Routes.alarmEditor);
    }}>
      <Icon name="add"/>
    </Fab>;
    return <Container>
      <Header>
        <Body>
        <Title>
          Your Alarms
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
            <View>
              {(alarms.length > 0) &&
              <Card>
                {alarms.map((alarm, i) => <AlarmCard alarm={alarm}
                                                     key={i}
                                                     onEditPanelOpen={() => {
                                                       this.setState({
                                                         editPanelOpen: i
                                                       });
                                                     }}
                                                     editPressed={this.editAlarm}
                                                     deletePressed={this.deleteAlarm}
                                                     editPanelOpen={this.state.editPanelOpen === i}/>)}
              </Card>}
            </View>
          </Content>
        </Animated.ScrollView>
      </View>
      {alarms.length > 0 ? <Animated.View style={[styles.fab, {transform: [{scale: this.fabScale}]}]}>
        {fab}
      </Animated.View> : fab}
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
