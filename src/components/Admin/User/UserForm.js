import React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';

import DialogForm from 'components/Admin/Common/DialogForm';
import InputField from 'components/Admin/Common/InputField';
import Switch from 'components/Admin/Common/Switch';
import MultiSelect from 'components/Admin/Common/MultiSelect';
import { userEditCancel, saveUser, updateUser, userFormFieldChange, userFormToggleSwitch } from 'actions/userAction';


const styles = {
  fieldsetContainer: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  nameInput: {
    width: '30%'
  },
  formContainer: {
    width: '100%',
    minHeight: 220
  }
};


const UserForm = ({
    data, roles,
    cancel, add, update, onChange, onToggle, onMultiSelectAdd, onMultiSelectRemove
}) => {
  const activeLabel = data.is_active ? 'Active' : 'Inactive';
  const adminLabel = data.is_admin ? 'Has access to admin panel' : 'Does not have access to admin panel';
  const formTitle = data.id ? 'Edit' : 'Add';
  const errors = data.errors || {};

  let options = {};
  Object.values(roles).map( role => options[role.id] = role.name);

  return (
    <DialogForm id='rem-usr-frm' title={`${formTitle} User`} mode={data.id ? 'edit' : 'add'}
        onCancel={cancel} onAdd={_ => add(data)} onUpdate={_ => update((data))}
        show={data.editing} style={{minWidth: 600}}  errors={errors} >

      <div style={styles.fieldsetContainer}>
        <InputField id='rem-usr-frm-first_name' required label='First Name' type='text' field='first_name' value={data.first_name}
          onChange={onChange} style={styles.nameInput}
          errorMsg={errors['first_name'] || "User's first name is required."} />
        <InputField id='rem-usr-frm-middle_name' label='Middle Name' type='text' field='middle_name' value={data.middle_name}
          onChange={onChange} style={styles.nameInput} />
        <InputField id='rem-usr-frm-last_name' required label='Last Name' type='text' field='last_name' value={data.last_name}
          onChange={onChange} style={styles.nameInput}
          errorMsg={errors['last_name'] || "User's last name is required."} />
      </div>

      <InputField id='rem-usr-frm-email' required label='Email' type='email' field='email' value={data.email}
          onChange={onChange} errorMsg={errors['email'] || "User's email is required and must be valid email."} />

      { data.id &&
        <Switch id='rem-usr-frm-is_active' field='is_active' label={activeLabel} onChange={onToggle} checked={data.is_active}/>
      }

      <Switch id='rem-usr-frm-is_admin' field='is_admin' label={adminLabel} onChange={onToggle} checked={data.is_admin}/>

      <MultiSelect id='rem-usr-frm-role' options ={options} field="roles" label='Select Role' removeSelected={onMultiSelectRemove}
        selected={data.roles} onChange={onMultiSelectAdd}/>

    </DialogForm>
  );
}


export default compose (

  connect(
    state => ({
      data: state.users.newData,
      roles: state.role.data,
    }),
    dispatch => ({
      cancel: _ => dispatch(userEditCancel()),
      add: data => dispatch(saveUser(data)),
      update: data => dispatch(updateUser(data)),
      onChange: (field, value) => dispatch(userFormFieldChange(field, value)),
      onToggle: field => dispatch(userFormToggleSwitch(field))
    })
  ),

  withHandlers({
    onMultiSelectAdd: props => (field, value) => {
      const oldValue = props.data[field] ? props.data[field] : [] ;
      props.onChange(field, [...oldValue, value]);
    },

    onMultiSelectRemove: props => (field, value) => {
      const values = [...props.data[field]];
      values.splice(values.indexOf(value), 1 );
      props.onChange(field, values);
    }
  })

) (UserForm);
