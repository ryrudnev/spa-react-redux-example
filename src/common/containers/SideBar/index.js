import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import BodyClassName from 'react-body-classname';
import { compose, pure } from 'recompose';
import cn from 'classnames/bind';
import { Tabs, Tab } from 'react-bootstrap';
import { ui } from 'common/redux/modules';
import styles from './styles.css';

const SideBar = ({ id, classes, toggled, selectedKey, handleSelect }) => (
  <div className={classes('sidebar')}>
    <BodyClassName className={cn(toggled && 'sidebar-visible')} />
    <div className={classes('sidebar-inner', toggled && 'active')}>
      <Tabs activeKey={selectedKey} onSelect={handleSelect} id={id}>
        <Tab eventKey="tasks" title="ЗАДАЧИ">
          <div className={classes('panel-header')}>
            {' '}
          </div>
          <div className={classes('panel-title')}>
              НЕНАЗНАЧЕННЫЕ ЗАДАЧИ
            </div>
        </Tab>
        <Tab eventKey="calls" title="ЗВОНКИ">
          <div className={classes('panel-header')}>
            {' '}
          </div>
        </Tab>
        <Tab eventKey="list" title="МОИ">
          <div className={classes('panel-header')}>
            {' '}
          </div>
        </Tab>
      </Tabs>
    </div>
  </div>
  );

SideBar.propTypes = {
  selectedKey: PropTypes.string,
  handleSelect: PropTypes.func.isRequired,
  classes: PropTypes.func.isRequired,
  toggled: PropTypes.bool,
  id: PropTypes.string,
};

SideBar.defaultProps = {
  selectedKey: null,
  toggled: false,
  classes: cn.bind(styles),
  id: 'sidebar',
};

const mapStateToProps = state => ({
  ...ui.selectors.getSidebar(state),
});

const mapDispatchToProps = dispatch => ({
  handleSelect: eventKey => dispatch(ui.actions.selectSidebar(eventKey)),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  pure,
)(SideBar);
