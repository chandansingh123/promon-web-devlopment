
import React from 'react';

const style = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  width: 250,
  display: 'inline-block',
  fontSize: 12
}

const CheckBox = ({id, label, field, onClick, checked, width}) => {
  const elementStyle = width ? {...style, width} : style;

  return (
    <div>
      <label className='mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect' htmlFor={id}>
        <input type='checkbox' id={id} className='mdl-checkbox__input' onChange={evt => onClick(field, evt.target.checked)} checked={checked} />
          <div className="mdl-checkbox__label" title={label} style={elementStyle} >
            {label}
          </div>
      </label>
    </div>
  );
};

export default CheckBox;
