import React, { PropTypes } from 'react';
import { compose, getContext, pure } from 'recompose';
import cn from 'classnames/bind';
import Icon from '../../Icon';

/* eslint-disable jsx-a11y/no-static-element-interactions */
const Fullsize = ({ classes, component: Component, _panel, ...props }) => (
  <Component {...props}>
    <a
      className={classes('icon', 'expand-tool')}
      onClick={_panel.expand}
    >
      <Icon name="expand" />
    </a>
  </Component>
  );
/* eslint-enable */

Fullsize.propTypes = {
  classes: PropTypes.func.isRequired,
  className: PropTypes.string,
  component: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.element]),
  _panel: PropTypes.object.isRequired,
};

Fullsize.defaultProps = {
  classes: cn.bind({}),
  className: '',
  component: 'li',
};

export default compose(
  getContext({ _panel: PropTypes.object.isRequired }),
  pure,
)(Fullsize);
