import React, {Component} from 'react'
import {StatusBar} from 'react-native'
import ReduxNavigation from '../Navigation/ReduxNavigation'
import {connect} from 'react-redux'
import {actionDispatcher} from '../Redux'
import ReduxPersist from '../Config/ReduxPersist'
import {View} from "native-base";

// Styles
class RootContainer extends Component {
  componentDidMount() {
    // if redux persist is not active fire startup action
    if (!ReduxPersist.active) {
      this.props.startup()
    }
  }

  render() {
    return (
      <View>
        <StatusBar barStyle='light-content'/>
        <ReduxNavigation/>
      </View>
    )
  }
}

export default connect(null, actionDispatcher)(RootContainer)
