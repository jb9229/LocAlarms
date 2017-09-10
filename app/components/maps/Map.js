import React, {Component} from 'react';
import MapView from 'react-native-maps';
import PropTypes from "prop-types";
import {StyleSheet} from "react-native";
import {AlarmPin} from "./AlarmPin";
import {filterUndefined, isDefined} from "../../lib/Operators";
import _ from "lodash";

export class Map extends Component {
  static propTypes = {
    locations: PropTypes.arrayOf(PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number,
      radius: PropTypes.number,
      title: PropTypes.string,
      onDragEnd: PropTypes.func
    })).isRequired,
    location: PropTypes.object
  };
  mapView;
  mapReady = false;

  fitLocations(locations) {
    if (this.mapReady) {
      if (_.isArray(locations)) {
        const PADDING = locations.some(loc => isDefined(loc.radius)) ? Math.max(...locations.map((loc) => loc.radius)) / 15000 : 0.02;
        let [minLat, maxLat, minLng, maxLng] = [Infinity, -Infinity, Infinity, -Infinity];
        for (let location of locations) {
          [minLat, maxLat, minLng, maxLng] = [
            Math.min(minLat, location.latitude),
            Math.max(maxLat, location.latitude),
            Math.min(minLng, location.longitude),
            Math.max(maxLng, location.longitude)
          ];
        }
        this.mapView.animateToRegion({
          latitude: (minLat + maxLat) / 2,
          longitude: (minLng + maxLng) / 2,
          latitudeDelta: PADDING,
          longitudeDelta: PADDING
        }, 500);
      } else if (isDefined(locations)) {
        this.mapView.animateToRegion({
          ...locations.coords,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01
        });
      }
    }
  }

  componentWillReceiveProps(props) {
    const locations = filterUndefined(props.locations), oldLocations = this.props.locations;
    if (locations.length === 0) {
      this.fitLocations(this.props.location);
    } else if (locations.length !== oldLocations.length || locations.some((location, index) =>
        location.latitude !== oldLocations[index].latitude ||
        location.longitude !== oldLocations[index].longitude ||
        location.radius !== oldLocations[index].radius)
    ) {
      this.fitLocations(locations);
    }
  }

  render() {
    const locations = filterUndefined(this.props.locations);
    return (
      <MapView
        style={StyleSheet.absoluteFill}
        ref={(elem) => {
          if (!this.mapView) this.mapView = elem;
        }}
        onMapReady={() => {
          this.mapReady = true;
          if (locations.length === 0) this.fitLocations(this.props.location);
          else this.fitLocations(locations);
        }}
        provider={MapView.PROVIDER_GOOGLE}
        followsUserLocation
        loadingEnabled
        showsUserLocation>
        {locations.map((location, i) => (
          <AlarmPin {...location} key={i}/>))
        }
      </MapView>
    );
  }
}

