import React, { Component } from 'react';
import { Box, Text } from 'react-native-design-utility';

import OnboardingLogo from '../commons/OnboardingLogo';

import { strings as lang } from "../lang"
import { inject } from 'mobx-react';

class SplashScreen extends Component {
  state = {}; 

  componentDidMount() {
    this.checkAuth();
  }

  checkAuth = () => {
    setTimeout(() => {
      
      this.props.CurrentUser.setupAuth();
    }, 3000);
  };

  render() { 
    return (
      <Box f={1} center>
        <OnboardingLogo slogan={lang.slogan} />
      </Box>
    );
  }
}

export default inject("CurrentUser")(SplashScreen);