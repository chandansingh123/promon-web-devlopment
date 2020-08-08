import React, { PureComponent } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import DeleteConfirmationDialog from 'components/Common/DeleteConfirmationDialog';
import { editProjectUserStart, addProjectUserStart, removeProjectUser } from 'actions/projectAction';
import Table from 'components/ext/mdl/Table';
import ColoredButton from 'components/Admin/Common/ColoredButton';

class UserMgmtTable extends PureComponent {

  render() {
    const { projectCode, users, edit, remove, add } = this.props;

    const deleteConfirmation = (id, row) => DeleteConfirmationDialog({
      onDelete: () => remove(projectCode, id),
      text: `Are you sure you want to remove the user <strong>${row.full_name}</strong> from the project?`
    });

    const columns = [
      {label: 'Name',   value: 'full_name',   display: true},
      {label: 'Email',  value: 'email',       display: true},
      {label: 'Role',   value: 'rolename',    display: true},
    ];

    const actions = [
      { type: 'edit',   action: edit, tooltip: 'Edit User Information' },
      { type: 'delete', action: deleteConfirmation, tooltip: 'Remove User from Project' }
    ];

    return (
      <div>
        <div style={{height: 50, marginTop: 10, marginRight: 10}} >
          <ColoredButton id='rem-prj-add-user-btn' icon='add' label='Add User to project' style={{float: 'right'}}
              onClick={add} />
        </div>

        <Table keyField='id' data={users} columns={columns} actions={actions} />
      </div>
    );

  }
}

const getUsers = state => Object.values(state.projectUsers.data).map(u => ({
  rolename: u.role ? u.role.join(', ') : '',
  ...u
}));

export default compose (

  connect(
    state => ({
      projectCode: state.session.projectCode,
      project: Object.values(state.session.projects).find(p => p.code === state.session.projectCode),
      users: getUsers(state),
    }),
    dispatch => ({
      edit: id => dispatch(editProjectUserStart(id)),
      add: _ => dispatch(addProjectUserStart()),
      remove: (projectCode, id) => dispatch(removeProjectUser(projectCode, id)),
    })
  ),

) (UserMgmtTable);
