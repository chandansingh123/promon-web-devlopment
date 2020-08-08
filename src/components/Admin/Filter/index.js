import React from 'react';
import dialogPolyfill from 'dialog-polyfill';

import HeaderWithAddButton from 'components/Admin/Common/HeaderWithAddButton';
import Table from 'components/Admin/Common/Table';
import FilterForm from '../Overlay/OverlayFilterForm';
import ConfirmationPopUp from 'components/Common/ConfirmationpopUp';
import Loading from 'components/Common/Loading';

class Filter extends React.Component {

  handleUpdateClick(){
    const projectCode = this.props.match.params.projectCode;

    const updatePayLoad = {};
    updatePayLoad.alias = this.props.filters.newData.alias;
    updatePayLoad.survey = this.props.filters.newData.survey ;
    updatePayLoad.column = this.props.filters.newData.column;
    updatePayLoad.ordering = 1;
    updatePayLoad.id = this.props.filters.newData.id;
    this.props.updateFilter(updatePayLoad, projectCode);
  }

  handleSaveClick(){
    const projectCode = this.props.match.params.projectCode;

    const savePayLoad = {};
    savePayLoad.alias = this.props.filters.newData.alias;
    savePayLoad.survey = this.props.filters.newData.survey ;
    savePayLoad.column = this.props.filters.newData.column;
    savePayLoad.ordering = 1;
    this.props.saveFilter(savePayLoad, projectCode);
  }


  handleDeleteClick(filterId){
    const projectCode  = this.props.match.params.projectCode;

    const dialog = document.getElementById('pm-filter-delete');
    document.getElementsByTagName("BODY")[0].appendChild(dialog);
    dialogPolyfill.registerDialog(dialog);

    dialog.querySelector('#success').onclick = function(event) {
      event.preventDefault();
      this.props.deleteFilter(projectCode, filterId);
      dialog.close();
    }.bind(this);

    dialog.querySelector('#cancel').onclick =  function() {
      dialog.close();
    };
    dialog.showModal();
  }


  getField (list, id, field) {
  return list.filter (o => o.id === id)[0][field];
  }

  handleSurveyFieldChange(field, value){
    this.props.filterFormFieldChange(field, value);
    let filterName = this.props.surveys.data[this.props.filters.newData.survey].fields.filter( surveyField => surveyField.psf_id === +value)[0].label;
    this.props.filterFormFieldChange('alias', filterName);
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
      { type: 'edit',   action: this.props.editFilterStart, tooltip: 'Edit Filters (for map)' },
      { type: 'delete', action: this.handleDeleteClick.bind(this), tooltip: 'Delete Filters (from map)' }
    ];

    let data = Object.values(this.props.filters.data).map (f => ({
      id:f.id,
      alias: f.alias,
      column: f.column,
      survey: f.survey
    }));

    if (!this.props.surveys.isFetching && !this.props.surveys.fetchError) {
      data = Object.values(this.props.filters.data).map (f => ({
        id:f.id,
        alias: f.alias,
        column: this.getColumnLabel (this.props.surveys.data, f.survey, f.column),
        survey: f.survey && this.props.surveys.data[f.survey] && this.props.surveys.data[f.survey].name
      })) ;
    }
   
    return(
      <div>
        <HeaderWithAddButton id='rem-fil-header' headerText='Filters' handleAddClick={this.props.addFilterStart}/>
        
        {(this.props.surveys.isFetching || this.props.overlays.isFetching) && <Loading style={{height:'80vh'}} viewBox='0 0 68 68'/>}
        
        {!(this.props.surveys.isFetching || this.props.overlays.isFetching) &&
          <div>
            {this.props.filters.fetchError && <div className='pm-alter pm-alter-error'> {this.props.filters.fetchError } </div>}
            {!! Object.values(this.props.filters.data).length &&
              <Table id='rem-ovr-tbl' cols={cols} actions={actions} data={data} />
            }
          </div>
        }

        <ConfirmationPopUp id="pm-filter-delete" title="Confirm"
           message="Are you certain that you want to delete this Filter."
           subMessage=" You can't undo this action."
           successButtonText="Yes" cancelButtonText="No"/>
          <FilterForm moduleObj={this.props.filters}
              id='pm-mdl-filter-form'
              type='Filter'
              surveys={this.props.surveys}
              onChange={this.props.filterFormFieldChange}
              handleSurveyFieldChange={this.handleSurveyFieldChange.bind(this)}
              onUpdate={this.handleUpdateClick.bind(this)}
              onSave={this.handleSaveClick.bind(this)}
              onCancel={this.props.filterEditCancel}/>
        </div>
      )
  }
}

export default Filter;
