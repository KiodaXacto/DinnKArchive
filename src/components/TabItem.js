import React, { PureComponent } from 'react';
import { Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Box, Text } from 'react-native-design-utility';


import { tabBarIcons } from '../constants/images';
import { strings as lang } from '../lang';

class TabItem extends PureComponent {
  handlePress = () => {
    this.props.navigation.navigate(this.props.name);
  };

  render() {
    const { name, isActive } = this.props;

    const icon = tabBarIcons[isActive ? 'active' : 'inactive'][name];
    let label = name.charAt(0).toLowerCase() + name.slice(1);
    label  = lang[label]
    return (
      <Box f={1} pt={10}>
        <TouchableOpacity onPress={this.handlePress} style={styles.button}>
          <Box mb={3}>
            <Image source={icon} />
          </Box>
          <Box>
            <Text size="xs" ls={0.12} color="greyDark" >
              {label}
            </Text>
          </Box>
        </TouchableOpacity>
      </Box>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TabItem;