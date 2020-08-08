
import React from 'react';
import { compose } from 'redux';
import { withProps, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import * as actionCreators from 'actions/chartAction';
import Stepper from 'components/ext/mdl/Stepper';

import ChartBasicInformationForm from './ChartBasicInformationForm';
import ChartDataInformationForm from './ChartDataInformationForm';
import ChartColorPicker from './ChartColorPicker';


function prepareChartDataToSave (newChart) {

  const chartOptions = {
    title:{ text: newChart.title },
    subtitle:{ text: newChart.subTitle },
    chart: { type: newChart.type },
    legend:{ enable:false },
    color: newChart.color
  };

  const whereClause = newChart.filters.filter (f => f.value).map (f => ({col: f.field, value: f.value}));
  const queryFields =  newChart.surveyFields.map (f => f.value);
  const mapping = [];
  mapping[0] = newChart.surveyFieldValues[0] && newChart.surveyFieldValues[0].map (sfv => ({label: sfv.label, value: sfv.value, color: sfv.color}));

  let chartData ={
    title: newChart.title,
    query:{
      whereClause: whereClause,
      field: queryFields
    },
    options:{
      mapping: mapping,
      chartOptions:chartOptions
    },
    width: +newChart.width,
    height: +newChart.height,
    survey: +newChart.survey,
    order:1
  };
  return chartData;
}

const ChartFrom = ({ save, cancel }) => (
  <div style={{height: 'calc(100vh - 48px)', display: 'flex'}}>
    <Stepper onFinish={save} cancel={cancel}
      steps={[
        { label: 'Survey Information', component: <ChartDataInformationForm /> },
        { label: 'Basic Information', component: <ChartBasicInformationForm /> },
        { label: 'Advanced Styling', component: <ChartColorPicker /> }
      ]}
    />
  </div>
);


export default compose (
  connect (
    state => ({...state}),
    dispatch => bindActionCreators (actionCreators, dispatch)
  ),

  withRouter,

  withProps ( props => {
    return {
      projectCode: props.match.params.code,
      data: props.charts.newData
    }
  }),

  withHandlers ({
    save: props => _ => {
      const chartData = prepareChartDataToSave(props.data);
      props.charts.editMode ? props.updateChart(chartData, props.projectCode, props.data.id) : props.saveChart(chartData, props.projectCode);
    },
    cancel: props => _ => props.chartEditCancel(),
  })

) (ChartFrom);
