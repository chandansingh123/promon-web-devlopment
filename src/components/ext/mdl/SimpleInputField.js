import React from 'react';

const SimpleInputField = ({ id, onChange, value, readonly, type, multiline }) => {
  const numberOfLines = value ? value.split(/\r\n|\r|\n/).length : 1;
  let props;
  let style;
  if (readonly) {
    props = { readOnly: 'readonly' }
    style = {
      fontSize: 11,
      color: 'rgba(0,0,0,.26)',
      borderBottom: '1px dotted rgba(0,0,0,.12)'
    };
  } else {
    props = { onChange: event => onChange(event.target.value) }
    style = {
      fontSize: 11
    };
  }

  switch (type) {
    case 'date': props = {...props, type: 'date'}; break;
    case 'datetime': props = {...props, type: 'datetime-local'}; break;
    case 'decimal': props = {...props, type: 'number', step: '0.01'}; break;
    case 'int': props = {...props, type: 'number'}; break;
    default: break;
  }

  return (
    <div className='mdl-textfield mdl-js-textfield rem-omk-detail' style={{ display: 'inline-block', paddingBottom: 0, paddingTop: 8 }}>
      {
        multiline ?
        <textarea className="mdl-textfield__input" type="text" id={id} style={style} value={value || ''} {...props} rows={numberOfLines} />
        :
        <input className="mdl-textfield__input" type="text" id={id} style={style} value={value || ''} {...props} />
      }
    </div>
  );
};

export default SimpleInputField;
