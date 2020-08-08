// TODO - the files in this folder are no longer being used. This folder can be deleted.
import React from 'react';
import dialogPolyfill from 'dialog-polyfill';
import { css } from 'aphrodite';

import HeaderWithAddButton from 'components/Admin/Common/HeaderWithAddButton';
import Table from 'components/Admin/Common/Table';
import ConfirmationPopUp from 'components/Common/ConfirmationpopUp';
import Loading from 'components/Common/Loading';
import styles from 'components/Admin/Common/styles';

import SurveyForm from './SurveyForm';


class Survey extends React.Component {

  handleUpdateButtonClick(event){
    event.preventDefault();
    const projectCode = this.props.match.params.projectCode;
    this.props.updateSurvey(projectCode, this.props.surveys.newSurvey)
  }

  handleSaveClick () {
    const projectCode  = this.props.match.params.projectCode;

    if (this.props.surveys.newData.id) {
      const payload = {...this.props.surveys.newData};
      payload.fields = payload.fields.filter (f => f.omk_survey === payload.omk_survey);
      this.props.editFinishSurvey (projectCode, this.props.surveys.newData.id, payload);
    } else
      this.props.addFinishSurvey (projectCode, this.props.surveys.newData);
  }

  handleEditClick(surveyId){
    this.props.editSurveyStart(surveyId);
  }

  handleDeleteClick(surveyId){
    let dialog = document.getElementById('pm-survey-delete');
    document.getElementsByTagName("BODY")[0].appendChild(dialog);
    dialogPolyfill.registerDialog(dialog);
    const projectCode  = this.props.match.params.projectCode;
    dialog.querySelector('#success').onclick = function(event) {
      event.preventDefault();
      this.props.deleteSurvey(projectCode, surveyId);
      dialog.close();
    }.bind(this);

    dialog.querySelector('#cancel').onclick =  function() {
      dialog.close();
    };
    dialog.showModal();
  }

  handleOMKSurveyChange(field, surveyId){
    this.props.formFieldChangeSurvey(field, surveyId);
    
    const surveyfields = this.props.omkSurvey.data[surveyId].fields.map( survey => ({
        group: survey.group,
        label: survey.label,
        value: survey.value,
        id: survey.id,
        display: true,
        defaultDisplay: false}));
    this.props.formFieldChangeSurvey('fields',surveyfields);
  }

  handleAddSurveyFilter(){
    let newSurveyFilters = this.props.surveys.newData.filter.slice(0);
    newSurveyFilters.push({field:'',value:'', values: []});
    this.props.formFieldChangeSurvey('filter',newSurveyFilters);
  }

  handleRemoveFilter(index){
    let newSurveyFilters = [...this.props.surveys.newData.filter.slice(0,index),
      ...this.props.surveys.newData.filter.slice(index+1)];

    this.props.formFieldChangeSurvey('filter',newSurveyFilters);
  }

  handleFilterSurveyFieldValueChange(index, value){
    let newSurveyField = this.props.surveys.newData.filter[index];
    newSurveyField.value = value;
    let newSurveyFilters = [...this.props.surveys.newData.filter.slice(0,index),
      newSurveyField,
      ...this.props.surveys.newData.filter.slice(index+1)];
    this.props.formFieldChangeSurvey('filter',newSurveyFilters);
  }

  handleMultiSelectChange (index, value) {
    const cols = this.props.surveys.newData.join[index].columns || [];
    cols.push (value);
    this.props.onIndexedChangeSurvey ('join', index, 'columns', cols);
  }

  handleRemoveSelectedField (index, value) {
    const cols = this.props.surveys.newData.join[index].columns;
    const idx = cols.indexOf (value);
    if (idx > -1)
      cols.splice (idx, 1);
    this.props.onIndexedChangeSurvey ('join', index, 'columns', cols);
  }

  render () {
    const cols = [
      {label: 'Name',     field: 'name', width: 2},
      {label: 'Baseline', field: 'baseline', width: 1}
    ];
    const actions = [
      { type: 'edit',   action: (id) => this.props.editStartSurvey (id, {data: this.props.surveys.data[id]}), tooltip: 'Edit Project Survey' },
      { type: 'delete', action: this.handleDeleteClick.bind(this), tooltip: 'Delete Project Survey' }
    ];

    let sortedData = Object.values (this.props.surveys.data).sort((a,b) => a.id - b.id );
    const surveyExists = Object.values(this.props.surveys.data).length !== 0;
    const baselineSurvey = Object.values(this.props.surveys.data).filter( survey => survey.baseline);
    const baselineId = baselineSurvey.length > 0 ? baselineSurvey[0].id : undefined;

    const project = Object.values(this.props.projects.data).find(p => p.code === this.props.match.params.projectCode);

    return (
      <div id='rem-srv-container' className={`${css(styles.mainContent)}`}>
        <HeaderWithAddButton disabled={surveyExists && !this.props.multipleSurvey} headerText='Surveys'
            handleAddClick={() => this.props.addSurveyStart (project.id)} id='rem-srv-header'/>

        <Table id='rem-srv-tbl' cols={cols} actions={actions} data={sortedData} />

        { this.props.surveys.isFetching && <Loading style={{height:'80vh'}} viewBox='0 0 68 68'/> }

        <ConfirmationPopUp id="pm-survey-delete" title="Confirm"
         message="Are you certain that you want to delete this Survey."
         subMessage=" You can't undo this action."
         successButtonText="Yes" cancelButtonText="No"/>

        <SurveyForm surveys={this.props.surveys}  omkSurvey={this.props.omkSurvey} show={!!this.props.surveys.newData.editing}
          baselineId={baselineId}
          formSwitchToggle={this.props.formSwitchToggleSurvey}
          onChange={this.props.formFieldChangeSurvey}
          handleCancelClick = {this.props.surveyEditCancel}
          handleSaveClick={this.handleSaveClick.bind(this)}
          handleUpdateClick={this.handleUpdateButtonClick.bind(this)}
          handleSurveyFieldChange={this.props.surveyFormSurveyFieldOnChange}
          handleOMKSurveyChange={this.handleOMKSurveyChange.bind(this)}
          handleSurveyFieldClick={this.props.surveyFormSurveyFieldToggle}
          handleAddSurveyFilter={this.handleAddSurveyFilter.bind(this)}
          removeFilter={this.handleRemoveFilter.bind(this)}
          handleFilterSurveyFieldValueChange={this.handleFilterSurveyFieldValueChange.bind(this)}
          handleMultiSelectChange={this.handleMultiSelectChange.bind(this)}
          handleRemoveSelectedField={this.handleRemoveSelectedField.bind(this)}
          {...this.props}
        />
      </div>
    )
  }
}

export default Survey;

