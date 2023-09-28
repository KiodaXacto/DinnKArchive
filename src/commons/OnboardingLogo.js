import React from 'react';
import { Box, Text } from 'react-native-design-utility';
import { Image } from 'react-native';

import { images } from '../constants/images';

const OnboardingLogo = (props) => (
    <Box center>
        <Box mb="xxs">
            <Image source={images.logo} />
        </Box>
        <Box mb="sm" >
            <Text color="gray" size="xl">
                Di
        <Text color="goldDark" size="xl">
                    nnK
        </Text>
            </Text>
        </Box>
        <Text size="sm" color="goldDarker">{props.slogan}</Text>
    </Box>
);

export default OnboardingLogo;