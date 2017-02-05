import React, { PropTypes } from 'react';
import { pure } from 'recompose';
import { Breadcrumb as RBBreadcrumb } from 'react-bootstrap';
import Item from './Item';

const Breadcrumbs = ({ items, ...otherProps }) => (
  items && items.length
    ? <RBBreadcrumb {...otherProps}>
      {
        items.map(
          (itemOptions = {}, i) =>
            // eslint-disable-next-line react/no-array-index-key
            (<Item key={i} {...itemOptions}>
              {itemOptions.title}
            </Item>),
        )
      }
    </RBBreadcrumb>
    : <RBBreadcrumb {...otherProps} />
);

Breadcrumbs.propTypes = {
  items: PropTypes.array,
};

Breadcrumbs.defaultProps = {
  items: [],
};

export default pure(Breadcrumbs);
