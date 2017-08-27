import React, {Component} from 'react'
import {Animated, StyleSheet, TouchableOpacity} from 'react-native'
import {Body, Card, Container, Content, Fab, Header, Icon, Left, Right, Title, View} from "native-base";
import {Map} from "../components/maps/Map";
import {connect} from "react-redux";
import {actionDispatcher, propsMerger, selectors} from "../redux";
import {Metrics} from "../theme";
import {AlarmCard} from "../components/AlarmCard";

export class Home extends Component {
  scroll = new Animated.Value(0);
  state = {
    active: false
  };

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <TouchableOpacity onPress={() => {
              this.props.navigation.navigate('DrawerOpen')
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
            style={styles.bgFill}
            scrollEventThrottle={5}>
            <Animated.View
              style={[styles.mapContainer, {transform: [{translateY: Animated.divide(this.scroll, 4)}]}]}>
              <Map locations={[]}/>
            </Animated.View>
            <Content style={styles.alarmList}>
              <View>
                <Card>
                  {this.props.alarms.state.map((alarm, i) => <AlarmCard alarm={alarm} key={i}/>)}
                </Card>
              </View>
            </Content>
          </Animated.ScrollView>
        </View>
        <Fab position="bottomRight" onPress={() => {
          this.props.navigation.navigate("AddAlarm");
        }}>
          <Icon name="add"/>
        </Fab>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  mapContainer: {
    height: Metrics.screenHeight * 0.6
  },
  alarmList: {
    minHeight: Metrics.screenHeight * 0.4 - Metrics.navHeaderHeight
  }
});

export const HomeContainer = connect((state) => ({alarms: selectors.alarms.all(state)}), actionDispatcher, propsMerger)(Home);
