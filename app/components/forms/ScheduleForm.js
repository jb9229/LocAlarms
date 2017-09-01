import React, {Component} from "react";
import {Field} from "redux-form";
import {ScheduleTypes} from "../../services/alarms/Alarm";
import {attachRender, createFields, formTypes} from "../../lib/ReduxForm";
import {Icon, Item, Label, Picker, Text} from "native-base";
import {StyleSheet, View} from "react-native";
import DatePicker from "react-native-datepicker";
import autobind from "autobind-decorator";
import moment from "moment";
import {Theme} from "../../theme";

export const fieldData = createFields({
  type: {label: "Type", initialValue: ScheduleTypes.ONCE, type: formTypes.picker},
  startDate: {label: "Start Date", initialValue: moment().startOf("day"), type: formTypes.date}
});

export class ScheduleForm extends Component {
  fields = attachRender(fieldData, this.renderInput);

  constructor(props) {
    super(props);
  }

  @autobind
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
              btnTextConfirm: styles.confirmText
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
      <Field {...this.fields.type}/>
      <Field {...this.fields.startDate} format={(x) => {
        return moment(x).format("YYYY-MM-DD");
      }} parse={(string) => moment(string)}/>
    </View>;
  }
}

const styles = StyleSheet.create({
  noBorder: {borderWidth: 0},
  formText: {
    fontFamily: "roboto",
    fontSize: 16.5
  },
  confirmText: {
    color: Theme.brandPrimary
  },
  datePicker: {width: 140, paddingHorizontal: 12, paddingVertical: 3}
});
