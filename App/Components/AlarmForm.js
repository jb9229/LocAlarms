import React, {Component} from 'react';
import {Body, Button, Container, Content, Form, Header, Input, Item, Label, Text, Title} from 'native-base';
import {Field, reduxForm} from 'redux-form';
import {View, StyleSheet} from "react-native";
import {Map} from "./Map";
import {Metrics} from "../Theme/Metrics";

const validate = values => {
  const errors = {};
  if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address'
  }
  const requiredFields = [
    'email',
    'password'
  ];
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = 'Required'
    }
  });
  return errors
};

class SimpleForm extends Component {
  constructor(props) {
    super(props);
    this.renderInput = this.renderInput.bind(this);
  }

  componentWillMount() {
    this.setState({isReady: true});
  }

  renderInput({input, label, type, meta: {touched, error}}) {
    let hasError = error && touched;
    return ( <Item style={{margin: 10}} error={hasError} floatingLabel>
      <Label>{label}</Label>
      <Input {...input} secureTextEntry={type === "password"}/>
    </Item> )
  }

  render() {
    const {change} = this.props;
    return (
      <Container>
        <Header>
          <Body>
          <Title>Redux Form</Title>
          </Body>
        </Header>
        <Content>
          <View style={styles.mapContainer}>
            <Map locations={}/>
          </View>
          <Form>
            <Field name="email" label="Email" component={this.renderInput}/>
            <Field name="password" type="password" label="xyz" component={this.renderInput}/>
            <Button style={{margin: 10}}  primary onPress={() => {change("email", "abc")}}>
              <Text>Submit</Text>
            </Button>
          </Form>
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  mapContainer: {
    height: Metrics.screenHeight * 0.5
  }
});

export default reduxForm({
  form: 'test',
  validate
})(SimpleForm)
