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
    location: PropTypes.object,
    onPress: PropTypes.func
  };
  mapView;
  mapReady = false;

  fitLocations(locations) {
    if (this.mapReady) {
      if (_.isArray(locations)) {
        let [minLat, maxLat, minLng, maxLng] = [Infinity, -Infinity, Infinity, -Infinity];
        for (let location of locations) {
          [minLat, maxLat, minLng, maxLng] = [
            Math.min(minLat, location.latitude),
            Math.max(maxLat, location.latitude),
            Math.min(minLng, location.longitude),
            Math.max(maxLng, location.longitude)
          ];
        }
        if ((maxLat - minLat) <= 0.01 && (maxLng - minLng) <= 0.01)
          this.mapView.animateToRegion({
            latitude: (maxLat + minLat) / 2,
            longitude: (maxLng + minLng) / 2,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
          });
        else this.mapView.fitToCoordinates(locations, {animated: true});
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
        onPress={this.props.onPress}
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

