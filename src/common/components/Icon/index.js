import { PropTypes } from 'react';
import cx from 'classnames';
import {
  compose,
  pure,
  defaultProps,
  mapProps,
  componentFromProp,
  setDisplayName,
  setPropTypes,
} from 'recompose';

const enhance = compose(
  setDisplayName('Icon'),
  setPropTypes({
    component: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.element]),
    name: PropTypes.string.isRequired,
    size: PropTypes.oneOf(['lg', '2x', '3x', '4x', '5x']),
    rotate: PropTypes.oneOf(['45', '90', '135', '180', '225', '270', '315']),
    flip: PropTypes.oneOf(['horizontal', 'vertical']),
    fixedWidth: PropTypes.bool,
    spin: PropTypes.bool,
    pulse: PropTypes.bool,
    stack: PropTypes.oneOf(['1x', '2x']),
    inverse: PropTypes.bool,
  }),
  defaultProps({ component: 'i' }),
  mapProps(({
    className,
    name,
    size,
    rotate,
    flip,
    fixedWidth,
    spin,
    pulse,
    stack,
    inverse,
    ...otherProps
  }) => ({
    className: cx([
      `fa fa-${name}`,
      size && `fa-${size}`,
      rotate && `fa-rotate-${rotate}`,
      flip && `fa-flip-${flip}`,
      fixedWidth && 'fa-fw',
      spin && 'fa-spin',
      pulse && 'fa-pulse',
      stack && `fa-stack-${stack}`,
      inverse && 'fa-inverse',
      className,
    ]),
    ...otherProps,
  })),
  pure,
);

const Icon = enhance(componentFromProp('component'));

export default Icon;
