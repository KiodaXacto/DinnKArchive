import React, { PureComponent } from 'react';
import { TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Box } from 'react-native-design-utility';

import { theme } from '../constants/theme';

class Input extends PureComponent {
  state = {};
  render() {
    const { containerStyle, onPress, multiline, numberOfLines, ...rest } = this.props;
    console.log("numberOfLines: ", numberOfLines);
    const height = numberOfLines ? numberOfLines : 1;
    const input = (
      <TextInput
        {...rest}
        multiline={multiline}
        numberOfLines={numberOfLines}
        style={[styles.input, { height: height * 14 }]}
        selectionColor={theme.color.green}
        
      />
    );
    if (typeof onPress === 'function') {
      return (
        <Box
          w={1}
          h={50 * height}
          p="xs"
          radius={6}
          mb="xs"
          style={[
            {
              borderWidth: 1,
              borderColor: theme.color.greyLight,
            },
            containerStyle,
          ]}
          position="relative"
        >
          {input}
          <TouchableOpacity style={styles.touchableSurface} onPress={onPress} />
        </Box>
      );
    }
    return (
      <Box
        w={1}
        h={50 * height}
        p="xs"
        radius={6}
        mb="xs"
        style={[
          {
            borderWidth: 1,
            borderColor: theme.color.greyLight,
          },
          containerStyle,
        ]}
      >
        {input}
      </Box>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    fontSize: 14,
  },
  touchableSurface: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
});

export default Input;