import { Entypo, Fontisto } from '@expo/vector-icons';
import React, { Component } from 'react';
import { Linking, Platform, StyleSheet, TouchableOpacity } from "react-native";
import { Box, Text } from 'react-native-design-utility';
import CloseBtn from '../commons/CloseBtn';
import { theme } from '../constants/theme';
import { strings as lang } from '../lang';

class Help extends Component {

    tel = "";

    email = "Contact@dinnk.fr";

    addres = "21 boulevard d'Alsace Lorraine 80000, Amiens";

    encodedAdress = encodeURIComponent(this.addres);
    _goToAdress() {
        if (Platform.OS === 'ios') {
            Linking.openURL(`http://maps.apple.com/?daddr=${this.encodedAdress}`);
        } else {
            Linking.openURL(`http://maps.google.com/?daddr=${this.encodedAdress}`);
        }
    }

    _goToMail() {
        Linking.openURL(`mailto:${this.email}`);
    }
    
    _goToTel(){
        Linking.openURL(`tel:${this.tel}`);
    }

    render() {
        return (
            <>
                <Box f={1} bg="white">
                    <Box f={.06} pt="lg" py="m">
                        <CloseBtn color={theme.color.goldDarker} left size={25} onPress={() => this.props.navigation.goBack(null)} />
                    </Box>
                    <Box f={.84} center pb="xl">
                        <Entypo name="help" size={80} color={theme.color.greyDark} />
                        <Text px="xs" center color="greyDark" mt="md">
                            {lang.helpText}
                        </Text>
                        <Box mb="xs"></Box>
                        <TouchableOpacity style={styles.link} onPress={() => this._goToAdress()} >
                            <Box f={1} center>
                                <Fontisto name="map-marker-alt" {...baseIconStyle} />
                                <Text center color="greyDarker" size={20}>
                                    {this.addres}
                                </Text>
                            </Box>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.link} onPress={() => this._goToMail()}>
                            <Box f={1} center>
                                <Entypo name="email" {...baseIconStyle} />
                                <Text center color="greyDarker" size={20} >
                                    {this.email}
                                </Text>
                            </Box>
                        </TouchableOpacity>
                        <Text size={20} center color="goldDarker">
                            {lang.slogan}
                        </Text>
                    </Box>
                </Box>
            </>
        );
    }
}

const baseIconStyle = {
    size: 30,
    color: theme.color.grey
}
const styles = StyleSheet.create({
    link: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
        alignSelf: 'center',
        flex: 1,
    },

})
export default Help;