
import React from 'react';
import { StyleSheet, css } from 'aphrodite';

const commonStyles = {
  bar: {
    position: 'absolute',
    top: 36,
    height: 1,
    borderTop: '1px solid #BDBDBD'
  },
};

const styles = StyleSheet.create ({
  leftBar: {
    ...commonStyles.bar,
    left: 0,
    right: '50%',
    marginRight: 20,
  },
  rightBar: {
    ...commonStyles.bar,
    right: 0,
    left: '50%',
    marginLeft: 20
  },
  optional: {
    textAlign: 'center',
    color: 'rgba(0, 0, 0, .26)',
    fontSize: 12
  },
  optionalActive: {
    color: 'rgba(0, 0, 0, .54)'
  },
  title: {
    marginTop: 16,
    fontSize: 12,
    fontWeight: 'normal',
    textAlign: 'center',
    color: 'rgba(0, 0, 0, .26)'
  },
  titleActive: {
    fontWeight: 500,
    color: 'rgba(0, 0, 0, .87)'
  },
  titleDone: {
    fontWeight: 300
  }
});


const Step = (props) => {
  const optionalClass = `${css(styles.optional)} ` + (props.active ? `${css(styles.optionalActive)}` : '');
  let titleClass = `${css(styles.title)} `;
  if (props.active) titleClass += `${css(styles.titleActive)} `;
  if (props.done || props.editable) titleClass +=  `${css(styles.titleDone)} `;

  return (
    <div style={props.style} className={`pm-stepper-step ${(props.done || props.active) && 'active-step'}
      ${props.done && 'step-done'} ${props.editable && 'editable-step'}`}>
      <div className="pm-stepper-circle"><span>{props.index + 1}</span></div>
      <div className={titleClass}>{props.label}</div>
      <div className={optionalClass}>{props.subLabel}</div>
      <div className={props.index > 0 ? `${css(styles.leftBar)}` : ''}></div>
      <div className={props.index !== (props.count -1) ? `${css(styles.rightBar)}` : ''}></div>
    </div>
  );
}

export default Step;
