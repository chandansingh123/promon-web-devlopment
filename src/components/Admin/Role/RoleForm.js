import React from 'react';

import DialogForm from 'components/Admin/Common/DialogForm';
import InputField from 'components/Admin/Common/InputField';
import MultiSelect from 'components/Admin/Common/MultiSelect';

class RoleForm extends React.Component {

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.newRole !== this.props.newRole;
  }

  render () {
    const props = this.props;
    const formTitle = props.editMode ? 'Edit Role' : 'Add Role';
    const errors = props.newRole.errors || {};

    let options = {};
    Object.values(props.permissions).map( permission => options[permission.id] = permission.label);

    return (
      <DialogForm id='rem-rol-frm' title={formTitle} mode={props.editMode ? 'edit' : 'add'}
          onCancel={props.handleCancleClick} onAdd={props.handleSaveClick} onUpdate={props.handleUpdateClick}
          show={props.newRole.editing} style={{width: 400}} errors={errors} >
        <InputField id='rem-rol-frm-name' label='Name' type='text' field='name' value={props.newRole.name} onChange={props.onChange}
            required errorMsg={errors['name'] || 'Role name is required.'} />
        <MultiSelect id='rem-rol-frm-permissions' options ={options} field="permissions" label='Select Permissions'
            removeSelected={props.handleRemoveSelectedField} selected={props.newRole.permissions} onChange={props.handleMultiSelectChange}/>
      </DialogForm>
    );
  }
}

export default RoleForm;
