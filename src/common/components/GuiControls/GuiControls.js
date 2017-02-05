import React, { PropTypes, PureComponent, cloneElement } from 'react';
import cn from 'classnames/bind';
import { createChainedFunction } from 'common/utils/funcUtils';
import ElementChildren from 'common/utils/ElementChildren';
import styles from './styles.css';

class GuiControls extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    classes: PropTypes.func.isRequired,
    inverse: PropTypes.bool,
    accordion: PropTypes.bool,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.element),
      PropTypes.element,
    ]),
  }

  static defaultProps = {
    className: '',
    classes: cn.bind(styles),
    title: '',
    accordion: false,
    inverse: false,
    children: null,
  }

  state = {
    expandedKey: null,
  }

  handleItemExpanded = key => (expanded) => {
    this.setState({ expandedKey: expanded ? key : null });
  }

  renderItem(child, index) {
    const key = child.key || index;
    const props = { key };

    if (this.props.accordion) {
      props.onExpanded = createChainedFunction(
        this.handleItemExpanded(key),
        child.props.onExpanded,
      );
      props.expanded = this.state.expandedKey === key;
    }

    return cloneElement(child, props);
  }

  render() {
    const {
      classes,
      className,
      children,
      inverse,
      accordion, // eslint-disable-line no-unused-vars
      ...otherProps
    } = this.props;

    return (
      <ul className={classes('gui-controls', inverse && 'inverse', className)} {...otherProps}>
        {ElementChildren.map(children, this.renderItem, this)}
      </ul>
    );
  }
}

export default GuiControls;
