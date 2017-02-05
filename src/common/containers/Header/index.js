/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { compose, pure } from 'recompose';
import { Link } from 'react-router';
import BodyClassName from 'react-body-classname';
import { Dropdown, MenuItem } from 'react-bootstrap';
import cn from 'classnames/bind';
import { Icon } from 'common/components';
import { ui, auth, orm } from 'common/redux/modules';
import styles from './styles.css';
import imgUser from './user.png';

const Header = (props) => {
  const {
    user,
    classes,
    fixed,
    toggleMenubar,
    toggleSidebar,
    toggledSidebar,
    logout,
  } = props;

  const bodyClassNames = {
    'header-fixed': fixed,
  };

  return (
    <header className={classes('header', fixed && 'fixed')}>
      <BodyClassName className={cn(bodyClassNames)} />
      <div className={classes('applogo')}>
        <Link to="/" className={classes('logo')}>
          ncs
        </Link>
      </div>
      <a className={classes('menubar-open-button')} onClick={toggleMenubar}>
        <Icon name="bars" />
      </a>
      <a className={classes('sidepanel-open-button')} onClick={toggleSidebar}>
        <Icon name="outdent" />
      </a>
      <ul className={classes('top-right')}>
        <Dropdown
          id="dropdown-create"
          className={classes('link')}
          componentClass="li"
          onToggle={isOpen => isOpen && toggledSidebar && toggleSidebar()}
        >
          <Dropdown.Toggle className={classes('hdbutton')}>
            Создать
          </Dropdown.Toggle>
          <Dropdown.Menu className={classes('menu-list')}>
            <MenuItem eventKey="task">
              <Icon name="sticky-note-o" className={classes('falist')} /> Задачу
            </MenuItem>
            <MenuItem eventKey="call">
              <Icon name="phone-square" className={classes('falist')} /> Звонок
            </MenuItem>
          </Dropdown.Menu>
        </Dropdown>
        <li className={classes('link')}>
          <a className={classes('notifications')}>
            <Icon name="bell" />
            <sup className={classes('badge')}>4</sup>
          </a>
        </li>
        <Dropdown
          id="dropdown-profile"
          className={classes('link')}
          componentClass="li"
          onToggle={isOpen => isOpen && toggledSidebar && toggleSidebar()}
        >
          <Dropdown.Toggle className={classes('profilebox')}>
            <img src={imgUser} role="presentation" alt={user.login} />
            <b>{user.full_name || user.login}</b>
          </Dropdown.Toggle>
          <Dropdown.Menu className={classes('menu-list')}>
            <MenuItem header>Профиль</MenuItem>
            <MenuItem eventKey="settings">
              <Icon name="wrench" className={classes('falist')} /> Настройка
            </MenuItem>
            <MenuItem divider />
            <MenuItem eventKey="logout" onClick={logout}>
              <Icon name="power-off" className={classes('falist')} /> Выход
            </MenuItem>
          </Dropdown.Menu>
        </Dropdown>
      </ul>
    </header>
  );
};

Header.propTypes = {
  classes: PropTypes.func.isRequired,
  fixed: PropTypes.bool,
  toggleMenubar: PropTypes.func.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  toggledSidebar: PropTypes.bool,
  logout: PropTypes.func.isRequired,
  user: PropTypes.shape({
    login: PropTypes.string.isRequired,
    full_name: PropTypes.string,
  }).isRequired,
};

Header.defaultProps = {
  fixed: false,
  classes: cn.bind(styles),
  toggledSidebar: false,
};

const mapStateToProps = state => ({
  user: orm.User.selectors.getAuthUser(state),
  toggledSidebar: ui.selectors.isToogledSidebar(state),
});

const mapDispatchToProps = dispatch => ({
  toggleMenubar: () => dispatch(ui.actions.toggleMenubar()),
  toggleSidebar: () => dispatch(ui.actions.toggleSidebar()),
  logout: () => dispatch(auth.actions.logout()),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  pure,
)(Header);
