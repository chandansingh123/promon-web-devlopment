
import React from 'react';

// Styles added to override Bootstrap CSS
const styles = {
  label: {
    marginBottom: 0,
    fontSize: 13
  },
  input: {
    fontSize: 13
  },
  error: {
    width: 400,
    fontSize: 10,
    letterSpacing: .5
  }
};

const Select = ({ style, options, value, onChange, id, label, field, disabled, required, errorMsg }) => (
  <div style={style} className={`mdl-textfield mdl-js-textfield mdl-textfield--floating-label ${value && 'is-dirty'}`}>
    { required ?
      <select style={styles.input} disabled={disabled} className="mdl-textfield__input" value={value ? value : ''} required
          onChange={ (event) => onChange(field, event.target.value)} id={id}>
        <option value="" disabled/>
        {Object.keys(options).map( _key => <option value={_key} key={_key}>{options[_key]}</option>)}
      </select>
    :
      <select style={styles.input} disabled={disabled} className="mdl-textfield__input" value={value ? value : ''}
          onChange={ (event) => onChange(field, event.target.value)} id={id}>
        <option value="" disabled/>
        {Object.keys(options).map( _key => <option value={_key} key={_key}>{options[_key]}</option>)}
      </select>
    }
    <label className="mdl-textfield__label" htmlFor={id} style={styles.label} >{label}</label>
    { errorMsg && <span className="mdl-textfield__error" style={styles.error} >{errorMsg}</span> }

  </div>
);

export default Select;
