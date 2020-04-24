import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';

import Select from './Select';

const OPTIONS = [
  { label: 'Option 1', value: 'one' },
  { label: 'Option 2', value: 'two' },
  { label: 'Option 3', value: 'three' },
];

describe('Single Select', () => {
  afterEach(cleanup);

  it('Should allow selection of an option and hide after selection', () => {
    const handleChange = jest.fn();
    const { queryByRole, getByRole } = render(<Select options={OPTIONS} onChange={handleChange} />);
    let listbox = queryByRole('listbox');
    expect(listbox).toBe(null);
    const selectTrigger = getByRole('button');
    fireEvent.click(selectTrigger);

    // Should be able to get the listbox and select an option
    listbox = getByRole('listbox');
    const options = listbox.getElementsByTagName('li');
    fireEvent.click(options[0]);
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(['one']);

    // Should hide the listbox after selecting an option
    listbox = queryByRole('listbox');
    expect(listbox).toBe(null);
  });

  it('Should return empty array if option has already been selected', () => {
    const handleChange = jest.fn();
    const { queryByRole, getByRole } = render(<Select options={OPTIONS} value={['one']} onChange={handleChange} />);
    let listbox = queryByRole('listbox');
    const selectTrigger = getByRole('button');
    fireEvent.click(selectTrigger);

    // Should be able to get the listbox and select an option
    listbox = getByRole('listbox');
    const options = listbox.getElementsByTagName('li');
    fireEvent.click(options[0]);
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith([]);

    // Should hide the listbox after selecting an option
    listbox = queryByRole('listbox');
    expect(listbox).toBe(null);
  });

  it('Should return new value if a different value has been selected', () => {
    const handleChange = jest.fn();
    const { queryByRole, getByRole } = render(<Select options={OPTIONS} value={['one']} onChange={handleChange} />);
    let listbox = queryByRole('listbox');
    const selectTrigger = getByRole('button');
    fireEvent.click(selectTrigger);

    // Should be able to get the listbox and select an option
    listbox = getByRole('listbox');
    const options = listbox.getElementsByTagName('li');
    fireEvent.click(options[1]);
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(['two']);

    // Should hide the listbox after selecting an option
    listbox = queryByRole('listbox');
    expect(listbox).toBe(null);
  });

  it('Should be able to open and navigate using the keyboard', () => {
    const handleChange = jest.fn();
    const { queryByRole, getByRole } = render(<Select options={OPTIONS} value={[]} onChange={handleChange} />);
    let listbox = queryByRole('listbox');
    const selectTrigger = getByRole('button');
    fireEvent.keyDown(selectTrigger, {
      key: 'Enter',
      keyCode: 13,
    });

    // Should be able to navigate using arrow keys
    listbox = getByRole('listbox');
    let options = listbox.getElementsByTagName('li');
    expect(options[0].className).toBe('option focusedoption');
    expect(options[1].className).toBe('option');
    expect(options[2].className).toBe('option');

    fireEvent.keyDown(listbox, {
      key: 'ArrowUp',
      keyCode: 38,
    });
    expect(options[0].className).toBe('option');
    expect(options[1].className).toBe('option');
    expect(options[2].className).toBe('option focusedoption');

    fireEvent.keyDown(listbox, {
      key: 'ArrowUp',
      keyCode: 38,
    });
    options = listbox.getElementsByTagName('li');
    expect(options[0].className).toBe('option');
    expect(options[1].className).toBe('option focusedoption');
    expect(options[2].className).toBe('option');

    fireEvent.keyDown(listbox, {
      key: 'ArrowDown',
      keyCode: 38,
    });
    options = listbox.getElementsByTagName('li');
    expect(options[0].className).toBe('option');
    expect(options[1].className).toBe('option');
    expect(options[2].className).toBe('option focusedoption');

    fireEvent.keyDown(listbox, {
      key: 'ArrowDown',
      keyCode: 38,
    });
    options = listbox.getElementsByTagName('li');
    expect(options[0].className).toBe('option focusedoption');
    expect(options[1].className).toBe('option');
    expect(options[2].className).toBe('option');

    fireEvent.keyDown(listbox, {
      key: ' ',
      keyCode: 32,
    });
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(['one']);

    // Re-open the dropdown
    fireEvent.keyDown(selectTrigger, {
      key: 'Enter',
      keyCode: 13,
    });

    listbox = getByRole('listbox');

    fireEvent.keyDown(listbox, {
      key: 'ArrowDown',
      keyCode: 38,
    });
    options = listbox.getElementsByTagName('li');
    expect(options[0].className).toBe('option');
    expect(options[1].className).toBe('option focusedoption');
    expect(options[2].className).toBe('option');

    fireEvent.keyDown(listbox, {
      key: 'Enter',
      keyCode: 32,
    });
    expect(handleChange).toHaveBeenCalledTimes(2);
    expect(handleChange).toHaveBeenCalledWith(['two']);
  });
});

describe('Multi Select', () => {
  afterEach(cleanup);

  it('Should allow selection of multiple options', () => {
    const handleChange = jest.fn();
    const { queryByRole, getByRole } = render(<Select options={OPTIONS} onChange={handleChange} isMultiSelect />);
    let listbox = queryByRole('listbox');
    expect(listbox).toBe(null);
    const selectTrigger = getByRole('button');
    fireEvent.click(selectTrigger);

    // Should be able to get the listbox and select an option
    listbox = getByRole('listbox');
    let options = listbox.getElementsByTagName('li');
    fireEvent.click(options[0]);
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(['one']);

    // Test if dropdown is still open
    listbox = getByRole('listbox');
    options = listbox.getElementsByTagName('li');
    fireEvent.click(options[1]);
    expect(handleChange).toHaveBeenCalledTimes(2);
    // Due to our select not keeping any state itself it only returns one value
    expect(handleChange).toHaveBeenCalledWith(['two']);
  });

  it('Should be able to select multiple options and deselect current option', () => {
    const handleChange = jest.fn();
    const { queryByRole, getByRole } = render(
      <Select options={OPTIONS} value={['one']} onChange={handleChange} isMultiSelect />,
    );
    let listbox = queryByRole('listbox');
    const selectTrigger = getByRole('button');
    fireEvent.click(selectTrigger);

    // Should be able to get the listbox and select an option
    listbox = getByRole('listbox');
    let options = listbox.getElementsByTagName('li');
    fireEvent.click(options[1]);
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(['one', 'two']);

    // Should be able to get the listbox and select an option
    listbox = getByRole('listbox');
    options = listbox.getElementsByTagName('li');
    fireEvent.click(options[0]);
    expect(handleChange).toHaveBeenCalledTimes(2);
    expect(handleChange).toHaveBeenCalledWith([]);
  });

  it('Should be able to open and navigate using the keyboard', () => {
    const handleChange = jest.fn();
    const { queryByRole, getByRole } = render(
      <Select options={OPTIONS} value={[]} onChange={handleChange} isMultiSelect />,
    );
    let listbox = queryByRole('listbox');
    const selectTrigger = getByRole('button');
    fireEvent.keyDown(selectTrigger, {
      key: 'Enter',
      keyCode: 13,
    });

    // Should be able to navigate using arrow keys
    listbox = getByRole('listbox');
    let options = listbox.getElementsByTagName('li');
    expect(options[0].className).toBe('option focusedoption');
    expect(options[1].className).toBe('option');
    expect(options[2].className).toBe('option');

    fireEvent.keyDown(listbox, {
      key: 'ArrowUp',
      keyCode: 38,
    });
    expect(options[0].className).toBe('option');
    expect(options[1].className).toBe('option');
    expect(options[2].className).toBe('option focusedoption');

    fireEvent.keyDown(listbox, {
      key: 'ArrowUp',
      keyCode: 38,
    });
    options = listbox.getElementsByTagName('li');
    expect(options[0].className).toBe('option');
    expect(options[1].className).toBe('option focusedoption');
    expect(options[2].className).toBe('option');

    fireEvent.keyDown(listbox, {
      key: 'ArrowDown',
      keyCode: 38,
    });
    options = listbox.getElementsByTagName('li');
    expect(options[0].className).toBe('option');
    expect(options[1].className).toBe('option');
    expect(options[2].className).toBe('option focusedoption');

    fireEvent.keyDown(listbox, {
      key: 'ArrowDown',
      keyCode: 38,
    });
    options = listbox.getElementsByTagName('li');
    expect(options[0].className).toBe('option focusedoption');
    expect(options[1].className).toBe('option');
    expect(options[2].className).toBe('option');

    fireEvent.keyDown(listbox, {
      key: ' ',
      keyCode: 32,
    });
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(['one']);

    fireEvent.keyDown(listbox, {
      key: 'ArrowDown',
      keyCode: 38,
    });
    options = listbox.getElementsByTagName('li');
    expect(options[0].className).toBe('option');
    expect(options[1].className).toBe('option focusedoption');
    expect(options[2].className).toBe('option');

    fireEvent.keyDown(listbox, {
      key: 'Enter',
      keyCode: 32,
    });
    expect(handleChange).toHaveBeenCalledTimes(2);
    expect(handleChange).toHaveBeenCalledWith(['two']);

    fireEvent.keyDown(listbox, {
      key: 'Escape',
      keyCode: 27,
    });

    // Should hide the listbox after selecting an option
    listbox = queryByRole('listbox');
    expect(listbox).toBe(null);
  });
});
