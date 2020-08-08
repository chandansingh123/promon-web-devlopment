
import React from 'react';

import DialogForm from 'components/Admin/Common/DialogForm';
import InputField from 'components/Admin/Common/InputField';
import Switch from 'components/Admin/Common/Switch';

class ProjectForm extends React.Component {

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.projects.newData !== this.props.projects.newData;
  }

  render () {
    const props = this.props;
    const projectActiveText = props.projects.newData.is_active ? 'Active Project': 'Inactive Project';
    const projectSurveyTypeText = props.projects.newData.survey_type ? 'Project will have multiple surveys': 'Project will have a single survey';
    const projectMapText = props.projects.newData.project_map ? 'Contains map' : 'Does not contain map';
    const formTitle = props.projects.editMode ? 'Edit Project' : 'Add Project';
    const multipleSurveys = Object.values (props.surveys.data).filter (s => s.project === props.projects.newData.id).length > 1;
    const errors = props.projects.newData.errors || {};

    return (
      <DialogForm id='rem-prj-frm' title={formTitle} mode={props.projects.editMode ? 'edit' : 'add'}
          onCancel={props.handleCancelClick} onAdd={props.handleSaveClick} onUpdate={props.handleUpdateClick}
          show={props.projects.newData.editing} style={{ width: 450 }}>
  
        <InputField id='rem-prj-frm-name' required label='Name' type='text' field='name' value={props.projects.newData.name} moduleData={props.projects}
            onChange={props.onChange} errorMsg={errors['name'] || 'Project name is required.'} />
        <InputField id='rem-prj-frm-code' required pattern='[a-z0-9]+' disabled={props.projects.editMode} label='Code' type='text' field='code' value={props.projects.newData.code}
            onChange={props.onChange} errorMsg={errors['code'] || 'Project code is required and must only contain letters and numbers.'} />
        <InputField id='rem-prj-frm-location' label='Location' type='text' field='location' value={props.projects.newData.location} onChange={props.onChange}/>

        <Switch id='rem-prj-frm-active' field='is_active' label={projectActiveText} onChange={props.toggleSwitch} checked={props.projects.newData.is_active}/>
        <Switch id='rem-prj-frm-type' disabled={multipleSurveys && props.projects.newData.survey_type} field='survey_type' label={projectSurveyTypeText}
            onChange={props.toggleSwitch} checked={props.projects.newData.survey_type}/>
        <Switch id='rem-prj-frm-map' field='project_map' label={projectMapText} onChange={props.toggleSwitch} checked={props.projects.newData.project_map}/>
      </DialogForm>
    );
  }
}

export default ProjectForm;
