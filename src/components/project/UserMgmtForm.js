import React from 'react';
import { compose, withHandlers, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import { projectUserformFieldChange, projectUserEditCancel, projectUserEditSave } from 'actions/projectAction';
import { PROJECT_PERMISSIONS } from 'utils/permissions';
import { fetchUsers } from 'actions/userAction';
import CheckBox from 'components/ext/mdl/CheckBox';
import ColoredButton from 'components/Admin/Common/ColoredButton';
import CancelButton from 'components/Admin/Common/CancelButton';
import SelectFn from 'components/Common/SelectFn';

const styles = {
  formSection: {
    fontSize: '20px',
  },
  header: {
    fontSize: '24px',
    margin: '10px 0',
    textDecoration: 'underline'
  }
};


const UserMgmtForm = ({ data, reports, users, project,
    toggleReportAccess, togglePermission, updateField, onCancel, onSave }) => (
  <div>
    <div style={{height: 20}} />
    <form>
      { data.id ?
        <h2 style={styles.header}>Update User - {data.full_name}</h2> :
        <div>
          <h2 style={styles.header}>Add User to Project</h2>
          <SelectFn id='rem-prj-frm-email' options={users} keyFn={u => u.email} valueFn={u => u.first_name + ' ' + u.last_name} value={data.email}
              onChange={updateField} label='User' field='email' errorMsg='User is required.' required />
        </div>
      }

      <div>
        <fieldset style={{marginTop: 20, width: '45%'}}>
          <legend style={styles.formSection}>Access to Reports</legend>
          
          { reports.map(r =>
            <CheckBox key={r.urlcode} id={`rem-prj-frm-reports-${r.urlcode}`} label={r.name} field={r.urlcode}
                checked={!!data.reports.find(rc => rc === r.urlcode)}
                onClick={_ => toggleReportAccess(r.urlcode)} />
          )}
        </fieldset>
      </div>

      <div>
        <fieldset style={{marginTop: 20, width: '45%'}}>
          <legend style={styles.formSection}>Permissions</legend>
          
          { PROJECT_PERMISSIONS.map(p =>
            <CheckBox key={p.code} id={`rem-prj-frm-permissionss-${p.code}`} label={p.text} field={p.code} width='100%'
                checked={!!data.permissions.find(pc => pc === p.code)}
                onClick={_ => togglePermission(p.code)} />
          )}
        </fieldset>
      </div>

      <div style={{padding: '8px 8px 8px 24px', borderTop: '1px solid rgba(0,0,0,.1)', marginTop: 20}}>
        <ColoredButton id='rem-prj-frm-save' style={{marginRight: 8, height: 36}} onClick={() => onSave(project.code, data)} label='Save' />
        <CancelButton id='rem-prj-frm-cancel' style={{marginRight: 8, height: 36}} onClick={onCancel}/>
      </div>

    </form>
  </div>
);


const getNonProjectUsers = state => {
  const projectUsers = new Set(Object.values(state.projectUsers.data).map(u => u.email));
  const nonProjectUsers = Object.values(state.users.data).filter(u => !projectUsers.has(u.email));
  return nonProjectUsers;
};


export default compose (

  connect(
    state => ({
      data: state.projectUsers.newData,
      project: Object.values(state.session.projects).find(p => p.code === state.session.projectCode),
      reports: Object.values(state.reports.data),
      users: getNonProjectUsers(state)
    }),
    dispatch => ({
      updateField: (field, value) => dispatch(projectUserformFieldChange(field, value)),
      onCancel: _ => dispatch(projectUserEditCancel()),
      onSave: (projectCode, data) => dispatch(projectUserEditSave(projectCode, data)),
      fetchUsers: _ => dispatch(fetchUsers())
    })
  ),

  lifecycle({
    componentDidMount() {
      this.props.fetchUsers();
    }
  }),

  withHandlers({
    toggleReportAccess: props => reportCode => {
      const reportCodes = props.data.reports || [];
      const index = reportCodes.indexOf(reportCode);
      if (index > -1)
        reportCodes.splice(index, 1);
      else
        reportCodes.push(reportCode);
      props.updateField('reports', reportCodes);
    },

    togglePermission: props => code => {
      const permissionCodes = props.data.permissions || [];
      const index = permissionCodes.indexOf(code);
      if (index > -1)
        permissionCodes.splice(index, 1);
      else
        permissionCodes.push(code);
      props.updateField('permissions', permissionCodes);
    }
  })

) (UserMgmtForm);
