import React, {Component} from 'react'
import MapView from 'react-native-maps'
import MapCallout from './MapCallout'
import PropTypes from "prop-types";

export class Map extends Component {
  static propTypes = {
    locations: PropTypes.arrayOf(PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number,
      radius: PropTypes.number,
      title: PropTypes.string
    })).isRequired
  };

  constructor(props) {
    super(props);
    const locations = [
      {title: 'Location A', latitude: 37.78825, longitude: -122.4324},
      {title: 'Location B', latitude: 37.75825, longitude: -122.4624}
    ];
    const region = {latitude: 123, longitude: 123, latitudeDelta: 0.1, longitudeDelta: 0.1};
    this.renderMapMarkers = this.renderMapMarkers.bind(this);
  }

  renderMapMarkers(location) {
    return (
      <MapView.Marker key={location.title} coordinate={location}>
        <MapCallout location={location}/>
      </MapView.Marker>
    )
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
        initialRegion={this.state.region}
        showsUserLocation={true}
      >
        {this.state.locations.map((location) => this.renderMapMarkers(location))}
      </MapView>
    )
  }
}

