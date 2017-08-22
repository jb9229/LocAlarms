import React, {Component} from 'react'
import {Animated, Text, TouchableOpacity, View, StyleSheet, Dimensions} from 'react-native'
import {Body, Card, CardItem, Container, Header, Icon, Left, Right, Title} from "native-base";
import Map from "../Components/Map";
import {connect} from "react-redux";
import {actionDispatcher} from "../Redux";
import {Metrics} from "../Theme/Metrics";

export class Home extends Component {
  scroll = new Animated.Value(0);

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <TouchableOpacity>
              <Icon name="menu"/>
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
            scrollEventThrottle={5}>
            <Animated.View
              style={[styles.mapContainer, {transform: [{translateY: Animated.divide(this.scroll, 2)}]}]}>
              <Map/>
            </Animated.View>
            <View style={styles.alarmList}>
              <View>
                <Card>
                  <CardItem>
                    <Icon active name="alarm" inverse/>
                    <Text>Google Plus</Text>
                  </CardItem>
                </Card>
              </View>
            </View>
          </Animated.ScrollView>
        </View>
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

export const HomeContainer = connect((state) => ({state: state}), actionDispatcher)(Home);
