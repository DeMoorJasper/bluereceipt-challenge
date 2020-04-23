import React from 'react';
import { render, cleanup } from '@testing-library/react';

import DropDownMenu from './DropDownMenu';

const DROPDOWN_CONTENT = 'dropdown_content';

describe('DropDownMenu', () => {
  afterEach(cleanup);

  it('Hides dropdown if isOpen is false or undefined', () => {
    const { queryByText } = render(<DropDownMenu>{DROPDOWN_CONTENT}</DropDownMenu>);
    const element = queryByText(DROPDOWN_CONTENT);
    expect(element).toBe(null);
  });

  it('Shows dropdown if isOpen is true', () => {
    const { getAllByText } = render(<DropDownMenu isOpen>{DROPDOWN_CONTENT}</DropDownMenu>);
    const element = getAllByText(DROPDOWN_CONTENT);
    expect(element.length).toBe(1);
  });
});
