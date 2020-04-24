import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';

import CheckBox from './CheckBox';

const label = 'this is a label';

describe('CheckBox', () => {
  afterEach(cleanup);

  it('handles change event', () => {
    const handleChange = jest.fn();
    const { getByTestId } = render(
      <CheckBox label={label} id='check' name='check' onChange={handleChange} testId='check' />,
    );
    const element = getByTestId('check');
    fireEvent.click(element, { target: { checked: true } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('displays label', () => {
    const { getByText } = render(<CheckBox label={label} id='check' name='check' testId='check' />);
    const element = getByText(label);
    expect(element).toBeInTheDocument();
  });

  it('can be disabled', () => {
    const { getByTestId } = render(
      <CheckBox label={label} id='check' name='check' onChange={() => {}} testId='check' disabled />,
    );
    const element = getByTestId('check');
    expect(element.closest('input')).toHaveAttribute('disabled', '');
  });
});
