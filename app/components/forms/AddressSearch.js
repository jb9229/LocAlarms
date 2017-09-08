import React, {Component} from "react";
import PropTypes from "prop-types";
import {Card, CardItem, Container, Content, Header, Icon, Input, Item, Text, View} from "native-base";
import type {GeoData} from "../../services/Geo";
import {GeoService} from "../../services/Geo";
import {StyleSheet, TouchableOpacity} from "react-native";
import _ from "lodash";
import {AppStatusService} from "../../services/AppStatus";

export class AddressSearch extends Component {
  static propTypes = {
    onSelect: PropTypes.func,
    initialValue: PropTypes.string,
    onBack: PropTypes.func
  };
  locations: string[] = [];
  changeText: (text: string) => void;

  constructor(props) {
    super(props);
    this.state = {
      searchText: props.initialValue,
      locations: []
    };
    this.changeText = _.debounce((text) => {
      GeoService.search(text).then((data) => {
        this.setState({locations: data});
      });
    }, 250);
    this.changeText(props.initialValue);
  }

  render() {
    return <Container>
      <Header searchBar rounded>
        <Item>
          <TouchableOpacity onPress={() => {
            this.props.onBack();
          }}>
            <Icon name="arrow-back"/>
          </TouchableOpacity>
          <Input placeholder="Search"
                 defaultValue={this.props.initialValue}
                 value={this.state.searchText}
                 autoFocus
                 disabled={!AppStatusService.connected}
                 onChangeText={(text) => {
                   this.setState({
                     searchText: text
                   });
                   this.changeText(text);
                 }}/>
          <TouchableOpacity onPress={() => {
            this.setState({searchText: ""});
            this.changeText("");
          }}>
            <Icon name="close"/>
          </TouchableOpacity>
        </Item>
      </Header>
      <Content keyboardShouldPersistTaps="always">
        <Card style={styles.locationList}>
          {AppStatusService.connected ?
            <View>
              <TouchableOpacity onPress={() => {
                GeoService.getLocation().then((geo: GeoData) => {
                  GeoService.geocode(geo.coords).then((data: { results: { formatted_address: string }[] }) => {
                    this.props.onBack({
                      loc: geo.coords,
                      address: data.results[0].formatted_address
                    });
                  });
                });
              }}>
                <CardItem>
                  <Icon name="locate"/>
                  <Text numberOfLines={1}>
                    Your location
                  </Text>
                </CardItem>
              </TouchableOpacity>
              {this.state.locations.map((data, i) =>
                <TouchableOpacity onPress={() => {
                  this.props.onBack({
                    loc: {
                      latitude: data.geometry.location.lat,
                      longitude: data.geometry.location.lng
                    },
                    address: data.formatted_address
                  });
                }} key={i}>
                  <CardItem>
                    <Icon name="pin"/>
                    <Text numberOfLines={1}>
                      {data.formatted_address}
                    </Text>
                  </CardItem>
                </TouchableOpacity>
              )}</View> : <CardItem><Icon name="cloud-outline"/>
              <Text numberOfLines={1}>
                You must be connected to wifi to search
              </Text></CardItem>
          }
        </Card>
      </Content>
    </Container>;
  }
}

const styles = StyleSheet.create({
  locationList: {
    paddingRight: 40
  }
});
