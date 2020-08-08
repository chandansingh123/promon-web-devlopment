
import React from 'react';

const MiniFab = ({icon, onClick}) => (
  <button className="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored"
      onClick={onClick} >
    <i className="material-icons">{icon}</i>
  </button>
);

export default MiniFab;
