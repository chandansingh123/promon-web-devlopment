
import React from 'react';
import { withRouter } from 'react-router-dom';

import HeaderWithAddButton from 'components/Admin/Common/HeaderWithAddButton';
import ConfirmationPopUp from 'components/Common/ConfirmationpopUp';
import SurveyForm from './SurveyForm';
import dialogPolyfill from 'dialog-polyfill';
import Table from 'components/ext/mdl/Table';

class OmkSurvey extends React.Component{

  saveOmkSurvey = () => {
    this.props.addOmkSurveyStepFinish(this.props.omkSurvey.newData);
  }

  handleDelete(id){
      let dialog = document.getElementById('pm-omk-survey-delete');
      dialogPolyfill.registerDialog(dialog);
      dialog.querySelector('#success').onclick = function(event) {
          event.preventDefault();
          this.props.deleteOmkSurvey(id);
          dialog.close();
      }.bind(this);

      dialog.querySelector('#cancel').onclick =  function() {
          dialog.close();
      };
      dialog.showModal();
  }

  render () {

    const cols = [
      {label: 'Name',          value: 'name',           display: true},
      {label: 'Excel File',    value: 'excel_filename', display: true},
      {label: 'New Records',   value: 'unapproved',     display: true},
      {label: 'Total Records', value: 'approved',       display: true}
    ];

    const actions = [
      { type: 'download', action: this.props.downloadOmkSurvey, tooltip: 'Download Survey Excel File' },
      { type: 'approval', action: (id) => this.props.history.push (`/admin/surveys/${id}`), tooltip: 'Approve/Disapprove Submitted Surveys' },
      { type: 'upload', action: (id) => this.props.history.push (`/admin/surveys/${id}/upload`), tooltip: 'Upload Survey Data File' },
      { type: 'export', action: (id) => this.props.history.push (`/admin/surveys/${id}/data/download`), tooltip: 'Download Survey Data File' },
      { type: 'data', action: (id) => this.props.history.push (`/admin/surveys/${id}/data`), tooltip: 'View/Edit Survey Data' }
    ];

    return(
      <div className="mdl-cell--10-col mdl-cell--1-offset" id='rem-omk-container'>
        <HeaderWithAddButton headerText='OMK Surveys' id='rem-omk-header' handleAddClick={this.props.addOmkSurveyStart}/>

        <Table id='rem-usr-tbl' keyField='id' data={Object.values(this.props.omkSurvey.data)} columns={cols} actions={actions} />

        <SurveyForm {...this.props} show={!!this.props.omkSurvey.newData.editing}
          onCancel={this.props.addOmkSurveyCancel}
          saveOmkSurvey={this.saveOmkSurvey.bind(this)}
          onSwitchToggle={this.props.indexedSwitchToggleOmkSurvey}
          onChange={this.props.indexedFieldChangeOmkSurvey} />

        <ConfirmationPopUp id="pm-omk-survey-delete" title="Confirm"
                message="Are you certain that you want to delete this OMK Survey."
                subMessage=" You can't undo this action."
                successButtonText="Yes" cancelButtonText="No"/>
      </div>
    );
  }
}

export default withRouter (OmkSurvey);
