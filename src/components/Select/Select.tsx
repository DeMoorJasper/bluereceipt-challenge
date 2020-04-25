import React, { FC, useEffect, useRef } from 'react';
import classNames from 'classnames';

import styles from './Select.module.scss';
import DropDownMenu from '../DropDownMenu/DropDownMenu';
import CheckboxIcon from '../Icons/CheckboxIcon';
import DropDownIcon from '../Icons/DropDownIcon';

interface Option {
  /**
   * value is the value that gets returned in onChange
   */
  value: string;

  /**
   * label is the text that gets displayed to the user (mainly useful if value is different from label as in i18n)
   */
  label: string;
}

interface Props {
  /**
   * Placeholder is being shown in case no options are selected
   */
  placeholder?: string;

  /**
   * The possible options a user can select
   */
  options: Array<Option>;

  /**
   * Disabled ensures user cannot select any option and shows the select in a disabled style
   */
  disabled?: boolean;

  /**
   * Value contains the currently selected value(s)
   */
  value?: Array<string>;

  /**
   * onChange is triggered every time an option is selected, with the selected options as a parameter
   */
  onChange?: (value: Array<string>) => void;

  /**
   * isMultiSelect enables the multiselect capabilities of the select
   */
  isMultiSelect?: boolean;
}

const Select: FC<Props> = (props) => {
  const { placeholder, options, disabled, value = [], isMultiSelect, onChange } = props;
  const [showDropdown, setShowDropdown] = React.useState(false);
  const listboxReference = useRef<HTMLUListElement>(null);
  const [focusedIndex, setFocusedIndex] = React.useState<number>(0);
  const selectedoptions = React.useMemo<Array<Option>>((): Array<Option> => {
    return value
      .map((currentValue) => options.find((option) => option.value === currentValue))
      .filter((option) => !!option);
  }, [value]);
  const label = selectedoptions.length > 0 ? selectedoptions.map((option) => option.label).join(', ') : placeholder;

  useEffect(() => {
    if (listboxReference && listboxReference.current && showDropdown) {
      setFocusedIndex(0);
      listboxReference.current.focus();
    }
  }, [showDropdown, listboxReference && typeof listboxReference.current]);

  const handleChange = (newValue: Array<string>) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleSelectOption = (selectedValue: string) => {
    const foundIndex = value.findIndex((currentValue: string) => currentValue === selectedValue);
    if (!isMultiSelect) {
      setShowDropdown(false);
      return handleChange(foundIndex > -1 ? [] : [selectedValue]);
    }

    const valueClone = [...value];
    if (foundIndex > -1) {
      valueClone.splice(foundIndex, 1);
    } else {
      valueClone.push(selectedValue);
    }
    return handleChange(valueClone);
  };

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.keyCode === 32) {
      setShowDropdown(!showDropdown);
    }
  };

  const handleTriggerClick = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className={classNames(styles.select, { [styles.disabled]: disabled })}>
      <button
        className={styles.trigger}
        type='button'
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup='listbox'
        aria-expanded={showDropdown}
        disabled={disabled}
      >
        <span>{label || <span>&zwnj;</span>}</span>
        <DropDownIcon />
      </button>
      <DropDownMenu isOpen={showDropdown && !disabled}>
        <ul
          role='listbox'
          tabIndex={-1}
          ref={listboxReference}
          onBlur={() => setShowDropdown(false)}
          onKeyDown={(event) => {
            // Down should select next option
            if (event.key === 'ArrowDown') {
              if (focusedIndex < options.length - 1) {
                setFocusedIndex(focusedIndex + 1);
              } else {
                setFocusedIndex(0);
              }
            }

            // Up should select option above current selection
            if (event.key === 'ArrowUp') {
              if (focusedIndex > 0) {
                setFocusedIndex(focusedIndex - 1);
              } else {
                setFocusedIndex(options.length - 1);
              }
            }

            // Home should select first option
            if (event.keyCode === 36) {
              setFocusedIndex(0);
            }

            // End should select last option
            if (event.keyCode === 35) {
              setFocusedIndex(options.length - 1);
            }

            // Enter or space
            if (event.key === 'Enter' || event.keyCode === 32) {
              handleSelectOption(options[focusedIndex].value);
            }

            // Close using Escape
            if (event.key === 'Escape') {
              setShowDropdown(false);
            }
          }}
        >
          {options.map((option, i) => {
            const isSelected = value.includes(option.value);

            return (
              <li
                className={classNames(styles.option, { [styles.focusedoption]: focusedIndex === i })}
                onClick={(event) => {
                  // This is to prevent focus issues
                  event.preventDefault();

                  // Set focused element and emit value
                  setFocusedIndex(i);
                  handleSelectOption(option.value);
                }}
                onKeyDown={() => {
                  // Keyboard handling is done by the listbox
                }}
                aria-selected={isSelected}
                role='option'
                key={option.value}
              >
                {isMultiSelect && <CheckboxIcon isActive={isSelected} />}
                <span>{option.label}</span>
              </li>
            );
          })}
        </ul>
      </DropDownMenu>
    </div>
  );
};

export default Select;
