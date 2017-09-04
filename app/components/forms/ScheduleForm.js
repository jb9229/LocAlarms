import React, {Component} from "react";
import {Field} from "redux-form";
import {ScheduleService} from "../../services/Schedule";
import {attachRender, createFields, formTypes} from "../../lib/ReduxForm";
import {Icon, Item, Label, Picker, Text} from "native-base";
import {StyleSheet, View} from "react-native";
import DatePicker from "react-native-datepicker";
import autobind from "autobind-decorator";
import moment from "moment";
import {Theme} from "../../theme";
import {ScheduleTypes} from "../../services/Schedule";

export const fieldData = createFields({
  type: {label: "Type", initialValue: ScheduleTypes.ONCE, type: formTypes.picker},
  startDate: {
    label: "Start Date",
    initialValue: moment().startOf("day"),
    type: formTypes.date,
    format: (x) => moment(x).format("YYYY-MM-DD"),
    parse: (string) => moment(string)
  },
  startTime: {
    label: "Start Time",
    initialValue: ScheduleService.currentTimeToMinutes(),
    type: formTypes.time,
    format: ScheduleService.timeToString,
    parse: ScheduleService.stringToTime
  },
  endTime: {
    label: "End Time",
    initialValue: ScheduleService.currentTimeToMinutes(),
    format: ScheduleService.timeToString,
    parse: ScheduleService.stringToTime,
    type: formTypes.time
  }
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
            style={styles.picker}
            onValueChange={input.onChange}>
            <Picker.Item label={ScheduleTypes.ONCE} value={ScheduleTypes.ONCE}/>
            <Picker.Item label={ScheduleTypes.DAILY} value={ScheduleTypes.DAILY}/>
          </Picker>
        </Item>;
      case formTypes.date:
        return <Item>
          <Label>{label}</Label>
          <DatePicker date={input.value}
                      onDateChange={input.onChange}
                      mode="date"
                      style={styles.datePicker}
                      format="YYYY-MM-DD"
                      {...pickerProps}/>
        </Item>;
      case formTypes.time:
        return <Item>
          <Label>{label}</Label>
          <DatePicker date={input.value} mode="time" format="h:mm A" onDateChange={input.onChange}
                      style={styles.timePicker} {...pickerProps}/>
        </Item>;
    }
  }

  render() {
    return <View>
      <Item itemDivider>
        <Text>Schedule</Text>
      </Item>
      <Field {...this.fields.type}/>
      <Field {...this.fields.startDate}/>
      <Field {...this.fields.startTime}/>
      <Field {...this.fields.endTime}/>
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
  datePicker: {width: 120},
  timePicker: {width: 100},
  picker: {width: 120},
  icon: {fontSize: Theme.iconSizeSmall, color: Theme.pickerIconColor}
});
const pickerProps = {
  iconComponent: <Icon name="arrow-dropdown" style={styles.icon}/>,
  confirmBtnText: "Confirm",
  customStyles: {
    dateInput: styles.noBorder,
    dateText: styles.formText,
    btnTextConfirm: styles.confirmText
  },
  cancelBtnText: "Cancel"
};
