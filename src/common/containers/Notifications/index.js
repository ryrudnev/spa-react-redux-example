import { PropTypes, createElement } from 'react';
import { connect } from 'react-redux';
import { compose, pure } from 'recompose';
import { AlertList } from 'react-bs-notifier';
import { toast } from 'common/redux/modules';

const NotificationsManager = ({
  position,
  toasts,
  maxToasts,
  ...otherProps
}) => createElement(
  AlertList,
  { position, alerts: toasts.slice(0, maxToasts), ...otherProps },
);

NotificationsManager.propTypes = {
  maxToasts: PropTypes.number,
  position: PropTypes.oneOf(['top-right', 'top-left', 'bottom-right', 'bottom-left']),
  toasts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.any.isRequired,
    type: PropTypes.oneOf(['info', 'success', 'warning', 'danger']),
    headline: PropTypes.string,
    message: PropTypes.node.isRequired,
    timeout: PropTypes.number,
    showIcon: PropTypes.bool,
    dismissTitle: PropTypes.string,
  })).isRequired,
};

NotificationsManager.defaultProps = {
  position: 'top-right',
  maxToasts: 3,
};

const mapStateToProps = state => ({
  toasts: toast.selectors.getAll(state),
});

const mapDispatchToProps = dispatch => ({
  onDismiss: ({ id }) => dispatch(toast.actions.remove(id)),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  pure,
)(NotificationsManager);
