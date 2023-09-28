import React, { Component } from 'react';
import { Box, Text } from 'react-native-design-utility';
import { strings as lang } from '../lang';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import CloseBtn from '../commons/CloseBtn';

class About extends Component {

    constructor(props) {
        super(props);
        /*    props.navigation.setOptions({
                title: lang.ProfileLinks.About,
                headerLeft: () => (<CloseBtn color={theme.color.goldDarker} left size={25} onPress={() => props.navigation.goBack(null)} />),
            })*/
    }
    render() {
        return (
            <>
                <Box f={1} bg="white">
                    <Box f={.06} pt="lg" py="m">
                        <CloseBtn color={theme.color.goldDarker} left size={25} onPress={() => this.props.navigation.goBack(null)} />
                    </Box>
                    <Box f={.84} center pb="xl">
                        <MaterialCommunityIcons name="lightbulb-on-outline" size={100} color={theme.color.greyDark} />
                        <Text px="md" center color="greyDark" mt="md">
                            {lang.aboutText}
                        </Text>
                        <Text size={20} center color="goldDarker" mt="md">
                            {lang.slogan}
                        </Text>
                    </Box>
                </Box>
            </>
        );
    }
}

export default About;