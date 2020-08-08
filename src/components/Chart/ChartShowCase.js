
import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import HighchartsReact from 'highcharts-react-official';

import Highcharts from 'components/ext/highcharts';
import * as actionCreators from 'actions/userActions';
import { getChartOptions } from 'components/ext/highcharts/utility';
import SelectFn from 'components/Common/SelectFn';
import DeleteConfirmationDialog from 'components/Common/DeleteConfirmationDialog';


class ChartShowCase extends React.Component {

  constructor (props) {
    super (props);
    this.editChart = this.editChart.bind(this);
  }
    
  editChart (chartId) {
    this.props.editStartChart (this.props.charts.data[+chartId], this.props.surveys.data);
  }

  updateSurvey(_, surveyId) {
    this.props.setSession ('chart.survey', surveyId);
  }

  render () {
    const surveyId = this.props.session['chart.survey'];
    const filteredCharts = surveyId ? Object.values(this.props.charts.data).filter(c => +c.survey === +surveyId) : Object.values(this.props.charts.data);
    const sortedCharts = filteredCharts.sort((chart1, chart2) => (chart1.id - chart2.id));

    const gridCol = chart => chart.width + 2;
    const chartHeight = chart => Math.max ((chart.height * window.screen.height * 0.1), 300);
    const gridStyle = chart => ({
      padding:10,
      height: Math.max ((chart.height * window.screen.height*0.1), 300)
    });

    const deleteConfirmation = (id, title) => DeleteConfirmationDialog({
      type: 'chart',
      name: title,
      onDelete: () => this.props.removeChart(this.props.session['projectCode'], id)
    });
    const config = {
      exporting: true,
      fullWidth: true,
      edit: this.editChart,
      remove: deleteConfirmation
    };

    return (
      <div>
        <div style={{paddingLeft: 40, marginTop: 20}}>
          <SelectFn id="rem-chr-surveys" value={this.props.session['chart.survey']} label='Surveys'
                options={Object.values (this.props.surveys.data)} keyFn={s => s.id} valueFn={s => s.name}
                onChange={this.updateSurvey.bind(this)}
          />
        </div>
        <div>
          <button className="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored mdl-button--raised"
            style={{position: 'absolute', right: 20, top: 15}} onClick={this.props.addChartStart}>
            <i className="material-icons">add</i>
          </button>
        </div>

        <div style={{height: 10}} />

        <div className="mdl-grid">
          {sortedCharts.map ((chart,index) =>
            <div key={index} style={gridStyle(chart)} className={`mdl-shadow--2dp mdl-cell mdl-cell--${gridCol(chart)}-col`} id={`chart${chart.id}`}>
              <HighchartsReact highcharts={Highcharts}
                  options={getChartOptions(chart, chart.data, {...config, width: chart.width + 2, height: chartHeight(chart) - 50})}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}


export default compose (
  connect (
    state => ({...state}),
    dispatch => bindActionCreators (actionCreators, dispatch)
  ),

  withRouter

) (ChartShowCase);
