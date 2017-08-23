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

  fitLocations(locations) {
    if (this.mapView && locations.length > 0) {
      setTimeout(() => {
        const maxRadius = Math.ceil(Math.max(locations.map(location => location.radius)) * 1.1);
        this.mapView.fitToCoordinates(locations, {
          edgePadding: {top: maxRadius, bottom: maxRadius, left: maxRadius, right: maxRadius},
          animated: true
        });
      }, 500);
    }
  }

  componentWillReceiveProps(props) {
    if (props.locations.length !== this.props.locations.length ||
      props.locations.some((location, index) => location.latitude !== this.props.locations[index].latitude || location.longitude !== this.props.locations[index].longitude)) {
      this.fitLocations(props.locations)
    }
  }

  render() {
    return (
      <MapView
        style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}
        ref={(elem) => {
          if (!this.mapView) {
            this.mapView = elem;
            this.fitLocations(this.props.locations);
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

