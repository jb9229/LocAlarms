import React, {Component} from 'react';
import {Button, Content, Form, Input, Item, Label, Text} from 'native-base';
import {Field, formValueSelector, reduxForm} from 'redux-form';
import {StyleSheet, View} from "react-native";
import {Map} from "./Maps/Map";
import {Metrics} from "../Theme";
import {connect} from "react-redux";

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
  location: {label: "Location", name: "location", required: true, initialValue: {latitude: 37.784563, longitude: -122.1999405}}
};

class AlarmFormComponent extends Component {
  constructor(props) {
    super(props);
    this.renderInput = this.renderInput.bind(this);
  }

  renderInput({input, label, type, meta: {touched, error}}) {
    if (typeof input.value.latitude !== "undefined" && typeof input.value.longitude !== "undefined") {
      return <View style={styles.mapContainer}>
        <Map locations={[Object.assign({}, input.value, {
          title: this.props.value[fields.name.name],
          radius: 5,
          onDragEnd: input.onChange
        })]}/>
      </View>
    } else {
      let hasError = error && touched;
      return ( <Item style={{margin: 10}} error={hasError} floatingLabel>
        <Label>{label}</Label>
        <Input {...input} secureTextEntry={type === "password"}/>
      </Item> )
    }
  }

  render() {
    const {change, value} = this.props;
    return (
      <Content>
        <Form>
          <Field {...fields.location}
                 component={this.renderInput}
                 parse={(val: string) => {
                   const split = val.split(",");
                   return {latitude: split[0], longitude: split[1]}
                 }}/>
          <Field {...fields.name} component={this.renderInput}/>
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
  }
});
const selector = formValueSelector('test');
export const AlarmForm = connect(state => ({value: selector(state, ...Object.values(fields).map(field => field.name))}), null)(reduxForm({
  form: 'test',
  validate,
  initialValues: Object.keys(fields).reduce((obj, fieldKey) => Object.assign({}, obj, {[fields[fieldKey].name]: fields[fieldKey].initialValue}), {}),
  keepDirtyOnReinitialize: true
})(AlarmFormComponent));
