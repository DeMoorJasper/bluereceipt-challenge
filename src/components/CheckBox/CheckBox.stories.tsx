import React from 'react';
import { action } from '@storybook/addon-actions';

import CheckBox from './CheckBox';
import '../../Root.scss';

export default {
  component: CheckBox,
  title: 'CheckBox',
};

export const normal = () => <CheckBox label='Test' id='check' name='check' onChange={action('onChange')} />;
