import React, {Component} from "react";
import {ScrollView} from "react-native";
import {DrawerItems} from "react-navigation";
import Color from "color";

export class AppDrawer extends Component {
  render() {
    return <ScrollView>
      <DrawerItems {...this.props} {...drawerProps}/>
    </ScrollView>;
  }
}

const drawerProps = {
  labelStyle: {color: Color("white").darken(0.95).string(), fontSize: 15},
  activeBackgroundColor: Color("white").darken(0.1).string()
};
