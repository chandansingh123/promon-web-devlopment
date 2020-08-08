
import React from 'react';

const styles = {
  label: {
    marginBottom: 0, // Override Bootstrap CSS rule
    fontSize: 12
  },
  input: {
    fontSize: 12
  },
  error: {
    width: 400,
    fontSize: 10,
    letterSpacing: .5
  }
};

const SelectFn = ({options, keyFn, valueFn, value, onChange, label, field, id, disabled, width, errorMsg, required}) => {
  const divWidth = width || 200;
  const containerStyle = errorMsg ? {marginBottom: 15} : {paddingRight: 2};
  const isDirtyClass = value ? 'is-dirty' : '';

  return (
    <div style={containerStyle} >
      <div className={`mdl-textfield mdl-js-textfield mdl-textfield--floating-label ${isDirtyClass}`}
        style={{margin: '-15px 10px 0 0', width: divWidth }}>

        {
          required ?
          <select className="mdl-textfield__input" value={value || ''} onChange={ (event) => onChange(field, event.target.value)}
              id={id} disabled={disabled} required style={styles.input} >
            <option value="" disabled/>
            {options && options.map( (opt, idx) => <option value={keyFn(opt)} key={`${id}-${idx}`}> {valueFn(opt)} </option>)}
          </select>
          :
          <select className="mdl-textfield__input" value={value ? value : ''} onChange={ (event) => onChange(field, event.target.value)}
              id={id} disabled={disabled} style={styles.input} >
            <option value="" disabled/>
            {options && options.map( (opt, idx) => <option value={keyFn(opt)} key={`${id}-${idx}`}> {valueFn(opt)} </option>)}
          </select>
        }

        <label className="mdl-textfield__label" htmlFor={id} style={styles.label} >{label}</label>
        { errorMsg && <span className="mdl-textfield__error" style={styles.error} >{errorMsg}</span> }
      </div>
    </div>
  )
};

export default SelectFn;
