import React, {Component} from 'react'
import MapView from 'react-native-maps'
import MapCallout from './MapCallout'
import PropTypes from "prop-types";
import {AlarmPin} from "./AlarmPin";

export class Map extends Component {
  static propTypes = {
    locations: PropTypes.arrayOf(PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number,
      radius: PropTypes.number,
      title: PropTypes.string,
      onDragEnd: PropTypes.func
    })).isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <MapView
        style={{
          // For Android :/
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
        followsUserLocation
        loadingEnabled
        showsUserLocation>
        {this.props.locations.map((location, i) => (
          <AlarmPin {...location} key={i}/>))
        }
      </MapView>
    )
  }
}

