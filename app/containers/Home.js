import React, {Component} from 'react'
import {Animated, StyleSheet, TouchableOpacity} from 'react-native'
import {Body, Card, Container, Content, Fab, Header, Icon, Left, Right, Title, View} from "native-base";
import {Map} from "../components/maps/Map";
import {connect} from "react-redux";
import {actionDispatcher, propsMerger, selectors} from "../redux";
import {Metrics} from "../theme";
import {AlarmCard} from "../components/AlarmCard";
import {Routes} from "../navigation/AppNavigation";
import autobind from 'autobind-decorator'
import type {Alarm} from "../services/alarms/Alarm";

@connect((state) => ({alarms: selectors.alarms.all(state)}), actionDispatcher, propsMerger)
export class Home extends Component {
  scroll = new Animated.Value(0);
  fabScale = this.scroll.interpolate({
    inputRange: [0, 20],
    outputRange: [1, 0],
    extrapolate: "clamp"
  });
  mapScale = this.scroll.interpolate({
    inputRange: [-35, 0],
    outputRange: [1.1, 1],
    extrapolateRight: "clamp"
  });
  state = {
    editPanelOpen: -1
  };

  @autobind
  deleteAlarm(alarm) {
    this.props.alarms.actions.deleteAlarm(alarm.id);
    this.setState({
      editPanelOpen: -1
    })
  }

  @autobind
  editAlarm(alarm) {
    this.props.navigation.navigate(Routes.alarmEditor, {alarm});
    this.setState({
      editPanelOpen: -1
    })
  }

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <TouchableOpacity onPress={() => {
              this.props.navigation.navigate(Routes.openDrawer)
            }}>
              <Icon name="menu" inverse/>
            </TouchableOpacity>
          </Left>
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
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={5}>
            <Animated.View
              style={[styles.mapContainer, {transform: [{translateY: Animated.divide(this.scroll, 4)}, {scale: this.mapScale}]}]}>
              <Map locations={this.props.alarms.state.map((alarm: Alarm) => ({...alarm.location, radius: alarm.radius, title: alarm.name}))}/>
            </Animated.View>
            <Content style={styles.alarmList}>
              <View>
                {(this.props.alarms.state.length > 0) &&
                <Card>
                  {this.props.alarms.state.map((alarm, i) => <AlarmCard alarm={alarm}
                                                                        key={i}
                                                                        onEditPanelOpen={() => {
                                                                          this.setState({
                                                                            editPanelOpen: i
                                                                          })
                                                                        }}
                                                                        editPressed={this.editAlarm}
                                                                        deletePressed={this.deleteAlarm}
                                                                        editPanelOpen={this.state.editPanelOpen === i}/>)}
                </Card>}
              </View>
            </Content>
          </Animated.ScrollView>
        </View>
        <Animated.View style={[styles.fab, {transform: [{scale: this.fabScale}]}]}>
          <Fab onPress={() => {
            this.props.navigation.navigate(Routes.alarmEditor);
          }}>
            <Icon name="add"/>
          </Fab>
        </Animated.View>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  mapContainer: {
    height: Metrics.screenHeight * 0.75
  },
  alarmList: {
    minHeight: Metrics.screenHeight * 0.25 - Metrics.navHeaderHeight + 10
  },
  fab: {
    position: "absolute",
    bottom: 0,
    right: 0
  }
});
