import React, { FC } from 'react';

import styles from './DropDownMenu.module.scss';

interface Props {
  /**
   * controls whether to show the dropdown menu or not
   */
  isOpen?: boolean;

  /**
   * The item(s) to display when isOpen is true
   */
  children: React.ReactNode | React.ReactNodeArray;
}

const DropDownMenu: FC<Props> = (props) => {
  const { isOpen = false, children } = props;

  return <div className={styles.dropdownmenu}>{isOpen && <div>{children}</div>}</div>;
};

export default DropDownMenu;
