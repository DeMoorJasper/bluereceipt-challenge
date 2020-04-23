import React, { FC, forwardRef, Ref } from 'react';

import styles from './CheckBox.module.scss';

interface Props {
  id: string;

  name: string;

  label: string;

  /**
   * React ref passtrough to input node
   */
  ref?: Ref<HTMLInputElement>;
}

const Input: FC<Props> = forwardRef((props, ref) => {
  const { id, name, label } = props;

  return (
    <label htmlFor={id} className={styles.checkbox}>
      <input type='checkbox' name={name} id={id} ref={ref} />
      <div className={styles.check}>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10.73 7.96'>
          <polyline points='10.03 0.71 4.13 6.55 0.71 3.12' />
        </svg>
      </div>
      <span>{label}</span>
    </label>
  );
});

export default Input;
