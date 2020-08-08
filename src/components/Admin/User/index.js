
import React from 'react';
import { css } from 'aphrodite';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import HeaderWithAddButton from 'components/Admin/Common/HeaderWithAddButton';
import ConfirmationPopUp from 'components/Common/ConfirmationpopUp';
import Loading from 'components/Common/Loading';
import styles from 'components/Admin/Common/styles';
import Table from 'components/ext/mdl/Table';
import { addUserStart, deleteUser, editUserStart } from 'actions/userAction';
import DeleteConfirmationDialog from 'components/Common/DeleteConfirmationDialog';

import UserForm from './UserForm';


const columns = [
  {label: 'First Name',   value: 'first_name',  display: true},
  {label: 'Middle Name',  value: 'middle_name', display: true},
  {label: 'Last Name',    value: 'last_name',   display: true},
  {label: 'Email',        value: 'email',       display: true},
  {label: 'Active',       value: 'is_active',   display: true},
  {label: 'Admin Access', value: 'is_admin',    display: true},
  {label: 'Role',         value: 'rolename',    display: true},
];

const User = ({
  data, isFetching, roles,
  addUser, removeUser, editUser
}) => {

  const deleteConfirmation = (id, row) => DeleteConfirmationDialog({
    onDelete: () => removeUser(id),
    text: `Are you sure you want to remove the user <strong>${row.first_name} ${row.last_name}</strong>?`
  });

  const actions = [
    { type: 'edit',   action: editUser, tooltip: 'Edit User Information' },
    { type: 'delete', action: deleteConfirmation,    tooltip: 'Delete User' }
  ];

  if (isFetching) {
    return <Loading style={{height:'80vh'}} viewBox='0 0 38 38'/>;
  }

  const joinRoles = userRoles => {
    if (userRoles === undefined)
      return '';
    const roleList = userRoles.map (r => roles[+r] ? roles[+r].name : '');
    return roleList ? roleList.join(', ') : '';
  }

  const displayData = data.map (u => ({
    ...u,
    is_active: u.is_active ? 'Yes' : 'No',
    is_admin: u.is_admin ? 'Yes' : 'No',
    rolename: joinRoles(u.roles)
  }));

  return (
    <div className={`${css(styles.mainContent)}`} id='rem-usr-container'>
      <HeaderWithAddButton id='rem-usr-header' headerText='User List' handleAddClick={addUser}/>

      <Table id='rem-usr-tbl' keyField='id' data={displayData} columns={columns} actions={actions} />

      <UserForm  />

      <ConfirmationPopUp id="pm-user-delete" title="Confirm"
        message="Are you certain that you want to delete this User."
        subMessage=" You can't undo this action."
        successButtonText="Yes" cancelButtonText="No"/>
    </div>
  );
};


export default compose (

  connect(
    state => ({
      data: Object.values(state.users.data),
      isFetching: state.users.isFetching,
      roles: state.role.data,
    }),
    dispatch => ({
      addUser: _ => dispatch(addUserStart()),
      removeUser: id => dispatch(deleteUser(id)),
      editUser: id => dispatch(editUserStart(id))
    })
  ),

) (User);
