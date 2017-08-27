import React, {Component} from "react";
import {Field} from "redux-form";
import {ScheduleTypes} from "../../services/alarms/Alarm";
import {formTypes} from "../../lib/FormTypes";
import {Icon, Item, Label, Picker, Text} from "native-base";
import {StyleSheet, View} from "react-native";
import DatePicker from "react-native-datepicker";

export const fields = {
  type: {label: "Type", name: "type", initialValue: ScheduleTypes.ONCE, type: formTypes.picker},
  dateStart: {label: "Start Date", name: "startDate", initialValue: "2016-05-05", type: formTypes.date}
};

export class ScheduleForm extends Component {
  constructor(props) {
    super(props);
    this.renderInput = this.renderInput.bind(this);
  }

  renderInput({input, label, type, meta: {touched, error}}) {
    switch (type) {
      case formTypes.picker:
        return <Item>
          <Label>{label}</Label>
          <Picker
            mode="dropdown"
            iosIcon={<Icon name="arrow-dropdown"/>}
            selectedValue={input.value}
            onValueChange={input.onChange}>
            <Picker.Item label={ScheduleTypes.ONCE} value={ScheduleTypes.ONCE}/>
            <Picker.Item label={ScheduleTypes.DAILY} value={ScheduleTypes.DAILY}/>
          </Picker>
        </Item>;
      case formTypes.date:
        return <Item>
          <Label>{label}</Label>
          <DatePicker
            date={input.value}
            mode="date"
            iconComponent={<Icon name="arrow-dropdown" style={styles.icon}/>}
            confirmBtnText="Confirm"
            customStyles={{
              dateInput: styles.noBorder,
              dateText: styles.formText,
            }}
            style={styles.datePicker}
            cancelBtnText="Cancel"
            format="YYYY-MM-DD"
            onDateChange={input.onChange}
          />
        </Item>;
    }
  }

  render() {
    return <View>
      <Item itemDivider>
        <Text>Schedule</Text>
      </Item>
      <Field {...fields.type} component={this.renderInput}/>
      <Field {...fields.dateStart} component={this.renderInput}/>
    </View>
  }
}

const styles = StyleSheet.create({
  noBorder: {borderWidth: 0},
  formText: {
    fontFamily: "roboto",
    fontSize: 16.5
  },
  icon: {
    marginLeft: 3,
    color: "#7a7a7a"
  },
  datePicker: {width: 140, paddingHorizontal: 12, paddingVertical: 3}
});
