import React from 'react';
import dialogPolyfill from 'dialog-polyfill';

import HeaderWithAddButton from 'components/Admin/Common/HeaderWithAddButton';
import Table from 'components/Admin/Common/Table';
import ConfirmationPopUp from 'components/Common/ConfirmationpopUp';
import Loading from 'components/Common/Loading';

import OverlayForm from './OverlayFilterForm';

class Overlay extends React.Component{

  handleUpdateClick(){
    const projectCode = this.props.match.params.projectCode;

    const updatePayLoad = {};
    updatePayLoad.alias = this.props.overlays.newData.alias;
    updatePayLoad.survey = this.props.overlays.newData.survey ;
    updatePayLoad.column = this.props.overlays.newData.column;
    updatePayLoad.ordering = 1;
    updatePayLoad.id = this.props.overlays.newData.id;
    this.props.updateOverlay(updatePayLoad, projectCode);
  }

  handleSaveClick(){
    const projectCode = this.props.match.params.projectCode;

    const savePayLoad = {};
    savePayLoad.alias = this.props.overlays.newData.alias;
    savePayLoad.survey = this.props.overlays.newData.survey ;
    savePayLoad.column = this.props.overlays.newData.column;
    savePayLoad.ordering = 1;
    this.props.saveOverlay(savePayLoad, projectCode);
  }


  handleDeleteClick(overlayId){
    const projectCode  = this.props.match.params.projectCode;

    const dialog = document.getElementById('pm-overlay-delete');
    document.getElementsByTagName("BODY")[0].appendChild(dialog);
    dialogPolyfill.registerDialog(dialog);

    dialog.querySelector('#success').onclick = function(event) {
      event.preventDefault();
      this.props.deleteOverlay(projectCode, overlayId);
      dialog.close();
    }.bind(this);

    dialog.querySelector('#cancel').onclick =  function() {
      dialog.close();
    };
    dialog.showModal();
  }

  getColumnLabel (surveyData, surveyId, columnId) {
    const column = surveyData[surveyId] ? surveyData[surveyId].fields.filter( col => col.psf_id === columnId ) : [];
    if (column && column.length > 0)
      return column[0].label;
  }

  render () {
    const cols = [
      {label: 'Alias', field: 'alias', width: 1},
      {label: 'Column', field: 'column', width: 1, optional: true},
      {label: 'Survey', field: 'survey', width: 1}
    ];
    const actions = [
      { type: 'edit',   action: this.props.editOverlayStart, tooltip: 'Edit Overlays (for map)' },
      { type: 'delete', action: this.handleDeleteClick.bind(this), tooltip: 'Delete Overlays (from map)' }
    ];

    let data = Object.values(this.props.overlays.data).map (o => ({
      id:o.id,
      alias: o.alias,
      column: o.column,
      survey: o.survey
    })) ;

    if (!this.props.surveys.isFetching) {
      data = Object.values(this.props.overlays.data).map (o => ({
        id:o.id,
        alias: o.alias,
        column: this.getColumnLabel (this.props.surveys.data, o.survey, o.column),
        survey: o.survey && this.props.surveys.data[o.survey] && this.props.surveys.data[o.survey].name
      }));
    }

    return (
      <div>
        <HeaderWithAddButton id='rem-ovr-header' headerText='Overlays' handleAddClick={this.props.addOverlayStart}/>

          {(this.props.surveys.isFetching || this.props.overlays.isFetching) && <Loading style={{height:'80vh'}} viewBox='0 0 68 68'/>}

          {!(this.props.surveys.isFetching || this.props.overlays.isFetching) &&
            <div>
              {!!this.props.overlays.fetchError && <div className='pm-alter pm-alter-error'> {this.props.overlays.fetchError } </div>}

              {!!Object.values(this.props.overlays.data).length &&
                <Table id='rem-ovr-tbl' cols={cols} actions={actions} data={data} />
              }
            </div>
          }
          <ConfirmationPopUp id="pm-overlay-delete" title="Confirm"
           message="Are you certain that you want to delete this Overlay."
           subMessage=" You can't undo this action."
           successButtonText="Yes" cancelButtonText="No"/>
          <OverlayForm moduleObj={this.props.overlays}
              type='Overlay'
              id='pm-mdl-overlay-form'
              surveys={this.props.surveys}
              onChange={this.props.overlayFormFieldChange}
              onSave={this.handleSaveClick.bind(this)}
              onCancel={this.props.overlayEditCancel}/>
      </div>
    );
  }
}

export default Overlay;
