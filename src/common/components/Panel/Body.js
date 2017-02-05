import React, { PropTypes } from 'react';
import { compose, getContext, pure } from 'recompose';
import cn from 'classnames/bind';
import { Collapse } from 'react-bootstrap';

const Body = ({ classes, className, children, _panel, ...props }) => (
  <Collapse in={!_panel.collapsed} onEntered={_panel.onShown} onExited={_panel.onHidden}>
    <div className={classes('panel-body', className)} {...props}>
      {children}
    </div>
  </Collapse>
  );

Body.propTypes = {
  classes: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node,
  _panel: PropTypes.object.isRequired,
};

Body.defaultProps = {
  classes: cn.bind({}),
  className: '',
  children: null,
};

export default compose(
  getContext({ _panel: PropTypes.object.isRequired }),
  pure,
)(Body);
