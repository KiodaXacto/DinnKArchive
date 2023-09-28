import React, { Component } from 'react';
import { Box, Text } from 'react-native-design-utility';
import { StatusBar, Image, StyleSheet, TouchableOpacity } from 'react-native';
import CloseBtn from '../commons/CloseBtn';

import { inject, observer } from "mobx-react"

import { theme } from "../constants/theme"

import { LanguageContext, strings } from "../lang"
import { ScrollView } from 'react-native-gesture-handler';

import ListColumn from "../commons/ListColumn";

import {
    MaterialIcons,
    EvilIcons,
    Ionicons,
    Feather,
} from '@expo/vector-icons';

import { images } from '../constants/images';

const IMAGE_BASE_URL = "https://dinnkapi.technokocc.fr"

const baseIconStyle = {
    size: 25,
    color: theme.color.grey,
};


@observer
class ProfileScreen extends Component {

    LINKS = [
        {
            link: 'Share',
            icon: <EvilIcons name="share-apple" {...baseIconStyle} />,
        },
        {
            link: 'Help',
            icon: <Ionicons name="ios-help-circle-outline" {...baseIconStyle} />,
        },
        {
            link: 'About',
            icon: <Ionicons name="ios-information-circle-outline" {...baseIconStyle} />,
        },
        {
            link: 'Settings',
            icon: <Feather name="settings" {...baseIconStyle} />,
        },
    ];

    static contextType = LanguageContext;
    constructor(props) {

        super(props);
        const lang = strings;
        props.navigation.setOptions({
            title: lang.profileScreenTitle,
            headerLeft: () => (<CloseBtn color={theme.color.goldDarker} left size={25} onPress={() => props.navigation.goBack(null)} />),
        })

    }
    render() {



        const { info: user } = this.props.CurrentUser
        if (!user) { return <></> }

        const lang = strings ? strings : this.context;
        const LINKS = this.LINKS

        return (
            <Box f={1} bg="white">
                <StatusBar barStyle="dark-content" />
                <ScrollView>
                    <ListColumn>
                        <Box>
                            <Text size="xl" bold>{lang.greeting}{user.prenom}</Text>
                        </Box>
                        <Box circle={50} avatar>
                            {user.image && user.image.contentUrl ?
                                <Image style={{ height: 50, width: 50 }} source={{ uri: IMAGE_BASE_URL + user.image.contentUrl }} />
                                :
                                <Image style={{ height: 50, width: 50 }} source={images.profile} />
                            }
                        </Box>
                    </ListColumn>
                    {LINKS.map(el => (
                        <ListColumn link={el.link} key={el.link}>
                            <ListColumn.Left >
                                <Box dir="row" align="center">
                                    <Box f={0.2}>{el.icon}</Box>

                                    <Box f={1}>
                                        <Text>{lang.ProfileLinks[el.link]}</Text>
                                    </Box>
                                </Box>
                            </ListColumn.Left>
                            <ListColumn.Right>
                                <MaterialIcons name="keyboard-arrow-right" {...baseIconStyle} />
                            </ListColumn.Right>
                        </ListColumn>
                    ))}
                    <TouchableOpacity style={styles.logoutBtn} onPress={() => this.props.CurrentUser.logout()}>
                        <Text bold color="gold">
                            {lang.logout}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </Box>
        );
    }
}
const styles = StyleSheet.create({
    logoutBtn: {
        borderWidth: 1,
        borderColor: theme.color.gold,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
        alignSelf: 'center',
        height: 40,
        marginTop: 20,
    },
});
export default inject("CurrentUser")(ProfileScreen);