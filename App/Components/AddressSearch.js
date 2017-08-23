import React, {Component} from "react";
import PropTypes from "prop-types";
import {Card, CardItem, Container, Content, Header, Icon, Input, Item, Text} from "native-base";
import {GeoService} from "../Services/Geo";
import {TouchableOpacity} from "react-native";

export class AddressSearch extends Component {
  static propTypes = {
    onSelect: PropTypes.func,
    initialValue: PropTypes.string,
    onBack: PropTypes.func
  };
  locations: string[] = [];

  constructor(props) {
    super(props);
    this.state = {
      searchText: ""
    };
    GeoService.search(this.state.searchText).then((data) => {
      this.locations = data.results.map((x) => x.formatted_address);
    })
  }

  changeText(text) {
    this.setState({
      searchText: text
    });
    GeoService.search(text).then((data) => {
      this.locations = data.results.map((x) => x.formatted_address);
    })
  }

  render() {
    return <Container>
      <Header searchBar rounded>
        <Item>
          <TouchableOpacity onPress={() => {
            this.props.onBack()
          }}>
            <Icon name="arrow-back"/>
          </TouchableOpacity>
          <Input placeholder="Search"
                 defaultValue={this.props.initialValue}
                 value={this.state.searchText}
                 autoFocus
                 onChangeText={(value) => {
                   this.changeText(value)
                 }}/>
          <TouchableOpacity onPress={() => {
          }}>
            <Icon name="close"/>
          </TouchableOpacity>
        </Item>
      </Header>
      <Content>
        <Card>
          {this.locations.map((name, i) => <CardItem key={i}>
            <Icon active name="pin"/>
            <Text numberOfLines={1}>
              {name}
            </Text>
          </CardItem>)}
        </Card>
      </Content>
    </Container>
  }
}
