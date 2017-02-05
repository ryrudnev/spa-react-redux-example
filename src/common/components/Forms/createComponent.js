import { createElement, PureComponent, PropTypes } from 'react';
import {
  HelpBlock,
  FormGroup,
  FormControl,
  InputGroup,
  Col,
  ControlLabel,
} from 'react-bootstrap';
import cx from 'classnames';
import invariant from 'invariant';
import { flow, omit, get, identity, isEqual, isFunction, isNull } from 'lodash/fp';
import { createSelectorCreator, defaultMemoize } from 'reselect';
import { getDisplayName } from 'common/utils/elementUtils';

// create a "selector creator" that uses lodash.isEqual instead of ===
const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  isEqual,
);

/**
 * Creates a field component class that renders the given base component
 *
 * @param BaseComponent The base component to render (for example React Bootstrap Componet)
 * @param mapProps A mapping of props provided by redux-form to the props of component needs
 */
export default function createComponent(BaseComponent, mapProps = identity) {
  invariant(
    isFunction(mapProps) || isNull(mapProps),
    'Expected mapProps to be a function, undefined or null.',
  );

  /* eslint-disable react/no-unused-prop-types */
  const fieldPropTypes = {
    label: PropTypes.node,
    labelProps: PropTypes.object,
    help: PropTypes.node,
    labelColProps: PropTypes.object,
    inputColProps: PropTypes.object,
    formGroupProps: PropTypes.object,
    feedbackProps: PropTypes.object,
    helpProps: PropTypes.object,
    icon: PropTypes.node,
    prependAddon: PropTypes.node,
    appendAddon: PropTypes.node,
    success: PropTypes.bool,
    feedback: PropTypes.bool,
    rounded: PropTypes.bool,
    lined: PropTypes.bool,
    input: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    meta: PropTypes.shape({
      error: PropTypes.string,
      touched: PropTypes.bool,
    }).isRequired,
  };
  /* eslint-enable react/no-unused-prop-types */

  const mapComponentProps = flow(
    createDeepEqualSelector(
      get('input'),
      omit(Object.keys(fieldPropTypes)),
      ({ className, rounded, lined, icon }) => cx(
        className,
        rounded && 'form-control-radius',
        lined && 'form-control-line',
        icon && 'form-control-with-icon',
      ),
      (inputProps, omitedProps, className) => ({
        ...inputProps,
        ...omitedProps,
        className,
      }),
    ),
    mapProps || identity,
  );

  return class FieldComponent extends PureComponent {
    static displayName = `Forms(${getDisplayName(BaseComponent)})`

    static propTypes = fieldPropTypes

    static defaultProps = {
      formGroupProps: {},
      feedbackProps: {},
      helpProps: {},
      icon: null,
      label: null,
      prependAddon: null,
      appendAddon: null,
      labelProps: { className: 'form-label' },
      labelColProps: null,
      inputColProps: null,
      help: null,
      success: false,
      feedback: false,
      rounded: false,
      lined: false,
    }

    renderLabel() {
      const {
        label,
        labelProps,
        labelColProps,
      } = this.props;

      if (!label) {
        return null;
      }

      if (labelColProps) {
        return createElement(Col, {
          componentClass: ControlLabel,
          ...labelColProps,
          ...labelProps,
        }, label);
      }

      return createElement(ControlLabel, { ...labelProps }, label);
    }

    renderFieldGroup() {
      const {
        icon,
        prependAddon,
        appendAddon,
      } = this.props;

      const fieldProps = mapComponentProps(this.props);

      const elements = [
        prependAddon,
        createElement(BaseComponent, fieldProps),
        appendAddon,
        icon,
      ];

      return prependAddon || appendAddon ?
        [createElement(InputGroup, null, elements)] :
        elements;
    }

    renderFeedback() {
      const {
        feedback,
        feedbackProps,
      } = this.props;

      if (!feedback) {
        return null;
      }

      return createElement(FormControl.Feedback, { ...feedbackProps });
    }

    renderHelpBlock() {
      const {
        meta,
        help,
        helpProps,
      } = this.props;

      const hasError = meta.touched && meta.error;

      if (!hasError && !help) {
        return null;
      }

      return createElement(HelpBlock, { ...helpProps }, hasError ? meta.error : help);
    }

    render() {
      const {
        meta,
        input,
        formGroupProps,
        inputColProps,
        success,
      } = this.props;

      const hasError = meta.touched && meta.error;

      let validationState;
      if (hasError) {
        validationState = 'error';
      } else {
        validationState = meta.touched && success ? 'success' : null;
      }

      const controlId = input.name;

      const children = [
        ...this.renderFieldGroup(),
        this.renderHelpBlock(),
        this.renderFeedback(),
      ];

      return createElement(
        FormGroup,
        { ...formGroupProps, validationState, controlId },
        this.renderLabel(),
        ...inputColProps ?
          [createElement(Col, { ...inputColProps }, ...children)] :
          children,
      );
    }
  };
}
