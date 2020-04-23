import React from 'react';
import { action } from '@storybook/addon-actions';

import Select from './Select';
import '../../App/Root/Root.scss';

export default {
  component: Select,
  title: 'Select',
};

const OPTIONS = [
  { label: 'Option 1', value: 'one' },
  { label: 'Option 2', value: 'two' },
  { label: 'Option 3', value: 'three' },
];

export const singleSelect = () => (
  <Select placeholder='Hello world' options={OPTIONS} onChange={action('changed')} />
);
export const multiSelect = () => (
  <Select placeholder='Hello world' options={OPTIONS} isMultiSelect onChange={action('changed')} />
);
export const disabled = () => (
  <Select placeholder='Hello world' options={OPTIONS} onChange={action('changed')} disabled />
);
export const withoutPlaceholder = () => <Select options={OPTIONS} onChange={action('changed')} />;
