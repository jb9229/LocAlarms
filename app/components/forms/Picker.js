import React, {Component} from "react";
import {
  Modal,
  Picker as RPicker,
  StyleSheet,
  TouchableNativeFeedback,
  TouchableOpacity,
  View as RView
} from "react-native";
import PropTypes from "prop-types";
import {Card, CardItem, Icon, Radio, Text, View} from "native-base";
import {Metrics, Theme} from "../../theme";
import Color from "color";

export const PickerModes = {
  dropdown: "dropdown",
  radio: "radio"
};

export class Picker extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    mode: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    values: PropTypes.arrayOf(PropTypes.string).isRequired,
    confirm: PropTypes.func,
    cancel: PropTypes.func
  };

  constructor(props) {
    super(props);
    if (this.props.mode === PickerModes.radio) {
      this.state = {
        modalOpen: false,
        selectedValue: this.props.value
      };
    }
  }

  render() {
    if (this.props.mode === PickerModes.radio) {
      return <View>
        <Modal animationType="fade"
               transparent
               onRequestClose={() => {
               }}
               visible={this.state.modalOpen}>
          <View style={styles.modal}>
            <RView
              style={[styles.cardContainer, {paddingVertical: (Metrics.screenHeight - 100 - this.props.values.length * 45) / 2}]}>
              <Card style={styles.topPadding}>
                {this.props.values.map((val, i) =>
                  <TouchableNativeFeedback key={i} onPress={() => {
                    if (this.props.onChange) this.props.onChange(val);
                    this.setState({selectedValue: val});
                  }}>
                    <CardItem>
                      <Text>{val}</Text>
                      <RView style={styles.rightContainer}>
                        <Radio selected={this.state.selectedValue === val} disabled style={styles.rightItem}/>
                      </RView>
                    </CardItem>
                  </TouchableNativeFeedback>
                )}
                <View style={styles.footer}>
                  <TouchableOpacity style={styles.rightMargin} onPress={() => {
                    if (this.props.cancel) this.props.cancel(this.state.selectedValue);
                    this.setState({modalOpen: false, selectedValue: this.props.value});
                  }}>
                    <Text>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                    if (this.props.confirm) this.props.confirm(this.state.selectedValue);
                    this.setState({modalOpen: false});
                  }}>
                    <Text branded>OK</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            </RView>
          </View>
        </Modal>
        <TouchableOpacity style={styles.pickerBtn} onPress={() => {
          this.setState({modalOpen: true});
        }}>
          <Text>
            {this.props.value}
          </Text>
          <Icon name="arrow-dropdown" style={styles.pickerIcon}/>
        </TouchableOpacity></View>;
    } else {
      return <RPicker
        mode={this.props.mode}
        iosIcon={<Icon name="arrow-dropdown"/>}
        selectedValue={this.props.value}
        style={styles.picker}
        onValueChange={this.props.onChange}>
        {this.props.values.map((val, i) => <RPicker label={val} value={val} key={i}/>)}
      </RPicker>;
    }
  }
}

const styles = StyleSheet.create({
  picker: {width: 150},
  pickerBtn: {
    flexDirection: "row",
    alignItems: "center"
  },
  pickerIcon: {
    color: Theme.pickerIconColor,
    marginLeft: 5,
    fontSize: Theme.iconSizeSmall
  },
  modal: {
    backgroundColor: Color("black").alpha(0.5).string(),
    justifyContent: "center",
    alignItems: "center"
  },
  rightContainer: {
    alignSelf: "flex-end", flex: 1
  },
  rightItem: {flexDirection: "row", alignSelf: "flex-end"},
  row: {
    flexDirection: "row"
  },
  footer: {flexDirection: "row", alignSelf: "flex-end", alignItems: "center", paddingRight: 20},
  rightMargin: {marginRight: 20},
  topPadding: {paddingTop: 5},
  cardContainer: {
    width: "100%",
    paddingHorizontal: 30,
    flex: 1
  }
});
