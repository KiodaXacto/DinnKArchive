import React, { Component } from 'react';
import { Box, Text } from 'react-native-design-utility';
import { StatusBar } from 'react-native';
import ProfileBtn from '../commons/ProfileBtn';
import { strings } from '../lang';


class HomeScreen extends Component {

    constructor(props){
        super(props);
        const {navigation} = this.props;
        const lang = strings;
        navigation.setOptions({
            title: lang.appName,
            headerLeft: ()=>(<ProfileBtn/>)
        })
    }
    
    render() {
        return (
            <Box f={1} center>
                <StatusBar barStyle="light-content" />
                <Text>HomeScreen</Text>
            </Box>
        );
    }
}

export default HomeScreen;