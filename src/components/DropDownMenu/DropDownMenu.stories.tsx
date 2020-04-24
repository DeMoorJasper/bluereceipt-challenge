import React from 'react';

import DropDownMenu from './DropDownMenu';
import '../../Root.scss';

export default {
  component: DropDownMenu,
  title: 'DropDownMenu',
};

export const open = () => <DropDownMenu isOpen>This is some content</DropDownMenu>;
export const closed = () => <DropDownMenu>This is some content</DropDownMenu>;
