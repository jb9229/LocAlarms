import React, {Component} from 'react'
import MapView from 'react-native-maps'
import PropTypes from "prop-types";
import {AlarmPin} from "./AlarmPin";

export class Map extends Component {
  mapView;

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

  componentWillReceiveProps(props) {
    const maxRadius = Math.ceil(Math.max(props.locations.map(location => location.radius)) * 1.1);
    setTimeout(() => {
      this.mapView.fitToCoordinates(props.locations, {
          edgePadding: {top: maxRadius, bottom: maxRadius, left: maxRadius, right: maxRadius},
          animated: true
        });
    }, 500);
  }

  render() {
    return (
      <MapView
        style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}
        ref={(elem) => {
          if (!this.mapView) {
            this.mapView = elem;
          }
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

