import React from 'react';
import { Box, Text } from 'react-native-design-utility';
import { TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { FontAwesome, Entypo } from '@expo/vector-icons';

import { theme } from '../constants/theme';


const LoginInput = ({ onPress, title, mb, noBG, error, ...rest }) => {
    let btn = <></>
    let edit = true;
    if (typeof onPress === 'function') {
        btn = <TouchableOpacity style={styles.touchableSurface} onPress={onPress} />
        edit = false;
    }
    return (
        <Box
            w="80%"
            self="center"
            p="2xs"
            radius="xs"
            mb={mb}
            position="relative"
        >
            <Box><Text size="md" color="goldDarker">{title}</Text></Box>
            <Box w="100%" shadow={0}>
                <TextInput
                    editable={edit}
                    style={[{
                        padding: theme.space["2xs"],
                        fontSize: theme.text.size.lg,
                        width: "100%",
                        backgroundColor: theme.color.greyLightest
                    }]}
                    {...rest}
                />
            </Box>
            {error && <Box><Text size="md" color="redDarker">{error}</Text></Box>}
            {btn}
        </Box>
    )
};
const styles = StyleSheet.create({
    input: {
        flex: 1,
    },
    touchableSurface: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
    },
});

export default LoginInput;