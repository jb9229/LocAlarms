import React, {Component} from 'react';
import {Button, Content, Form, Input, Item, Label, Text} from 'native-base';
import {Field, formValueSelector, reduxForm} from 'redux-form';
import {Modal, Slider, StyleSheet, View} from "react-native";
import {Map} from "./maps/Map";
import {Metrics} from "../theme";
import {connect} from "react-redux";
import type {GeoData, GeoLocation} from "../services/Geo";
import {GeoService} from "../services/Geo";
import * as idx from "idx";
import {AddressSearch} from "./AddressSearch";
import {isDefined} from "../lib/NullCheck";

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
  location: {name: "location", initialValue: {latitude: 43.661331, longitude: -79.398625}},
  address: {name: "address", label: "Address"},
  radius: {name: "radius", label: "Radius", initialValue: 100}
};

class AlarmFormComponent extends Component {
  constructor(props) {
    super(props);
    this.renderInput = this.renderInput.bind(this);
    GeoService.getLocation().then((loc: GeoData) => {
      this.changeAddress(loc.coords);
      this.props.change(fields.location.name, {latitude: loc.coords.latitude, longitude: loc.coords.longitude});
    });
    this.state = {
      searchOpen: false
    }
  }

  changeAddress(location: GeoLocation) {
    GeoService.geocode(location).then((data) => {
      this.props.change(fields.address.name, idx(data, (x) => x.results[0].formatted_address))
    });
  }

  renderInput({input, label, type, meta: {touched, error}}) {
    if (isDefined(input.value.latitude) && isDefined(input.value.longitude)) {
      return <View style={styles.mapContainer}>
        <Map locations={[Object.assign({
          onDragEnd: input.onChange,
          title: this.props.value[fields.name.name],
          radius: this.props.value[fields.radius.name]
        }, input.value)]}/>
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
      let inp = Object.assign({}, input);
      delete inp["onFocus"];
      return ( <Item error={hasError} style={styles.inputContainer}>
        <Label>{label}</Label>
        <Input {...inp}
               secureTextEntry={type === "password"}
               onFocus={() => {
                 input.onFocus()
               }}/>
      </Item> )
    }
  }

  render() {
    const {change} = this.props;
    return (
      <Content keyboardShouldPersistTaps="always">
        <Modal
          animationType={"slide"}
          transparent={false}
          onRequestClose={() => {
          }}
          visible={this.state.searchOpen}>
          <AddressSearch
            initialValue={this.props.value[fields.address.name]}
            onBack={(data: ?{ loc: GeoLocation, address: string }) => {
              if (data) {
                change(fields.location.name, data.loc);
                change(fields.address.name, data.address);
              }
              this.setState({searchOpen: false})
            }}/>
        </Modal>
        <Form>
          <Field {...fields.location} component={this.renderInput}
                 onChange={(evt, newValue) => {
                   this.changeAddress(newValue);
                 }}/>
          <Field {...fields.name} component={this.renderInput}/>
          <Field {...fields.address}
                 component={this.renderInput}
                 onFocus={(event) => {
                   event.preventDefault();
                   this.setState({
                     searchOpen: true
                   })
                 }}/>
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
