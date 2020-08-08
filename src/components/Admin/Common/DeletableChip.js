
import React from 'react';

const styles = {
  label: {
    fontSize: 10
  },
  button: {
    fontSize: 16
  }
};

const DeletableChip = (props) => {
  const labelFontStyle = {...styles.label, ...props.textStyle};

  return (
    <span className="mdl-chip mdl-chip--deletable" style={{...props.style, marginRight: 4, height: 28, lineHeight: '30px'}}>
      <span className="mdl-chip__text" style={{...labelFontStyle, lineHeight: '28px'}} title={props.label} >{props.label}</span>
      <button id={props.id} type="button" className="mdl-chip__action" onClick={props.onDelete} style={{height: 28}} >
        <i className="material-icons" style={styles.button}>cancel</i>
      </button>
    </span>
  );
}

export default DeletableChip;
