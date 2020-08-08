import React, { PureComponent } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import DeleteConfirmationDialog from 'components/Common/DeleteConfirmationDialog';
import { addStartFullSurvey, removeFullSurvey, editStartFullSurvey } from 'actions/fullSurveyAction';
import Table from 'components/ext/mdl/Table';
import ColoredButton from 'components/Admin/Common/ColoredButton';
import { PERMISSIONS, hasPermission } from 'utils/permissions';

class SurveyMgmtTable extends PureComponent {

  render() {
    const { data, projectCode, projectInfo, edit, remove, add } = this.props;

    const deleteConfirmation = (id, row) => DeleteConfirmationDialog({
      onDelete: () => remove(projectCode, id),
      text: `Are you sure you want to remove the survey <strong>${row.name}</strong>?`
    });

    const columns = [
      {label: 'Name',   value: 'name',   display: true},
    ];

    const canDelete = projectInfo && hasPermission(PERMISSIONS.SURVEY_DELETE, [], projectInfo.permissions);
    const actions = [
      { type: 'edit',   action: id => edit(projectCode, id), tooltip: 'Edit Survey Information'},
      { type: 'delete', action: deleteConfirmation, tooltip: 'Remove Survey' , hide: !canDelete }
    ];

    return (
      <div>
        <div style={{height: 50, marginTop: 10, marginRight: 10}} >
          <ColoredButton id='rem-prj-add-survey-btn' icon='add' label='Add Survey' style={{float: 'right'}}
              onClick={add} />
        </div>

        <Table keyField='id' data={data} columns={columns} actions={actions} />
      </div>
    );

  }
}


export default compose (

  connect(
    state => ({
      projectCode: state.session.projectCode,
      projectInfo: state.session.projects ? state.session.projects.find(p => p.code === state.session.projectCode) : {},
      data: Object.values(state.surveys.data),
    }),
    dispatch => ({
      edit: (projectCode, id) => dispatch(editStartFullSurvey(projectCode, id)),
      add: _ => dispatch(addStartFullSurvey()),
      remove: (projectCode, id) => dispatch(removeFullSurvey(projectCode, id)),
    })
  ),

) (SurveyMgmtTable);
