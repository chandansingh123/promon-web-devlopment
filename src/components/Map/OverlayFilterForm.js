import React from 'react';
import { compose, withProps, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as overlayActionCreators from 'actions/overlayAction';
import * as filterActionCreators from 'actions/filterAction';
import DialogForm from 'components/Admin/Common/DialogForm';
import InputField from 'components/Admin/Common/InputField';
import SelectFn from 'components/Common/SelectFn';


const OverlayFilterForm = ({ projectSurveys, data, type,
    overlayFormFieldChange, overlayEditCancel, addOverlay,
    filterFormFieldChange, filterEditCancel, addFilter, ...props }) => {

  const fieldOpts = data.survey ? props.surveys.data[data.survey].fields : [];
  const onChange = type === 'Overlay' ? overlayFormFieldChange : filterFormFieldChange;
  const onCancel = type === 'Overlay' ? overlayEditCancel : filterEditCancel;
  const onAdd = type === 'Overlay' ? addOverlay : addFilter;

  return (
    <DialogForm id={props.id} title={`Add Temporary ${type}`} mode='add'
      onCancel={onCancel} onAdd={onAdd} onUpdate={props.onUpdate}
      show={data.editing} style={{width: 400, zIndex: 1000}}>

      <div>
        <div>
          <SelectFn id='rem-ovr-frm-survey' field='survey' label="Survey" options={projectSurveys} value={data.survey}
              keyFn={s => s.id} valueFn={s => s.name} onChange={onChange}
              required  errorMsg='Survey is required.' style={{marginTop: -15}} />
        </div>
        <div>
          <SelectFn id='rem-ovr-frm-field' field='column' label="Survey Field" options={fieldOpts}
            value={data.column} onChange={(field, value) => onChange(field, value, +data.survey, props.surveys, true)}
            keyFn={s => s.id} valueFn={s => s.label}
            required  errorMsg='Survey field is required.'  style={{marginTop: -15}} />
        </div>
        <InputField id='rem-ovr-frm-label' label='Name' type='text' field='alias' value={data.alias} onChange={overlayFormFieldChange}
            required  errorMsg='Label is required.' />
      </div>
    </DialogForm>
  )
};


export default compose (

  connect(
    state => ({...state}),
    dispatch => bindActionCreators({...overlayActionCreators, ...filterActionCreators}, dispatch)
  ),

  withProps(props => {
    return {
      projectSurveys: Object.values(props.surveys.data),
      data: props[props.storeSection].newData
    }
  }),

  withHandlers({
    addOverlay: props => _ => props.addTempOverlay (props.overlays.newData, props.session.projectCode),
    addFilter: props => _ => props.addTempFilter (props.filters.newData, props.session.projectCode)
  })
)(OverlayFilterForm);
