import React, { FC } from 'react';
import classNames from 'classnames';

import styles from './Option.module.scss';
import useFocus from '../../utils/hooks/useFocus';
import CheckboxIcon from '../Icons/CheckboxIcon';

interface Props {
  isMultiSelect?: boolean;
  isSelected?: boolean;
  isFocused?: boolean;
  onSelect: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLLIElement>) => void;
  children?: React.ReactNode | React.ReactNodeArray;
}

const Option: FC<Props> = (props: Props) => {
  let { isSelected, isMultiSelect, isFocused, onSelect, onKeyDown, children } = props;
  let ref = useFocus<HTMLLIElement>(!!isFocused);

  return (
    <li
      ref={ref}
      className={classNames(styles.option, { [styles.focusedoption]: isFocused })}
      onClick={onSelect}
      tabIndex={-1}
      onKeyDown={(event) => {
        // Enter or space
        if (event.key === 'Enter' || event.keyCode === 32) {
          event.preventDefault();
          return onSelect();
        }

        onKeyDown(event);
      }}
      role="option"
      aria-selected={isSelected}
    >
      {isMultiSelect && <CheckboxIcon isActive={isSelected} />}
      <span>{children}</span>
    </li>
  );
};

export default Option;
