import React, { PropTypes, PureComponent } from 'react';
import cn from 'classnames/bind';
import { Fade } from 'react-bootstrap';

class Panel extends PureComponent {
  /* eslint-disable react/no-unused-prop-types */
  static propTypes = {
    classes: PropTypes.func.isRequired,
    children: PropTypes.node,
    type: PropTypes.oneOf([
      'default',
      'transparent',
      'widget',
      'primary',
      'success',
      'danger',
      'info',
      'warning',
      'dark',
    ]),
    onClosed: PropTypes.func,
    onShown: PropTypes.func,
    onHidden: PropTypes.func,
  }
  /* eslint-enable react/no-unused-prop-types */

  static defaultProps = {
    classes: cn.bind({}),
    children: null,
    type: 'default',
    onClosed: () => {},
    onShown: () => {},
    onHidden: () => {},
  }

  static childContextTypes = {
    _panel: PropTypes.object.isRequired,
  }

  state = {
    closed: false,
    collapsed: false,
    fullsize: false,
  }

  getChildContext() {
    return {
      _panel: {
        ...this.props,
        ...this.state,
        close: this.close,
        collapse: this.collapse,
        expand: this.expand,
      },
    };
  }

  close = () => this.setState({ closed: null })

  handleClosed = () => this.setState({ closed: true }, this.props.onClosed)

  collapse = () => this.setState({ collapsed: !this.state.collapsed })

  expand = () => this.setState({ fullsize: !this.state.fullsize })

  render() {
    const {
      classes,
      children,
      type,
    } = this.props;

    const {
      closed,
      fullsize,
    } = this.state;

    return (
      <Fade in={closed === false} onExited={this.handleClosed}>
        <div className={classes('panel', `panel-${type}`, fullsize && 'panel-fullsize')}>
          {closed === true ? null : children}
        </div>
      </Fade>
    );
  }
}

export default Panel;
