import React, {Component} from "react";
import {ScrollView, StyleSheet} from "react-native";
import {DrawerItems} from "react-navigation";
import variables from "../theme/material";
import Color from "color";

export class AppDrawer extends Component {
  render() {
    return <ScrollView style={styles.drawer}><DrawerItems {...this.props} {...drawerProps}/></ScrollView>
  }
}

const drawerProps = {
  labelStyle: {color: variables.inverseTextColor},
  activeBackgroundColor: Color(variables.brandPrimary).darken(0.15).string()
};
const styles = StyleSheet.create({
  drawer: {
    backgroundColor: variables.brandPrimary
  }
});
