import React, { PropTypes } from 'react';
import cn from 'classnames/bind';

import Header from '../Header';
import MenuBar from '../MenuBar';
import SideBar from '../SideBar';

import styles from './styles.css';

const Layout = ({ children, classes }) => (
  <div className={classes('app')}>
    <Header fixed />
    <div className={classes('base')}>
      {children}
      <MenuBar animate inverse hoverable />
      <SideBar />
    </div>
  </div>
);

Layout.propTypes = {
  classes: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

Layout.defaultProps = {
  classes: cn.bind(styles),
};

export default Layout;
