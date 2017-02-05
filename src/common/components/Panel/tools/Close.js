import React, { PropTypes } from 'react';
import cn from 'classnames/bind';
import { compose, getContext, pure } from 'recompose';
import Icon from '../../Icon';

/* eslint-disable jsx-a11y/no-static-element-interactions */
const Close = ({ classes, component: Component, _panel, ...props }) => (
  <Component {...props}>
    <a
      className={classes('icon', 'closed-tool')}
      onClick={_panel.close}
    >
      <Icon name="times" />
    </a>
  </Component>
  );
/* eslint-enable */

Close.propTypes = {
  classes: PropTypes.func.isRequired,
  className: PropTypes.string,
  component: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.element]),
  _panel: PropTypes.object.isRequired,
};

Close.defaultProps = {
  classes: cn.bind({}),
  className: '',
  component: 'li',
};

export default compose(
  getContext({ _panel: PropTypes.object.isRequired }),
  pure,
)(Close);
