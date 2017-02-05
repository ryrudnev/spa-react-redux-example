import React, { PropTypes } from 'react';
import cn from 'classnames/bind';
import { compose, getContext, pure } from 'recompose';

// eslint-disable-next-line no-unused-vars
const Tools = ({ classes, className, children, _panel, ...props }) => (
  <div className={classes('panel-tools', className)} {...props}>{children}</div>
);

Tools.propTypes = {
  classes: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node,
  _panel: PropTypes.object.isRequired,
};

Tools.defaultProps = {
  classes: cn.bind({}),
  className: '',
  children: null,
};

export default compose(
  getContext({ _panel: PropTypes.object.isRequired }),
  pure,
)(Tools);
