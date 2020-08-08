
import React from 'react';

const FlatButton = ({ id, icon, label, onClick, style, small }) => {
  const className = label ? 'mdl-button mdl-js-button' : 'mdl-button mdl-js-button mdl-button--icon';
  let buttonStyle = style;
  let iconStyle = {};
  if (small) {
    buttonStyle = {...style, height: 24, width: 24, minWidth: 24};
    iconStyle = {fontSize: 18}
  }

  return (
    <button id={id} className={className} style={buttonStyle} onClick={onClick} >
      <i className='material-icons' style={iconStyle}>{icon}</i>
      { label && <span style={{paddingLeft: 4}}>{label}</span>}
    </button>
  );
}

export default FlatButton;
