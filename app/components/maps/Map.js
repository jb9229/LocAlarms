import React, {Component} from 'react'
import MapView from 'react-native-maps'
import PropTypes from "prop-types";
import {StyleSheet} from "react-native";
import {AlarmPin} from "./AlarmPin";
import {filterUndefined} from "../../lib/NullCheck";

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
  mapView;

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
    const locations = filterUndefined(props.locations), oldLocations = this.props.locations;
    if (locations.some((location, index) =>
        location.latitude !== oldLocations[index].latitude ||
        location.longitude !== oldLocations[index].longitude)
    ) {
      this.fitLocations(locations)
    }
  }

  render() {
    const locations = filterUndefined(this.props.locations);
    return (
      <MapView
        style={StyleSheet.absoluteFill}
        ref={(elem) => {
          if (!this.mapView) {
            this.mapView = elem;
            this.fitLocations(locations);
          }
        }}
        provider={MapView.PROVIDER_GOOGLE}
        followsUserLocation
        loadingEnabled
        showsUserLocation>
        {locations.map((location, i) => (
          <AlarmPin {...location} key={i}/>))
        }
      </MapView>
    )
  }
}

