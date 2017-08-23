import React, {Component} from 'react'
import {Animated, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {Body, Card, CardItem, Container, Content, Header, Icon, Left, Right, Title} from "native-base";
import {Map} from "../Components/Maps/Map";
import {connect} from "react-redux";
import {actionDispatcher} from "../Redux";
import {Colors, Metrics} from "../Theme";

export class Home extends Component {
  scroll = new Animated.Value(0);

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
              <View style={styles.bgFill}>
                <Card>
                  <CardItem>
                    <Icon active name="alarm"/>
                    <Text>Google Plus</Text>
                  </CardItem>
                </Card>
              </View>
            </Content>
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
  },
  bgFill: {
    backgroundColor: Colors.background
  }
});

export const HomeContainer = connect((state) => ({state: state}), actionDispatcher)(Home);
