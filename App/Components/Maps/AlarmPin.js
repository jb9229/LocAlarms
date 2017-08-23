import React, {Component} from "react";
import PropTypes from "prop-types";
import MapView from "react-native-maps";
import {View} from "react-native";

export class AlarmPin extends Component {
  static propTypes = PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    radius: PropTypes.number,
    title: PropTypes.string,
    onDragEnd: PropTypes.func
  }).isRequired;

  render() {
    return <View>
      <MapView.Marker
      coordinate={{latitude: this.props.latitude, longitude: this.props.longitude}}
      draggable={Boolean(this.props.onDragEnd)}
      onDrag={(event) => {console.tron.log(event); console.log(event)}}
      onDragEnd={(event) => {
        console.tron.log(event);
        if (this.props.onDragEnd) this.props.onDragEnd(event)
      }}/>
      <MapView.Circle
        radius={this.props.radius}
        center={{latitude: this.props.latitude, longitude: this.props.longitude}}>
      </MapView.Circle>
    </View>
  }
}
