import React, {Component} from 'react';
import MapView from 'react-native-maps';
import PropTypes from "prop-types";
import {StyleSheet} from "react-native";
import {AlarmPin} from "./AlarmPin";
import {filterUndefined, isDefined} from "../../lib/Operators";
import _ from "lodash";
import idx from "idx";
import autobind from "autobind-decorator";

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
  timeoutId;

  @autobind
  fitLocations(locations) {
    if (this.mapReady && isDefined(locations) && !isDefined(this.timeoutId)) {
      this.timeoutId = setTimeout(() => {
        this.timeoutId = null;
      }, 1500);

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
        if ((maxLat - minLat) <= 0.01 && (maxLng - minLng) <= 0.01) {
          const delta = Math.max(...locations.map((loc) => loc.radius))/30000;
          this.mapView.animateToRegion({
            latitude: (maxLat + minLat) / 2,
            longitude: (maxLng + minLng) / 2,
            latitudeDelta: delta,
            longitudeDelta: delta
          });
        }
        else if (locations.length > 0) this.mapView.fitToCoordinates(locations, {animated: true});
      } else if (isDefined(locations.coords)) {
        this.mapView.animateToRegion({
          latitude: locations.coords.latitude,
          longitude: locations.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01
        });
      }
    }
  }

  componentDidMount() {
    this.checkShouldFit(this.props);
  }

  componentWillReceiveProps(props) {
    this.checkShouldFit(props, this.props);
  }

  checkShouldFit(props, oldProps) {
    const locations = filterUndefined(props.locations),
      oldLocations = filterUndefined(idx(oldProps, (old) => old.locations));
    if (locations.length === 0) {
      navigator.geolocation.getCurrentPosition(this.fitLocations);
    } else if (locations !== oldLocations) {
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
          this.checkShouldFit(this.props);
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

