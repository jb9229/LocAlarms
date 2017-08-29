import React, {Component} from "react";
import PropTypes from "prop-types";
import {Body, CardItem, Icon, Right, Text, Title, View} from "native-base";
import {Animated, TouchableOpacity} from "react-native";

export class AlarmCard extends Component {
  static propTypes = {
    alarm: PropTypes.object.isRequired
  };
  animatedHeight = new Animated.Value(0);
  arrowOrientation = this.animatedHeight.interpolate({
    inputRange: [0, 100],
    outputRange: ['0deg', '180deg']
  });

  pressed() {
    const config = {toValue: this.animatedHeight.__getValue() > 0 ? 0 : 100, duration: 200};
    Animated.timing(this.animatedHeight, config).start();
  }

  render() {
    return <CardItem bordered>
      <Body>
      <Title inverse>{this.props.alarm.name}</Title>
      <Text>Hello</Text>
      <View right>
        <Animated.View style={{height: this.animatedHeight}}>

        </Animated.View>
        <TouchableOpacity onPress={() => {
          this.pressed()
        }}>
          <Animated.View style={{transform: [{rotate: this.arrowOrientation}]}}>
            <Icon name="ios-arrow-down" small/>
          </Animated.View>
        </TouchableOpacity>
      </View>

      </Body>
    </CardItem>
  }
}

