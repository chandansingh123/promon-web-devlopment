import React from 'react';
import PropTypes from 'prop-types';

const CancelButton = (props) => (
  <button style={props.style} type="button" id={props.id}
    className="mdl-button mdl-js-button mdl-button--raised" onClick={props.onClick}>
    {props.label ? props.label : 'Cancel'}
  </button>
);

CancelButton.propTypes = {
  style: PropTypes.object,
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string
};

export default CancelButton;
