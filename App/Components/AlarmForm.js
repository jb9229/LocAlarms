import React, {Component} from 'react';
import {Button, Content, Form, Input, Item, Label, Text} from 'native-base';
import {Field, formValueSelector, reduxForm} from 'redux-form';
import {Slider, StyleSheet, View} from "react-native";
import {Map} from "./Maps/Map";
import {Metrics} from "../Theme";
import {connect} from "react-redux";
import type {GeoData, GeoLocation} from "../Services/Geo";
import {GeoService} from "../Services/Geo";
import * as idx from "idx";

const validate = values => {
  const errors = {};
  if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address'
  }
  const requiredFields = Object.values(fields).filter(val => val.required).map(data => data.name);
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = 'Required'
    }
  });
  return errors
};
const fields = {
  name: {label: "Name", name: "name", required: true, initialValue: "Your alarm"},
  location: {name: "location", initialValue: {latitude: 0, longitude: 0}},
  address: {name: "address", label: "Address"},
  radius: {name: "radius", label: "Radius", initialValue: 100}
};

class AlarmFormComponent extends Component {
  constructor(props) {
    super(props);
    this.renderInput = this.renderInput.bind(this);
    GeoService.getLocation((loc: GeoData) => {
      this.changeAddress(loc.coords);
      this.props.change(fields.location.name, {latitude: loc.coords.latitude, longitude: loc.coords.longitude});
    })
  }

  changeAddress(location: GeoLocation) {
    GeoService.geocode(location).then((data) => {
      this.props.change(fields.address.name, idx(data, (x) => x[0].formatted_address))
    });
  }

  renderInput({input, label, type, meta: {touched, error}}) {
    if (typeof input.value.latitude !== "undefined" && typeof input.value.longitude !== "undefined") {
      return <View style={styles.mapContainer}>
        <Map locations={[Object.assign({}, input.value, {
          title: this.props.value[fields.name.name],
          radius: 100,
          onDragEnd: input.onChange
        })]}/>
      </View>
    } else if (typeof input.value === "number") {
      return (<Item style={styles.sliderContainer}>
        <Label style={styles.sliderLabel}>{label}</Label>
        <Text style={styles.sliderText}>100m</Text>
        <Slider style={styles.slider}
                onSlidingComplete={input.onChange}
                minimumValue={100}
                maximumValue={1000}
                value={input.value}/>
        <Text style={styles.sliderText}>1000m</Text>
      </Item>)
    } else {
      let hasError = error && touched;
      return ( <Item error={hasError} style={styles.inputContainer}>
        <Label>{label}</Label>
        <Input {...input} secureTextEntry={type === "password"}/>
      </Item> )
    }
  }

  render() {
    const {change} = this.props;
    return (
      <Content>
        <Form>
          <Field {...fields.location} component={this.renderInput} onChange={(evt, newValue) => {
            this.changeAddress(newValue);
          }}/>
          <Field {...fields.name} component={this.renderInput}/>
          <Field {...fields.address} component={this.renderInput}/>
          <Field {...fields.radius} component={this.renderInput}/>
          <Button style={{margin: 10}} primary onPress={() => {
            change("email", "abc")
          }}>
            <Text>Submit</Text>
          </Button>
        </Form>
      </Content>
    )
  }
}

const styles = StyleSheet.create({
  mapContainer: {
    height: Metrics.screenHeight * 0.5
  },
  sliderContainer: {
    paddingVertical: 10,
    marginRight: 15
  },
  slider: {
    width: "62%"
  },
  sliderLabel: {
    marginRight: 10
  },
  sliderText: {
    fontSize: 13
  },
  inputContainer: {
    marginHorizontal: 15
  }
});
const selector = formValueSelector('test');
export const AlarmForm = connect(state => ({value: selector(state, ...Object.values(fields).map(field => field.name))}), null)(reduxForm({
  form: 'test',
  validate,
  initialValues: Object.keys(fields).reduce((obj, fieldKey) => Object.assign({}, obj, {[fields[fieldKey].name]: fields[fieldKey].initialValue}), {}),
  keepDirtyOnReinitialize: true
})(AlarmFormComponent));
