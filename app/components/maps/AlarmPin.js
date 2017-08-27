import React, {Component} from "react";
import PropTypes from "prop-types";
import MapView from "react-native-maps";
import {View} from "react-native";
import Color from "color";
import {Colors} from "../../theme";

export class AlarmPin extends Component {
  static propTypes = {
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    radius: PropTypes.number,
    title: PropTypes.string,
    onDragEnd: PropTypes.func
  };

  render() {
    return <View>
      <MapView.Marker
        coordinate={{latitude: this.props.latitude, longitude: this.props.longitude}}
        draggable={Boolean(this.props.onDragEnd)}
        pinColor={Colors.brandPrimary}
        onDragEnd={e => {
          if (this.props.onDragEnd) this.props.onDragEnd(e.nativeEvent.coordinate)
        }}/>
      <MapView.Circle
        radius={this.props.radius}
        strokeColor={Colors.brandPrimary}
        fillColor={Color(Colors.brandPrimary).lighten(0.65).alpha(0.5).string()}
        center={{latitude: this.props.latitude, longitude: this.props.longitude}}>
      </MapView.Circle>
    </View>
  }
}