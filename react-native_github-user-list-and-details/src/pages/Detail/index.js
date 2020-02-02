import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {WebView} from 'react-native-webview';

export default class Detail extends Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.getParam('repository').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({getParam: PropTypes.func}).isRequired,
  };

  render() {
    const {navigation} = this.props;

    return (
      <WebView
        source={{uri: navigation.getParam('repository').html_url}}
        style={{flex: 1}}
      />
    );
  }
}
