
import React from 'react';
import PropTypes from 'prop-types';

const styles = {
  container: {
    padding: 5
  },
  input: {
    display: 'none'
  },
  label: {
    fontSize: 13,
    left: 42,
    position: 'absolute'
  }
};


const Switch = (props) => (
  <div style={{...styles.container, ...props.style}}>
    <label className={`mdl-switch mdl-js-switch mdl-js-ripple-effect ${!!props.checked && 'is-checked'}`} >
      <input id={props.id} disabled={props.disabled} type="checkbox" className="mdl-switch__input" style={styles.input}
          checked={!!props.checked} onChange={ () => props.onChange(props.field)} />
      <span className="mdl-switch__label" style={styles.label}>{props.label}</span>
    </label>
  </div>
);


Switch.propTypes = {
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  field: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,

  style: PropTypes.object,
  disabled: PropTypes.bool
}


export default Switch;
