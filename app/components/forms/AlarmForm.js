import React, {Component} from 'react';
import {Body, Button, Content, Form, Input, Item, Label, Text} from 'native-base';
import {Field, FormSection, formValueSelector, reduxForm} from 'redux-form';
import {Modal, Slider, StyleSheet, TouchableOpacity, View} from "react-native";
import {Map} from "../maps/Map";
import {Metrics, Theme} from "../../theme";
import {connect} from "react-redux";
import type {GeoData, GeoLocation} from "../../lib/Types";
import {geocode} from "../../lib/Geo";
import idx from "idx";
import {AddressSearch} from "./AddressSearch";
import {attachRender, createFields, formTypes, setFormValues} from "../../lib/ReduxForm";
import {fieldData as scheduleField, ScheduleForm} from "./ScheduleForm";
import {isDefined, objectMap} from "../../lib/Operators";
import PropTypes from "prop-types";
import autobind from "autobind-decorator";

const fieldData = createFields({
  name: {label: "Name", required: true, initialValue: "Your alarm", type: formTypes.string},
  location: {initialValue: {latitude: 43.661331, longitude: -79.398625}, type: formTypes.location},
  address: {label: "Address", type: formTypes.customOnFocus},
  radius: {label: "Radius", initialValue: 100, type: formTypes.number},
  schedule: {initialValue: objectMap(scheduleField, val => val.initialValue)}
});

export const alarmFormName = 'AlarmForm';
const selector = formValueSelector(alarmFormName);

@connect(state => ({value: selector(state, ...Object.values(fieldData).map(field => field.name))}), null)
@reduxForm({
  form: alarmFormName,
  validate: values => {
    const errors = {};
    Object.values(fieldData).filter(val => val.required).map(data => data.name).forEach(field => {
      if (!values[field]) {
        errors[field] = 'Required';
      }
    });
    if (values.schedule.startTime > values.schedule.endTime) {
      errors.schedule = {};
      errors.schedule.startTime = errors.schedule.endTime = 'End time must be after start time';
    }
    return errors;
  },
  initialValues: objectMap(fieldData, (value) => value.initialValue),
  keepDirtyOnReinitialize: true
})
export class AlarmForm extends Component {
  static propTypes = {
    initialAlarm: PropTypes.object,
    connected: PropTypes.bool,
    location: PropTypes.object
  };
  fields = attachRender(fieldData, this.renderInput);
  state = {
    searchOpen: false
  };

  componentWillMount() {
    if (this.props.initialAlarm) {
      setFormValues(this.props.change, this.props.initialAlarm);
    } else {
      const loc: GeoData = this.props.location;
      this.changeAddress(loc.coords);
      this.props.change(this.fields.location.name, {latitude: loc.coords.latitude, longitude: loc.coords.longitude});
    }
  }

  changeAddress(location: GeoLocation) {
    geocode(location).then((data) => {
      this.props.change(this.fields.address.name, idx(data, (x) => x.results[0].formatted_address));
    });
  }

  @autobind
  renderInput({input, label, type, meta: {error}}) {
    const hasError = isDefined(error);
    switch (type) {
      case formTypes.location:
        return <View style={styles.mapContainer}>
          <Map locations={[Object.assign({
            onDragEnd: input.onChange,
            title: this.props.value[this.fields.name.name],
            radius: this.props.value[this.fields.radius.name]
          }, input.value)]}/>
        </View>;
      case formTypes.number:
        return (<Item style={styles.noInputContainer}>
          <Label style={styles.sliderLabel}>{label}</Label>
          <Text style={styles.sliderText}>100m</Text>
          <Slider style={styles.slider}
                  thumbTintColor={Theme.brandPrimary}
                  maximumTrackTintColor={Theme.brandPrimary}
                  onSlidingComplete={input.onChange}
                  minimumValue={100}
                  maximumValue={1000}
                  value={input.value}/>
          <Text style={styles.sliderText}>1000m</Text>
        </Item>);
      case formTypes.customOnFocus:
        return ( <Item error={hasError} style={styles.inputContainer}>
          <Label>{label}</Label>
          <TouchableOpacity onPress={() => {
            input.onFocus();
          }} style={styles.noInputContainer}>
            {input.value ? <Text numberOfLines={1}>{input.value}</Text> : <View style={styles.inputFiller}/>}
          </TouchableOpacity>
        </Item> );
      default: {
        return ( <Item error={hasError} style={styles.inputContainer}>
          <Label>{label}</Label>
          <Input {...input}/>
        </Item> );
      }
    }
  }

  render() {
    const {change, handleSubmit} = this.props;
    return (
      <Content keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
        <Modal
          animationType={"slide"}
          transparent={false}
          onRequestClose={() => {
          }}
          visible={this.state.searchOpen}>
          <AddressSearch
            connected={this.props.connected}
            initialValue={this.props.value[this.fields.address.name]}
            onBack={(data: ?{ loc: GeoLocation, address: string }) => {
              if (data) {
                change(this.fields.location.name, data.loc);
                change(this.fields.address.name, data.address);
              }
              this.setState({searchOpen: false});
            }}/>
        </Modal>
        <Form>
          <Field {...this.fields.location}
                 onChange={(_, newValue) => {
                   this.changeAddress(newValue);
                 }}/>
          <Field {...this.fields.name}/>
          <Field {...this.fields.address}
                 onFocus={() => {
                   this.setState({
                     searchOpen: true
                   });
                 }}/>
          <Field {...this.fields.radius}/>
          <FormSection {...this.fields.schedule}>
            <ScheduleForm/>
          </FormSection>
          <Body>
          <Button style={{margin: 10}} primary onPress={handleSubmit}>
            <Text>Submit</Text>
          </Button>
          </Body>
        </Form>
      </Content>
    );
  }
}

const styles = StyleSheet.create({
  mapContainer: {
    height: Metrics.screenHeight * 0.5
  },
  slider: {
    width: "62%"
  },
  noInputContainer: {
    paddingVertical: 10,
    marginRight: 15
  },
  sliderLabel: {
    marginRight: 10
  },
  sliderText: {
    fontSize: 13
  },
  inputContainer: {
    marginHorizontal: 15
  },
  inputFiller: {
    width: 200,
    height: 25
  }
});
