
import React from 'react';

const RemoveButton = ({id, onClick}) => (
  <button id={id} className="mdl-button mdl-js-button mdl-button--icon" onClick={onClick} >
    <i className="material-icons">clear</i>
  </button>
);

export default RemoveButton;
