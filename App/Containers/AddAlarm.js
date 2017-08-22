import React, {Component} from "react";
import {Container} from "native-base";
import {connect} from "react-redux";
import {actionDispatcher} from "../Redux/index";

export class AddAlarm extends Component {
  render() {
    return <Container>

    </Container>
  }
}

export const AddAlarmContainer = connect(null, actionDispatcher)(AddAlarm);
