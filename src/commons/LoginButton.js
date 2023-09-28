import React from 'react';
import { Box, Text } from 'react-native-design-utility';
import { TouchableOpacity, Image, StyleSheet, Platform } from 'react-native';
import { FontAwesome, Entypo, Ionicons } from '@expo/vector-icons';

import { images } from '../constants/images';
import { theme } from '../constants/theme';

const device = Platform.OS;

const bgColor = type => {
  switch (type) {
    case 'google':
      return 'googleBlue';
    case 'facebook':
      return 'facebookBlue';
    case 'login':
      return "gold";
    case 'signup':
    case "save":
      return "goldDarker";
    default:
      return 'white';
  }
};

const LoginButton = ({ children, type, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Box
      dir="row"
      align="center"
      shadow={1}
      bg={bgColor(type)}
      w="80%"
      self="center"
      p="2xs"
      radius="xs"
      mb="sm"
    >
      <Box mr="sm">
        <Box
          bg="white"
          h={32}
          w={32}
          radius="xs"
          center
          style={{ position: 'relative' }}
        >
          {type === 'google' && <Image source={images.googleColorIcon} />}
          {type === 'facebook' && (
            <FontAwesome
              name="facebook"
              color={theme.color.facebookBlue}
              size={30}
              style={{ position: 'absolute', right: 5, bottom: -3 }}
            />
          )}
          {type === 'login' && (
            <Entypo
              name="login"
              color={theme.color.goldLight}
              size={30}
              style={styles.btnIcon}
            />
          )}
          {type === 'signup' && (
            <Ionicons
              name="ios-person-add"
              color={theme.color.goldLight}
              size={30}
              style={styles.btnIcon}
            />
          )}
          {type === 'save' && (
            <Ionicons
              name="ios-save"
              color={theme.color.goldLight}
              size={30}
              style={styles.btnIcon}
            />
          )}
        </Box>
      </Box>
      <Box>
        <Text size="md" color="white">
          {children}
        </Text>
      </Box>
    </Box>
  </TouchableOpacity>
);

export default LoginButton;

const styles = StyleSheet.create({
  btnIcon: {
    position: 'absolute',
    bottom: device === "android" ?0: -3,
  }
})