
import React from 'react';
import { compose, withProps, withHandlers } from 'recompose';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as chartActionCreators from 'actions/chartAction';
import * as surveyFieldValueActionCreators from 'actions/surveyFieldValueAction';
import { chartColors } from 'store/globalObject';
import SelectFn from 'components/Common/SelectFn';


const ChartDataInformationForm = ({ data, projectSurveys, fields, formFieldChangeChart, onChangeSurveyField }) => (
  <div className="mdl-card__supporting-text">
    <form id='rem-chr-frm-data'>
      <SelectFn id='rem-chr-frm-survey' label='Survey' options={projectSurveys} field='survey'
          keyFn={(opt => opt.id)} valueFn={(opt => opt.name)} value={data.survey}
          onChange={formFieldChangeChart} required errorMsg='You must select a survey before proceeding.' />

      <div>
        <SelectFn id='rem-chr-frm-0' label='Survey Field' options={fields} field='surveyFields'
            keyFn={(opt => opt.id)} valueFn={(opt => opt.label)} value={data.surveyFields[0].id}
            onChange={(f, v) => onChangeSurveyField(f, v, 0)} required errorMsg='The first survey field is mandatory.'  />
        <SelectFn id='rem-chr-frm-1' label='Second Survey Field' options={fields} field='surveyFields'
            keyFn={(opt => opt.id)} valueFn={(opt => opt.label)} value={data.surveyFields[1].id}
            onChange={(f, v) => onChangeSurveyField(f, v, 1)} />
      </div>

    </form>
  </div>
);


export default compose(
  connect (
    state => ({...state}),
    dispatch => bindActionCreators({...chartActionCreators, ...surveyFieldValueActionCreators}, dispatch)
  ),

  withProps(props => ({
    data: props.charts.newData,
    projectSurveys: Object.values(props.surveys.data),
    fields: props.charts.newData.survey ? props.surveys.data[+props.charts.newData.survey].fields : []
  })),

  withHandlers({
    onChangeSurveyField: props => (field, value, index) => {
      // Change field
      const survey = props.surveys.data[+props.data.survey];
      const selectedField = survey.fields.find(f => f.id === +value);
      const fieldValue = {
        value: selectedField.value,
        label: selectedField.label,
        id: selectedField.id
      };
      props.indexedFieldChangeChart(field, index, fieldValue);
      props.indexedFieldChangeChart('surveyFieldValues', index, []);

      // Handle survey field value
      const fieldValueMapper = values => values.map((sfv, i) => ({
        color: chartColors[i % 20],
        value: sfv.label,
        label: sfv.label
      }));
      const callback = (_, response) => props.indexedFieldChangeChart('surveyFieldValues', index, fieldValueMapper(response));
      props.fetchSurveyFieldValues(props.session.projectCode, props.data.survey, value, callback);

      // Get data
      if (index === 0) {
        const fields = selectedField.value;
        const key = `${props.data.survey}:${fields}`;
        if (!props.data.chartData[key]) {
          const callback = (_, response) => props.formFieldChangeChart('chartData', {...props.data.chartData, [key]: response});
          props.fetchChartSurveyData(props.session.projectCode, props.data.survey, fields, callback);
        }
      } else {
        const fields = props.data.surveyFields[0].value + ',' + selectedField.value;
        const key = `${props.data.survey}:${props.data.surveyFields[0].value}:${selectedField.value}`;
        if (!props.data.chartData[key]) {
          const callback = (_, response) => props.formFieldChangeChart('chartData', {...props.data.chartData, [key]: response});
          props.fetchChartSurveyData(props.session.projectCode, props.data.survey, fields, callback);
        }
      }
    }
  })

) (ChartDataInformationForm);
