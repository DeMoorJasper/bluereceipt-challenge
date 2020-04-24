import React, { FC, forwardRef, Ref } from 'react';

import styles from './CheckBox.module.scss';

interface Props {
  /**
   * Identifier for form submit
   */
  name: string;

  /**
   * Content for the label
   */
  label: string;

  /**
   * Register callback for change event
   * TODO: Maybe change this to `(checked: boolean) => void;` ?
   */
  onChange?: (evt: React.ChangeEvent<HTMLInputElement>) => void;

  /**
   * Current value of input
   */
  value?: string;

  /**
   * Disabled the checkbox
   */
  disabled?: boolean;

  /**
   * An id used for getting the input in tests
   */
  testId?: string;

  /**
   * React ref passtrough to input node
   */
  ref?: Ref<HTMLInputElement>;
}

const CheckBox: FC<Props> = forwardRef((props, ref) => {
  const { name, label, value, onChange, testId, disabled } = props;

  return (
    <label className={styles.checkbox}>
      <input
        type='checkbox'
        name={name}
        ref={ref}
        value={value}
        onChange={onChange}
        data-testid={testId}
        disabled={disabled}
      />
      <div className={styles.check}>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10.73 7.96'>
          <polyline points='10.03 0.71 4.13 6.55 0.71 3.12' />
        </svg>
      </div>
      <span>{label}</span>
    </label>
  );
});

export default CheckBox;
