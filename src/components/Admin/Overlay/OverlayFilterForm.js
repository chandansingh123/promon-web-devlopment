import React from 'react';

import DialogForm from 'components/Admin/Common/DialogForm';
import InputField from 'components/Admin/Common/InputField';
import SelectFn from 'components/Common/SelectFn';


const OverlayFilterForm = (props) => {
  const title = props.moduleObj.editMode ? 'Edit' : 'Add';

  const data = props.moduleObj.newData;
  const fieldOpts = data.survey ? props.surveys.data[data.survey].fields.filter(field => field.psf_id) : [];

  return (
    <DialogForm id={props.id} title={`${title} ${props.type}`} mode={props.moduleObj.editMode ? 'edit' : 'add'}
      onCancel={props.onCancel} onAdd={props.onSave} onUpdate={props.onUpdate}
      show={data.editing} style={{width: 400, zIndex: 1000}}>

      <div>
        <div>
          <SelectFn id='rem-ovr-frm-survey' field='survey' label="Survey" options={Object.values(props.surveys.data)} value={data.survey}
              keyFn={s => s.id} valueFn={s => s.name} onChange={props.onChange}
              required  errorMsg='Survey is required.' style={{marginTop: -15}} />
        </div>
        <div>
          <SelectFn id='rem-ovr-frm-field' field='column' label="Survey Field" options={fieldOpts}
            value={data.column} onChange={(field, value) => props.onChange (field, value, +data.survey, props.surveys)}
            keyFn={s => s.psf_id} valueFn={s => s.label}
            required  errorMsg='Survey field is required.'  style={{marginTop: -15}} />
        </div>
        <InputField id='rem-ovr-frm-label' label='Name' type='text' field='alias' value={data.alias} onChange={props.onChange}
            required  errorMsg='Label is required.' />
      </div>
    </DialogForm>
  )
};

export default OverlayFilterForm;
