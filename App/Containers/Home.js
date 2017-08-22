import React, {Component} from 'react'
import {Animated, Text, View} from 'react-native'
import styles from './Styles/HomeStyles'
import {Body, Card, CardItem, Container, Header, Icon, Title} from "native-base";
import Map from "../Components/Map";
import {connect} from "react-redux";
import {actionDispatcher} from "../Redux";

export class Home extends Component {
  scroll = new Animated.Value(0);

  render() {
    setTimeout(() => {this.props.navigation.navigate("AddAlarm");}, 1000);

    return (
      <Container>
        <Header>
          <Body>
          <Title>
            Alarms
          </Title>
          </Body>
        </Header>
        <View>
          <Animated.ScrollView
            onScroll={Animated.event([{nativeEvent: {contentOffset: {y: this.scroll}}}], {useNativeDriver: true})}
            scrollEventThrottle={5}>
            <Animated.View
              style={[styles.mapContainer, {transform: [{translateY: Animated.divide(this.scroll, 2)}]}]}>
              <Map/>
            </Animated.View>
            <View style={styles.alarmListContainer}>
              <View>
                <Card>
                  <CardItem>
                    <Icon active name="alarm"/>
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

export const HomeContainer = connect((state) => ({state: state}), actionDispatcher)(Home);
