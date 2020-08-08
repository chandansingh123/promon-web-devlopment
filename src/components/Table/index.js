import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose, withHandlers, withState, withProps, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actionCreators from 'actions/userActions';
import SelectFn from 'components/Common/SelectFn';
import ColumnVisibility from './ColumnVisibility';
import Table from 'components/ext/mdl/Table';
import FlatButton from 'components/Common/FlatButton';
import SurveyNote from './SurveyNote';


function getColumns (session, surveys, surveyFieldValues, visible) {
  const surveyId = session['table.survey'];
  if (!surveyId)
    return [];

  if (!surveys.data[surveyId])
    return [];

  const fieldValues = id => surveyFieldValues[id] ? surveyFieldValues[id].values.map(v => v.label) : [];

  const columns = surveys.data[surveyId].fields.map(f => ({
    label: f.label,
    value: f.value,
    type: f.type,
    values: fieldValues(f.id),
    width: '200',
    display: visible[f.value]
  }));
  return columns;
}


const GeoTable = ({session, surveys, fieldValues, data, visible, noteDisplay,
      updateSurvey, toggleVisibility, openPopup, openDetailPage, setNoteDisplay }) => {
  const surveyId = session['table.survey'];
  const filename = surveyId ? `${surveys.data[surveyId].name}.csv` : 'survey.csv';
  const modal = {
    text: 'Column visibility',
    onClick: () => <ColumnVisibility cols={columns} visible={visible} toggleVisibility={toggleVisibility}/>
  };

  const columns = getColumns(session, surveys, fieldValues, visible);

  const actions = [
    { type: 'location', action: openPopup, tooltip: 'Display Summary in map' },
    { type: 'detail', action: openDetailPage, tooltip: 'Open Beneficiary detail page' },
  ];

  const surveyName = (surveyId && surveys.data[surveyId]) ? surveys.data[surveyId].name : 'Survey';
  const surveyNote = (surveyId && surveys.data[surveyId]) ? surveys.data[surveyId].note : '';

  return (
    <div style={{fontSize: 12}}>
      { noteDisplay && surveyNote && <SurveyNote note={surveyNote}name={surveyName} setNoteDisplay={setNoteDisplay} /> }

      <div style={{paddingLeft: 20, marginTop: 20, display: 'flex', flexDirection: 'row'}} >
        <SelectFn id='rem-tbl-surveys' value={surveyId} label='Surveys' options={Object.values (surveys.data)}
            keyFn={s => s.id} valueFn={s => s.name} onChange={updateSurvey}
        />
        { surveyNote &&
          <FlatButton id='rem-tbl-survey-note' tooltip='Display Survey Detail' icon='info'
              onClick={_ => setNoteDisplay(!noteDisplay)} />
        }
      </div>

      { columns.length > 0 &&
        <Table keyField='id' data={data} columns={columns} exportTo={filename} modal={modal} actions={actions} />
      }
    </div>
  );
};


function getData (session, surveys, gis) {

  const surveyId = session['table.survey'];
  if (!surveyId)
    return [];

  const columns = surveys[surveyId] ? surveys[surveyId].fields : [];
  if (columns.length === 0)
    return [];

  const geojson = gis[surveyId] ? gis[surveyId] : undefined;
  if (!geojson)
    return [];

  const data = [];
  const defaultDisplay = {};
  geojson.features.forEach(function(rowData) {
    let row = {};
    row['id'] = rowData.properties['_id'] || '';
    columns.forEach (col => {
      defaultDisplay[col.value] = !!col.defaultDisplay;
      row[col.value] = rowData.properties['_' + col.value] || '';
    });
    data.push(row);
  });

  return data;
}


export default compose (
  connect (
    state => ({...state}),
    dispatch => bindActionCreators (actionCreators, dispatch)
  ),

  withRouter,

  withState('visible', 'setVisible', {}),
  withState('noteDisplay', 'setNoteDisplay', false),

  withProps ( props => {
    return {
      data: getData(props.session, props.surveys.data, props.gis.data),
      fieldValues: props.surveyFieldValues.data
    }
  }),

  withHandlers({
    updateSurvey: props => (_, surveyId) => {
      props.setSession('table.survey', surveyId);
      if (props.gis.data[surveyId] === undefined)
        props.fetchUserSurveyGeojson (props.session['projectCode'], surveyId);
      if (!Object.values(props.surveyFieldValues.data).some(fv => +fv.survey_id === +surveyId))
        props.fetchUserSurveyFieldValues(props.session['projectCode'], surveyId);

      // Update visibilty fields
      const surveyFields = props.surveys.data[+surveyId].fields;
      const visibles = surveyFields.reduce((acc, cv) => Object.assign(acc, {[cv.value]: cv.defaultDisplay}), {});
      props.setVisible(visibles);
    },

    toggleVisibility: props => value => props.setVisible({...props.visible, [value]: !props.visible[value]}),

    openPopup: props => beneficiaryId => {
      if(!beneficiaryId)
        return false;

      const projectCode = props.session['projectCode'];
      props.fetchUserHouseHoldSummary (projectCode, beneficiaryId);
      props.setSession ('map.popup', beneficiaryId);
      props.history.push (`/projects/${projectCode}/map`);
    },

    openDetailPage: props => beneficiaryId => {
      if(!beneficiaryId)
        return false;

      const url = `/${props.session.country.code}/projects/${props.session.projectCode}/households/${beneficiaryId}`;
      window.open(url, '_blank');
    }
  }),

  lifecycle({
    componentDidUpdate(prevProps) {
      window.componentHandler.upgradeAllRegistered();

      if (this.props.surveys.data !== prevProps.surveys.data || Object.keys(this.props.visible).length === 0) {
        const surveyId = this.props.session['table.survey'];
        if (surveyId) {
          const surveyFields = this.props.surveys.data[+surveyId].fields;
          const visibles = surveyFields.reduce((acc, cv) => Object.assign(acc, {[cv.value]: cv.defaultDisplay}), {});
          this.props.setVisible(visibles);
        }
      }
    }
  })

) (GeoTable);
