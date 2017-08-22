import React from 'react'
import MapView from 'react-native-maps'
import MapCallout from './MapCallout'

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    const locations = [
      {title: 'Location A', latitude: 37.78825, longitude: -122.4324},
      {title: 'Location B', latitude: 37.75825, longitude: -122.4624}
    ];
    const region = {latitude: 123, longitude: 123, latitudeDelta: 0.1, longitudeDelta: 0.1};
    this.state = {
      region,
      locations,
      showUserLocation: true
    };
    this.renderMapMarkers = this.renderMapMarkers.bind(this);
    this.onRegionChange = this.onRegionChange.bind(this)
  }

  componentWillReceiveProps(newProps) {

  }

  onRegionChange(newRegion) {

  }

  calloutPress(location) {

  }

  renderMapMarkers(location) {
    return (
      <MapView.Marker key={location.title} coordinate={{latitude: location.latitude, longitude: location.longitude}}>
        <MapCallout location={location} onPress={this.calloutPress}/>
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
        onRegionChangeComplete={this.onRegionChange}
        showsUserLocation={this.state.showUserLocation}
      >
        {this.state.locations.map((location) => this.renderMapMarkers(location))}
      </MapView>
    )
  }
}

