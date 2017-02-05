import React, { PropTypes } from 'react';
import { pure } from 'recompose';
import { Breadcrumb as RBBreadcrumb } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Item = ({ to, active, children, ...rest }) => {
  if (active) {
    return <RBBreadcrumb.Item active={active} {...rest}>{children}</RBBreadcrumb.Item>;
  }
  return (
    <LinkContainer to={to}>
      <RBBreadcrumb.Item {...rest}>{children}</RBBreadcrumb.Item>
    </LinkContainer>
  );
};

Item.propTypes = {
  to: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  active: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

Item.defaultProps = {
  to: '',
  active: false,
};

export default pure(Item);
