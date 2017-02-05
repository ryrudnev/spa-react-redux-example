import React, { PropTypes } from 'react';
import cn from 'classnames/bind';
import { pure } from 'recompose';
import styles from './styles.css';

const PageHeader = ({ classes, title, children }) => (
  <div className={classes('page-header')}>
    <h1 className={classes('title')}>{title}</h1>
    {children}
  </div>
);

PageHeader.propTypes = {
  classes: PropTypes.func.isRequired,
  title: PropTypes.node.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
};

PageHeader.defaultProps = {
  classes: cn.bind(styles),
  children: null,
};

export default pure(PageHeader);
