import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import { Box, Text } from 'react-native-design-utility';

import { theme } from '../constants/theme';
import NavigationService from '../api/NavigationService';
import ListColumn from '../commons/ListColumn';
import { Fontisto, MaterialIcons } from '@expo/vector-icons';

@observer
class OrderListItem extends Component {
  state = {};

  handlePress = () => {
    NavigationService.navigate('ShowOrder', {
      screen: 'ShowOrder',
      params: { 
        order: this.props.order, 
      },
    });
  };

  render() {
    const { order } = this.props;
    return (
      <TouchableOpacity style={{ width: "100%" }} onPress={this.handlePress}>
        <ListColumn>
          <ListColumn.Left>
            <Box dir="row" align="center" mb="xs">
              <Box f={0.2}><Fontisto name="origin" {...baseIconStyle} /></Box>

              <Box f={1}>
                <Text>{order.origine.split(",")[0]}</Text>
              </Box>
            </Box>
            <Box dir="row" align="center" mb="xs">
              <Box f={0.2}><Fontisto name="map-marker-alt" {...baseIconStyle} /></Box>

              <Box f={1}>
                <Text>{order.destination.split(",")[0]}</Text>
              </Box>
            </Box>
            <Box dir="row" align="center">
              <Box f={0.2}><MaterialIcons name="update" {...baseIconStyle} /></Box>

              <Box f={1}>
                <Text>{(new Date(order.createdAt)).toString().split("GMT")[0]}</Text>
              </Box>
            </Box>
          </ListColumn.Left>
          <ListColumn.Right>
            <MaterialIcons name="keyboard-arrow-right" {...baseIconStyle} />
          </ListColumn.Right>
        </ListColumn>
      </TouchableOpacity >
    );
  }
}

const baseIconStyle = {
  size: 25,
  color: theme.color.grey,
};


export default OrderListItem;