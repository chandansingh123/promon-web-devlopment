
import React from 'react';
import PropTypes from 'prop-types';

const ColoredButton = (props) => (
  <button type="button" className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" id={props.id}
    style={props.style} disabled={props.disabled} title={props.tooltip}
    onClick={(evt) => {evt.preventDefault(); props.onClick();}} >

    {props.icon && <i className="material-icons">{props.icon}</i>}
    {props.label}
  </button>
);

ColoredButton.propTypes = {
  id: PropTypes.string,
  style: PropTypes.object,
  disabled: PropTypes.bool,
  tooltip: PropTypes.string,
  icon: PropTypes.string,
  label: PropTypes.string,
  onClick: PropTypes.func.isRequired
};

export default ColoredButton;
