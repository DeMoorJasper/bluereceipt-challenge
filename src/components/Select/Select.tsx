import React, { FC, useEffect, useRef, useCallback } from 'react';
import classNames from 'classnames';

import Option from './Option';
import styles from './Select.module.scss';
import DropDownMenu from '../DropDownMenu/DropDownMenu';
import DropDownIcon from '../Icons/DropDownIcon';
import useClickOutside from '../../utils/hooks/useClickOutside';

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
  let { placeholder, options, disabled, value = [], isMultiSelect, onChange } = props;
  let [showDropdown, setShowDropdown] = React.useState(false);
  let listboxReference = useRef<HTMLUListElement>(null);
  let [focusedIndex, setFocusedIndex] = React.useState<number>(0);
  let selectedoptions = React.useMemo<Array<Option>>((): Array<Option> => {
    // @ts-ignore
    return value
      .map((currentValue) => options.find((option) => option.value === currentValue))
      .filter((option) => !!option);
  }, [value, options]);
  let label = selectedoptions.length > 0 ? selectedoptions.map((option) => option.label).join(', ') : placeholder;
  let hasListboxReference = listboxReference && typeof listboxReference.current;
  let handleClickOutside = useCallback(() => {
    setShowDropdown(false);
  }, []);
  let containerRef = useClickOutside(handleClickOutside);

  useEffect(() => {
    if (listboxReference && listboxReference.current && showDropdown) {
      setFocusedIndex(0);
      listboxReference.current.focus();
    }
  }, [showDropdown, hasListboxReference]);

  const handleChange = (newValue: Array<string>) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleSelectOption = (selectedIndex: number) => {
    let option = options[selectedIndex];
    let selectedValue = option.value;
    let foundIndex = value.findIndex((currentValue: string) => currentValue === selectedValue);
    if (!isMultiSelect) {
      setShowDropdown(false);
      return handleChange(foundIndex > -1 ? [] : [selectedValue]);
    }

    setFocusedIndex(selectedIndex);

    let valueClone = [...value];
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
    <div className={classNames(styles.select, { [styles.disabled]: disabled })} ref={containerRef}>
      <button
        className={styles.trigger}
        type="button"
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={showDropdown}
        disabled={disabled}
      >
        <span>{label || <span>&zwnj;</span>}</span>
        <DropDownIcon />
      </button>
      <DropDownMenu isOpen={showDropdown && !disabled}>
        <ul role="listbox" ref={listboxReference}>
          {options.map((option, i) => {
            let isSelected = value.includes(option.value);
            let isFocused = focusedIndex === i;

            return (
              <Option
                key={option.value}
                isSelected={isSelected}
                isFocused={isFocused}
                isMultiSelect={isMultiSelect}
                onSelect={() => {
                  handleSelectOption(i);
                }}
                onKeyDown={(event: React.KeyboardEvent<HTMLLIElement>) => {
                  // Down should select next option
                  if (event.key === 'ArrowDown') {
                    event.preventDefault();

                    if (focusedIndex < options.length - 1) {
                      setFocusedIndex(focusedIndex + 1);
                    } else {
                      setFocusedIndex(0);
                    }
                  }

                  // Up should select option above current selection
                  if (event.key === 'ArrowUp') {
                    event.preventDefault();

                    if (focusedIndex > 0) {
                      setFocusedIndex(focusedIndex - 1);
                    } else {
                      setFocusedIndex(options.length - 1);
                    }
                  }

                  // Home should select first option
                  if (event.keyCode === 36) {
                    event.preventDefault();

                    setFocusedIndex(0);
                  }

                  // End should select last option
                  if (event.keyCode === 35) {
                    event.preventDefault();

                    setFocusedIndex(options.length - 1);
                  }

                  // Close using Escape
                  if (event.key === 'Escape') {
                    event.preventDefault();

                    setShowDropdown(false);
                  }
                }}
              >
                {option.label}
              </Option>
            );
          })}
        </ul>
      </DropDownMenu>
    </div>
  );
};

export default Select;
