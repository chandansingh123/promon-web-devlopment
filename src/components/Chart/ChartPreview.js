
import React from 'react';
import { compose, withProps } from 'recompose';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import HighchartsReact from 'highcharts-react-official';

import * as actionCreators from 'actions/chartAction';
import Highcharts from 'components/ext/highcharts';
import { getOptionFromState } from 'components/ext/highcharts/utility';


const ChartPreview = ({data}) => {
  let dataKey;
  if (data.type === 'pie' || !data.surveyFields[1].value) {
    dataKey = `${data.survey}:${data.surveyFields[0].value}`;
  } else
    dataKey = `${data.survey}:${data.surveyFields[0].value}:${data.surveyFields[1].value}`;

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={getOptionFromState(data, data.chartData[dataKey])} />
    </div>
  );
};


export default compose(
  connect (
    state => ({...state}),
    dispatch => bindActionCreators(actionCreators, dispatch)
  ),

  withProps(props => ({
    projectCode: props.session['projectCode'],
    data: props.charts.newData,
    drawChart: props.createChart
  })),

) (ChartPreview);

