import React, {Component} from "react";
import {ScrollView, StyleSheet} from "react-native";
import {DrawerItems} from "react-navigation";
import variables from "../theme/material";
import Color from "color";

export class AppDrawer extends Component {
  render() {
    return <ScrollView style={styles.drawer}><DrawerItems {...this.props} {...drawerProps}/></ScrollView>;
  }
}

const drawerProps = {
  labelStyle: {color: Color("white").darken(0.95).string(), fontSize: 16},
  activeBackgroundColor: Color("white").darken(0.1).string()
};
const styles = StyleSheet.create({
  drawer: {

  }
});
