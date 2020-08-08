
import React from 'react';
import PropTypes from 'prop-types';

// Styles added to override Bootstrap CSS
const styles = {
  error: {
    width: 400,
    fontSize: 10,
    letterSpacing: .5
  },
  input: {
    fontSize: 13,
  }
};

const InputField = (props) => {
  const width = props.width || 300;
  const style = {...props.style};
  if (props.errorMsg)
    style.marginBottom = 20;

  return (
    <div style={style}>
      <div className='mdl-textfield mdl-js-textfield mdl-textfield--floating-label' style={{marginTop: -20, width: width }}>

        { props.required ?
          <input className="mdl-textfield__input" disabled={props.disabled} step={props.step} value={props.value || ''} style={styles.input} type={props.type || 'text'}
           id={props.id} onChange={ (event) => props.onChange && props.onChange( props.field, event.target.value, props.moduleData) } required pattern={props.pattern} />
          :
          <input className="mdl-textfield__input" disabled={props.disabled} step={props.step} value={props.value || ''} style={styles.input} type={props.type || 'text'}
           id={props.id} onChange={ (event) => props.onChange && props.onChange( props.field, event.target.value, props.moduleData) }  pattern={props.pattern}
           min={props.min} max={props.max} />
        }

        <label className="mdl-textfield__label" htmlFor={props.id} style={styles.input} >{props.label}</label>

        { props.errorMsg && <span className="mdl-textfield__error" style={styles.error} >{props.errorMsg}</span> }
      </div>
    </div>
)};

InputField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  field: PropTypes.string.isRequired,

  moduleData: PropTypes.object,
  style: PropTypes.object,
  width: PropTypes.number,
  step: PropTypes.number,
  id: PropTypes.string,
  type: PropTypes.string,
  errorMsg: PropTypes.string
};

export default InputField;
