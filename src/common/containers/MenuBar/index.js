/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { PropTypes, PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import BodyClassName from 'react-body-classname';
import { Scrollbars } from 'react-custom-scrollbars';
import cn from 'classnames/bind';
import { ui } from 'common/redux/modules';
import { GuiControls, Icon } from 'common/components';
import styles from './styles.css';

const mapStateToProps = state => ({
  ...ui.selectors.getMenubar(state),
});

const mapDispatchToProps = dispatch => ({
  toggleMenubar: () => dispatch(ui.actions.toggleMenubar()),
});

@connect(mapStateToProps, mapDispatchToProps)
class MenuBar extends PureComponent {
  static propTypes = {
    classes: PropTypes.func.isRequired,
    animate: PropTypes.bool,
    inverse: PropTypes.bool,
    hoverable: PropTypes.bool,
    toggled: PropTypes.bool,
    fullHeight: PropTypes.bool,
    toggleMenubar: PropTypes.func.isRequired,
  }

  static defaultProps = {
    classes: cn.bind(styles),
    animate: false,
    inverse: false,
    hoverable: false,
    fullHeight: false,
    toggled: false,
  }

  state = {
    visible: false,
  }

  handleMouseEnter = () => {
    if (this.props.hoverable) {
      this.setState({ visible: true });
    }
  }

  handleMouseLeave = () => {
    if (this.props.hoverable) {
      this.setState({ visible: false });
    }
  }

  renderScrollbarThumbVertical = p => (
    <div {...p} className={this.props.classes('scrollbar-vertical')} />
  )

  render() {
    const {
      classes,
      animate,
      inverse,
      toggled,
      fullHeight,
      toggleMenubar,
    } = this.props;

    const bodyClassNames = {
      'menubar-pin': toggled,
      'menubar-visible': toggled || this.state.visible,
      'menubar-first': fullHeight,
    };

    return (
      <div
        className={classes('menubar', animate && 'animate', inverse && 'inverse')}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <BodyClassName className={cn(bodyClassNames)} />
        <div className={classes('menubar-fixed-panel')}>
          <div>
            <a className={classes('menubar-toggle')} onClick={toggleMenubar}>
              <Icon name="bars" />
            </a>
          </div>
          <div className={classes('expanded')}>
            <Link to="/">
              <span className={classes('text-lg', 'text-bold', 'text-primary')}>NCS</span>
            </Link>
          </div>
        </div>
        <Scrollbars
          autoHide
          universal
          renderThumbVertical={this.renderScrollbarThumbVertical}
        >
          <div className={classes('scroll-panel')}>
            <GuiControls inverse={inverse} accordion>
              <GuiControls.Item title="Главная панель" to="/" icon="home" />
              <GuiControls.Item title="Создать" icon="plus-circle">
                <GuiControls.Item title="Задачу" to="/tickets/new" />
                <GuiControls.Item title="Звонок" to="/calls/new" />
              </GuiControls.Item>
              <GuiControls.Item title="Поиск" icon="search">
                <GuiControls.Item title="Задачи" to="/tickets/search" />
                <GuiControls.Item title="Звонка" to="/calls/search" />
              </GuiControls.Item>
              <GuiControls.Item title="Задачи" to="/tickets" icon="th-list" />
              <GuiControls.Item title="Звонки" to="/calls" icon="phone" />
            </GuiControls>
            <div className={classes('foot-panel')}>
              <small className={classes('no-linebreak', 'hidden-folded')}>
                <span className={classes('opacity-75')}>Copyright © 2016</span>{' '}
                <strong>UNICO</strong>
              </small>
            </div>
          </div>
        </Scrollbars>
      </div>
    );
  }
}

export default MenuBar;
