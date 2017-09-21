import React, {Component} from "react";
import {Field} from "redux-form";
import {currentTimeToMinutes, stringToTime, timeToString} from "../../lib/Schedule";
import {attachRender, createFields, formTypes} from "../../lib/ReduxForm";
import {Icon, Item, Label, Text} from "native-base";
import {StyleSheet, View} from "react-native";
import DatePicker from "react-native-datepicker";
import autobind from "autobind-decorator";
import moment from "moment";
import {Theme} from "../../theme";
import {isDefined} from "../../lib/Operators";
import {ScheduleTypes} from "../../lib/Types";
import {Picker, PickerModes} from "./Picker";

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
    initialValue: () => currentTimeToMinutes("h"),
    type: formTypes.time,
    format: timeToString,
    parse: stringToTime
  },
  endTime: {
    label: "End Time",
    initialValue: () => currentTimeToMinutes("h", 1),
    format: timeToString,
    parse: stringToTime,
    type: formTypes.time
  }
});

export class ScheduleForm extends Component {
  fields = attachRender(fieldData, this.renderInput);

  constructor(props) {
    super(props);
  }

  @autobind
  renderInput({input, label, type, meta: {error}}) {
    const hasError = isDefined(error);
    switch (type) {
      case formTypes.picker:
        return <Item>
          <Label>{label}</Label>
          <Picker mode={PickerModes.dropdown}
                  value={input.value}
                  values={[ScheduleTypes.ONCE, ScheduleTypes.DAILY]}
                  onChange={input.onChange}/>
        </Item>;
      case formTypes.date:
        return <Item error={hasError}>
          <Label>{label}</Label>
          <DatePicker date={input.value}
                      onDateChange={input.onChange}
                      mode="date"
                      style={styles.datePicker}
                      format="YYYY-MM-DD"
                      {...pickerProps(hasError)}/>
        </Item>;
      case formTypes.time:
        return <Item error={hasError}>
          <Label>{label}</Label>
          <DatePicker date={input.value} mode="time" format="h:mm A" onDateChange={input.onChange}
                      style={styles.timePicker} {...pickerProps(hasError)}/>
        </Item>;
    }
  }

  render() {
    return <View>
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
  errorText: {
    color: Theme.brandDanger
  },
  confirmText: {
    color: Theme.brandPrimary
  },
  datePicker: {width: 120},
  timePicker: {width: 100},
  picker: {width: 120},
  icon: {fontSize: Theme.iconSizeSmall, color: Theme.pickerIconColor},
  errorIcon: {color: Theme.brandDanger}
});
const pickerProps = (hasError: boolean) => ({
  iconComponent: <Icon name="arrow-dropdown" style={[styles.icon, hasError ? styles.errorIcon : null]}/>,
  confirmBtnText: "Confirm",
  customStyles: {
    dateInput: styles.noBorder,
    dateText: [styles.formText, hasError ? styles.errorText : null],
    btnTextConfirm: styles.confirmText
  },
  cancelBtnText: "Cancel"
});
