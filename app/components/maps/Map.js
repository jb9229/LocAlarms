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
    this.fitLocations(this.props.locations);
  }

  fitLocations(locations) {
    if (this.mapView && locations.length > 0) {
      const PADDING = Math.max(this.props.locations.map(loc => loc.radius)) / 80000;
      let [minLat, maxLat, minLng, maxLng] = [Infinity, -Infinity, Infinity, -Infinity];
      for (let location of locations) {
        [minLat, maxLat, minLng, maxLng] = [
          Math.min(minLat, location.latitude - PADDING),
          Math.max(maxLat, location.latitude + PADDING),
          Math.min(minLng, location.longitude - PADDING),
          Math.max(maxLng, location.longitude + PADDING)
        ];
      }
      setTimeout(() => {
        this.mapView.fitToCoordinates([...locations, {latitude: minLat, longitude: minLng}, {latitude: maxLat, longitude: maxLng}], {
          animated: true
        });
      }, 500);
    }
  }

  componentWillReceiveProps(props) {
    const locations = filterUndefined(props.locations), oldLocations = this.props.locations;
    if (locations.some((location, index) =>
        location.latitude !== oldLocations[index].latitude ||
        location.longitude !== oldLocations[index].longitude ||
        location.radius !== oldLocations[index].radius)
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

