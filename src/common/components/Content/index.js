import React, { PropTypes } from 'react';
import cn from 'classnames/bind';
import { pure } from 'recompose';
import styles from './styles.css';

const Content = ({ children, classes, className }) => (
  <div className={classes('content', className)}>
    <section>
      <div className={classes('section-body')}>
        {children}
      </div>
    </section>
  </div>
);

Content.propTypes = {
  classes: PropTypes.func.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
};

Content.defaultProps = {
  classes: cn.bind(styles),
  children: null,
  className: '',
};

export default pure(Content);
