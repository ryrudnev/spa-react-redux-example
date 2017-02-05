import React, { PropTypes } from 'react';
import cn from 'classnames/bind';
import { compose, getContext, pure } from 'recompose';
import Icon from '../Icon';

// eslint-disable-next-line no-unused-vars
const Title = ({ classes, className, children, icon, _panel, ...props }) => (
  <div className={classes('panel-title', className)} {...props}>
    {icon && <Icon name={icon} className={classes('titleicon')} />}
    {children}
  </div>
);

Title.propTypes = {
  classes: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node,
  icon: PropTypes.string,
  _panel: PropTypes.object.isRequired,
};

Title.defaultProps = {
  classes: cn.bind({}),
  className: '',
  children: null,
  icon: '',
};

export default compose(
  getContext({ _panel: PropTypes.object.isRequired }),
  pure,
)(Title);
