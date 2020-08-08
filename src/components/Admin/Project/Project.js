import React from 'react';
import dialogPolyfill from'dialog-polyfill';
import { css } from 'aphrodite';

import Table from 'components/ext/mdl/Table';
import ProjectForm from './ProjectForm';
import ConfirmationPopUp from 'components/Common/ConfirmationpopUp';
import HeaderWithAddButton from 'components/Admin/Common/HeaderWithAddButton';
import styles from 'components/Admin/Common/styles';

class Project extends React.Component {

    shouldComponentUpdate (nextProps, nextState) {
      return nextProps.projects !== this.props.projects;
    }

    handleDeleteClick(id){
        var dialog = document.getElementById('pm-project-delete');
        dialogPolyfill.registerDialog(dialog);
        const project = this.props.projects.data[id]
        dialog.querySelector('#success').onclick = (event) => {
            event.preventDefault();
            this.props.deleteProject(id, project);
            dialog.close();
        };

        dialog.querySelector('#cancel').onclick =  function() {
            dialog.close();
        };

        dialog.showModal();
    }

  render () {
    const cols = [
      {label: 'Name',             value: 'name',        },
      {label: 'Code',             value: 'code',        link: '/admin/project/'},
      {label: 'Active',           value: 'is_active',   },
      {label: 'Multiple Surveys', value: 'survey_type', optional: true},
      {label: 'Uses Map',         value: 'project_map', optional: true},
      {label: 'Location',         value: 'location',    optional: true}
    ];
    const actions = [
      { type: 'edit',   action: this.props.editProjectStart, tooltip: 'Edit Project' },
      { type: 'delete', action: this.handleDeleteClick.bind(this), tooltip: 'Delete Project' }
    ];

    const sortedData = Object.values(this.props.projects.data)
        .sort((a,b) => a.id - b.id )
        .map(p => ({
          id: p.id,
          name: p.name,
          code: p.code,
          is_active: p.is_active ? 'Yes' : 'No',
          survey_type: p.survey_type ? 'Yes' : 'No',
          project_map: p.project_map ? 'Yes' : 'No',
          location: p.location
        }));

    return (
      <div>
        <div className={`${css(styles.mainContent)}`} id='rem-prj-container'>
          <HeaderWithAddButton id='rem-prj-header' headerText='Project List' handleAddClick={() => this.props.addProjectStart()} />

          <Table id='rem-prj-tbl' keyField='id' data={sortedData} columns={cols} actions={actions} />
        </div>

        <ConfirmationPopUp id="pm-project-delete" title="Confirm"
            message="Are you certain that you want to delete this Project."
            subMessage=" You can't undo this action."
            successButtonText="Yes" cancelButtonText="No"/>
        <ProjectForm projects = {this.props.projects}
            onChange = {this.props.projectFormFieldChange}
            toggleSwitch = {this.props.projectFormToggleSwitch}
            handleCancelClick={() => this.props.projectEditCancel()}
            handleSaveClick = {() => this.props.saveProject(this.props.projects.newData)}
            handleUpdateClick={() => this.props.updateProject(this.props.projects.newData)}
            {...this.props} />
       </div>
    );
  }
}

export default Project;