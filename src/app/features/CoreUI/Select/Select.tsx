import React, { FC, useEffect, useRef } from 'react';
import classNames from 'classnames';

import styles from './Select.module.scss';
import DropDownMenu from '../DropDownMenu/DropDownMenu';
import ArrowIcon from '../Icons/ArrowIcon';
import useHover from '../../../../utils/hooks/useHover';
import CheckboxIcon from '../Icons/CheckboxIcon';
import useClickOutside from '../../../../utils/hooks/useClickOutside';

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
  const clickOutsideSelect = React.useCallback(() => {
    if (showDropdown) {
      setShowDropdown(!showDropdown);
    }
  }, [showDropdown]);
  const containerReference = useClickOutside<HTMLDivElement>(clickOutsideSelect);
  const isHovering = useHover(containerReference);
  const [selectedoptions, setSelectedOptions] = React.useState<Array<Option>>([]);
  const label = selectedoptions.length > 0 ? selectedoptions.map((option) => option.label).join(', ') : placeholder;
  const listboxReference = useRef<HTMLUListElement>(null);
  const [focusedIndex, setFocusedIndex] = React.useState<number>(0);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const newSelectedOptions: Array<Option> = value
      .map((currentValue) => {
        const foundOption = options.find((option) => option.value === currentValue);
        if (foundOption) {
          return foundOption;
        }
        return null;
      })
      .filter((option) => !!option);

    setSelectedOptions(newSelectedOptions);
  }, [value.join(',')]);

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
    <div className={classNames(styles.select, { [styles.disabled]: disabled })} ref={containerReference}>
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
        {/* There appears to be no up chevron icon for when dropdown is open :( */}
        <ArrowIcon isHovered={isHovering && !disabled} />
      </button>
      <DropDownMenu isOpen={showDropdown && !disabled}>
        <ul
          role='listbox'
          tabIndex={-1}
          ref={listboxReference}
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

            // Home should select first option, aria spec
            if (event.keyCode === 36) {
              setFocusedIndex(0);
            }

            // End should select last option, aria spec
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
                  if (isMultiSelect) {
                    setFocusedIndex(i);
                  }

                  handleSelectOption(option.value);

                  // Without this the button gets focus again...
                  event.preventDefault();
                }}
                onKeyDown={() => {
                  // Keyboard handling is done by the listbox as seen in the aria spec
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
