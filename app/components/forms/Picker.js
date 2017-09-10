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

  render() {
    if (this.props.mode === PickerModes.radio) {
      return <View>
        <Modal animationType="slide"
               transparent
               onRequestClose={() => {
               }}
               visible={true}>
          <View style={styles.modal}>
            <RView style={{
              width: "100%",
              paddingHorizontal: 30,
              flex: 1,
              paddingVertical: (Metrics.screenHeight - 100 - this.props.values.length * 47) / 2
            }}>
              <Card>
                {this.props.values.map((val, i) =>
                  <TouchableNativeFeedback key={i} onPress={() => {this.props.onChange(val)}}>
                    <CardItem>
                      <Text>{val}</Text>
                      <RView style={styles.rightContainer}>
                        <Radio selected={this.props.value === val} disabled style={styles.rightItem}/>
                      </RView>
                    </CardItem>
                  </TouchableNativeFeedback>
                )}
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.rightMargin} onPress={this.props.cancel}>
                      <Text>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.props.confirm}>
                      <Text branded>OK</Text>
                    </TouchableOpacity>
                  </View>
              </Card>
            </RView>
          </View>
        </Modal>
        <TouchableOpacity style={styles.pickerBtn}>
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
  rightMargin: {marginRight: 20}
});
