import React, { PropTypes, PureComponent } from 'react';
import { Link } from 'react-router';
import cn from 'classnames/bind';
import ElementChildren from 'common/utils/ElementChildren';
import Icon from '../Icon';
import styles from './styles.css';

class GuiControl extends PureComponent {
  static propTypes = {
    classes: PropTypes.func.isRequired,
    className: PropTypes.string,
    title: PropTypes.string.isRequired,
    icon: PropTypes.string,
    to: PropTypes.string,
    expanded: PropTypes.bool,
    onExpanded: PropTypes.func,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.element),
      PropTypes.element,
    ]),
  }

  static defaultProps = {
    classes: cn.bind(styles),
    className: '',
    icon: '',
    to: null,
    expanded: false,
    onExpanded: null,
    children: null,
  }

  static contextTypes = {
    router: PropTypes.shape({
      isActive: PropTypes.func.isRequired,
    }),
  }

  state = {
    expanded: this.props.expanded,
  }

  componentWillReceiveProps(nextProps) {
    const { expanded } = nextProps;

    if (expanded !== undefined && expanded !== this.state.expanded) {
      this.setState({ expanded });
    }
  }

  handleOnClick = () => {
    const expanded = !this.state.expanded;
    if (typeof this.props.onExpanded === 'function') {
      this.props.onExpanded(expanded);
    }
    this.setState({ expanded });
  }

  render() {
    const {
      classes,
      className,
      title,
      icon,
      to,
      children,
    } = this.props;

    const { router } = this.context;

    let active = false;
    if (router && to) {
      active = router.isActive(to);
    }

    const folder = ElementChildren.count(children) > 0;

    return (
      <li
        className={classes(
          folder && 'folder',
          active && 'active',
          folder && this.state.expanded && 'expanded',
          className,
        )}
      >
        <Link
          to={to}
          activeClassName={classes('active')}
          onClick={folder ? this.handleOnClick : undefined}
        >
          {icon &&
            <div className={classes('icon')}>
              <Icon name={icon} />
            </div>
          }
          <span className={classes('title')}>{title}</span>
        </Link>
        {folder && <ul>{children}</ul>}
      </li>
    );
  }
}

export default GuiControl;
