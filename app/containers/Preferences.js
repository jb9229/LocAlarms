import React, {Component} from "react";
import {Body, Container, Header, Icon, Left, Right, Title} from "native-base";
import {TouchableOpacity} from "react-native";
import {Routes} from "../navigation/AppNavigation";

export class Preferences extends Component {
  render() {
    return <Container>
      <Header>
        <Left>
          <TouchableOpacity onPress={() => {
            this.props.navigation.navigate(Routes.openDrawer);
          }}>
            <Icon name="menu" inverse/>
          </TouchableOpacity>
        </Left>
        <Body>
        <Title>
          Alarms
        </Title>
        </Body>
        <Right/>
      </Header>
    </Container>;
  }
}
