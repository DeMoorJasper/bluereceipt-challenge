import React, { FC, useRef } from 'react';
import classNames from 'classnames';

import styles from './Select.module.scss';
import DropDownMenu from '../DropDownMenu/DropDownMenu';
import ArrowIcon from '../Icons/ArrowIcon';
import useHover from '../../../../utils/hooks/useHover';

interface Option {
  value: string;
  label: string;
}

interface Props {
  placeholder?: string;
  options: Array<Option>;
  disabled?: boolean;
  value?: Array<string>;
  onChange?: (value: Array<string>) => void;
  isMultiSelect?: boolean;
}

const Select: FC<Props> = (props) => {
  const { placeholder, options, disabled, value = [], isMultiSelect, onChange } = props;
  const [showDropdown, setShowDropdown] = React.useState(false);
  const selectReference = useRef<HTMLDivElement>(null);
  const isHovering = useHover(selectReference);
  const label = value.length > 0 ? value.join(', ') : placeholder || <span>&zwnj;</span>;

  // TODO: Handle references or something for react-use-form
  const handleChange = (newValue: Array<string>) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleSelectOption = (selectedValue: string) => {
    const foundIndex = value.findIndex((currentValue: string) => currentValue === selectedValue);
    if (!isMultiSelect) {
      setShowDropdown(false);
      return handleChange([selectedValue]);
    }

    const valueClone = [...value];
    if (foundIndex > -1) {
      valueClone.splice(foundIndex, 1);
    } else {
      valueClone.push(selectedValue);
    }
    return handleChange(valueClone);
  };

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      setShowDropdown(!showDropdown);
    }
  };

  const handleTriggerClick = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className={classNames(styles.select, { [styles.disabled]: disabled })} ref={selectReference}>
      <div
        className={styles.trigger}
        onClick={disabled ? undefined : handleTriggerClick}
        onKeyDown={disabled ? undefined : handleTriggerKeyDown}
        role={disabled ? undefined : 'button'}
        tabIndex={disabled ? undefined : 0}
      >
        <span>{label}</span>
        {/* There appears to be no up chevron icon for when dropdown is open :( */}
        <ArrowIcon isHovered={isHovering && !disabled} />
      </div>
      <DropDownMenu isOpen={showDropdown && !disabled}>
        {options.map((option) => {
          const isSelected = value.includes(option.value);

          return (
            <div
              className={styles.option}
              onClick={() => handleSelectOption(option.value)}
              onKeyDown={(event) => {
                if (event.key === 'Space') {
                  handleSelectOption(option.value);
                }
              }}
              tabIndex={0}
              aria-selected={isSelected}
              role='option'
            >
              {option.label}
            </div>
          );
        })}
      </DropDownMenu>
    </div>
  );
};

export default Select;
