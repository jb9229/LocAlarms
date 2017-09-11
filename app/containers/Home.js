import React, {Component} from 'react';
import {Animated, StyleSheet, TouchableOpacity} from 'react-native';
import {Body, Card, Container, Content, Fab, Header, Icon, Left, Right, Title, View} from "native-base";
import {Map} from "../components/maps/Map";
import {connect} from "react-redux";
import {actionDispatcher} from "../redux";
import {Metrics, Theme} from "../theme";
import {AlarmCard} from "../components/AlarmCard";
import {Routes} from "../navigation/AppNavigation";
import autobind from 'autobind-decorator';
import type {Alarm} from "../lib/Types";
import {namespaces, stateSelector} from "../redux/index";

@connect(stateSelector(namespaces.alarms, namespaces.status), actionDispatcher)
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
  fabTranslate = new Animated.Value(0);
  headerUp = false;
  scrollRef;

  constructor(props) {
    super(props);
    this.state = {
      editPanelOpen: -1
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

  @autobind
  mapPressed() {
    Animated.timing(this.fabTranslate, {
      toValue: this.headerUp ? 0 : 100,
      duration: 200,
      useNativeDriver: true
    }).start();
    this.headerUp = !this.headerUp;
  }

  render() {
    const alarms = this.props.state.alarms;
    const fab = <Fab onPress={() => {
      this.props.navigation.navigate(Routes.alarmEditor);
    }}>
      <Icon name="add"/>
    </Fab>;
    return <Container>
      <Header>
        <Body>
        <Title>
          Alarms
        </Title>
        </Body>
        <Right/>
      </Header>
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
                 onPress={() => {
                   if (alarms.length === 0) this.mapPressed();
                 }}
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
      {alarms.length > 0 ?
        <Animated.View style={[styles.fab, {transform: [{scale: this.fabScale}]}]}>
          {fab}
        </Animated.View> :
        <Animated.View style={[styles.fab, {transform: [{translateY: this.fabTranslate}]}]}>
          {fab}
        </Animated.View>}

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
  }
});
