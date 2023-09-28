import React from 'react';
import { EvilIcons } from '@expo/vector-icons';

import HeaderBtn from './HeaderBtn';
import { theme } from '../constants/theme';

const CloseBtn = ({ color, size, name, ...rest }) => {
  
  return (
    <HeaderBtn {...rest}>
      <EvilIcons color={color} size={size} name={name?name:"close"} />
    </HeaderBtn>
  )
};

CloseBtn.defaultProps = {
  color: theme.color.green,
  size: 18,
};

export default CloseBtn;