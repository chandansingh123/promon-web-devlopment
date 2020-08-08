
import React from 'react';
import { css } from 'aphrodite';
import dialogPolyfill from 'dialog-polyfill';

import HeaderWithAddButton from 'components/Admin/Common/HeaderWithAddButton';
import ConfirmationPopUp from 'components/Common/ConfirmationpopUp';
import Loading from 'components/Common/Loading';
import styles from 'components/Admin/Common/styles';
import Table from 'components/ext/mdl/Table';

import RoleForm from './RoleForm';



class Role extends React.Component {

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.role !== this.props.role || nextProps.permission !== this.props.permission;
  }

  handleDeleteClick(userId){
    let dialog = document.getElementById('pm-role-delete');
    document.getElementsByTagName("BODY")[0].appendChild(dialog);
    dialogPolyfill.registerDialog(dialog);
    dialog.querySelector('#success').onclick = function(event) {
      event.preventDefault();
      this.props.deleteRole(userId);
      dialog.close();
    }.bind(this);

    dialog.querySelector('#cancel').onclick =  function() {
      dialog.close();
    };
    dialog.showModal()
  }

  handleMultiSelectChange(field, value){
    const prevField = this.props.role.newData[field] ? this.props.role.newData[field] : [] ;
    const newSelectedObj = [...prevField, value];
    this.props.roleFormFieldChange(field, newSelectedObj);
  }

  handleRemoveSelectedField(field, value){
    let newSelectedObj = Array.from([...this.props.role.newData[field]]);
    const index=  newSelectedObj.indexOf(value);
    if (index > -1) {
      newSelectedObj.splice(index, 1);
    }
    this.props.roleFormFieldChange(field, newSelectedObj);
  }

  prepareDataToDisplay(datas){
    let displayData = [];

    datas.forEach ( data => {
      const convertedData = {...data};
      const permissions = data.permissions
          .map( permission => (this.props.permission.data[permission] ? this.props.permission.data[permission].label : ''))
          .filter (p => (p !== ''));
      convertedData.permissions = permissions.join (', ');
      displayData.push (convertedData);
    });

    return displayData;
  }

  render () {
    const cols = [
      {label: 'Name',        value: 'name',        display: true},
      {label: 'Permissions', value: 'permissions', display: true},
      {label: 'Users',       value: 'users',       display: true}
    ];
    const actions = [
      { type: 'edit',   action: this.props.editRoleStart, tooltip: 'Edit User Roles' },
      { type: 'delete', action: this.handleDeleteClick.bind(this), tooltip: 'Delete Role', disable: (id, data) => data.users }
    ];

    if (this.props.role.isFetching || this.props.permission.isFetching)
      return <Loading style={{height:'80vh'}} viewBox='0 0 38 38'/>;

    const displayData = this.prepareDataToDisplay(Object.values(this.props.role.data));

    return (
      <div className={`${css(styles.mainContent)}`} id='rem-rol-container'>
        <HeaderWithAddButton headerText='Roles' handleAddClick={this.props.addRoleStart} id='rem-rol-header' />

        <Table id='rem-rol-tbl' keyField='id' columns={cols} data={displayData} actions={actions} />

        <RoleForm editMode={this.props.role.editMode} permissions={this.props.permission.data} newRole={this.props.role.newData}
               onChange={this.props.roleFormFieldChange} handleMultiSelectChange={this.handleMultiSelectChange.bind(this)}
               handleRemoveSelectedField={this.handleRemoveSelectedField.bind(this)} handleCancleClick={this.props.roleEditCancel}
               handleSaveClick={() => this.props.saveRole(this.props.role.newData)}
               handleUpdateClick={() => this.props.updateRole(this.props.role.newData)}/>

        <ConfirmationPopUp id="pm-role-delete" title="Confirm"
         message="Are you certain that you want to delete this Role."
         subMessage=" You can't undo this action."
         successButtonText="Yes" cancelButtonText="No"/>
      </div>
    );
  }
}

export default Role;