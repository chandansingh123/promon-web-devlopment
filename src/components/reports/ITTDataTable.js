import React from 'react';
import { lifecycle, compose, withProps, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import * as ittReportActionCreators from 'actions/ittReportAction';
import * as reportsDataActionCreators from 'actions/reportsDataAction';
import * as sessionActionCreators from 'actions/sessionAction';
import ColoredButton from 'components/Admin/Common/ColoredButton';

const styles = {
  level: {
    fontSize: 12,
    fontWeight: 'bold',
    padding: '2px 10px'
  },
  cell: {
    fontSize: 12,
    padding: '2px 10px'
  },
  description: {
    fontSize: 13,
    padding: '2px 10px',
    maxWidth: 400,
    overflowX: 'hidden'
  },
  buttons: {
    color: 'rgb(200,200,200)',
    fontSize: 11
  },
  legend: {
    marginBottom: 20,
    fontSize: 14,
    letterSpacing: 1
  },
  fieldset: {
    width: '45%'
  },
};


const ITTDataTable = ({ data, reportData, add, configure }) => (
  <div className='mdl-grid'>
    <div className='mdl-cell--10-col mdl-cell--1-offset'>

      <div style={{float: 'right', padding: 20}}>
        <ColoredButton id='rem-itt-add' label='Add Reporting Period' onClick={add} style={{marginRight: 10}} />
        <ColoredButton id='rem-itt-config' label='Configure' onClick={configure} />
      </div>
      <h4>Indicator Tracking Table - Data</h4>

      <table className="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
        <thead>
          <tr>
            <th></th>
            <th className="mdl-data-table__cell--non-numeric">Indicator</th>
            <th>Baseline Date</th>
            <th>Baseline Value</th>
            { reportData.map (d => <th colSpan='3' key={d.reporting_period} style={{textAlign: 'center'}}>Q{d.reporting_period} Reporting Period</th>)}
          </tr>
        </thead>
        <tbody>
          <td colSpan='4'></td>
          { reportData.map (d => 
            <React.Fragment key={d.reporting_period}>
              <td>Target</td>
              <td>Actual</td>
              <td>% of Target</td>
            </React.Fragment>
          )}
          { data.map (d =>
            <tr key={d.serial_no}>
              <td className="mdl-data-table__cell--non-numeric" style={styles.level}>{d.serial_no}</td>
              <td className="mdl-data-table__cell--non-numeric" style={styles.description}>{d.description}</td>
              <td style={styles.cell}>{d.baseline_date}</td>
              <td style={styles.cell}>{d.baseline_value} {d.unit ? '%' : ''}</td>
              { reportData.map(rd =>
                <React.Fragment>
                  <td>{rd[`target_${d.id}`]}{d.unit ? '%' : ''}</td>
                  <td>{rd[`actual_${d.id}`]}{d.unit ? '%' : ''}</td>
                  <td>
                  {(rd[`actual_${d.id}`] && rd[`target_${d.id}`]) ? (rd[`actual_${d.id}`] * 100 / rd[`target_${d.id}`]).toFixed(2) : 0 }%
                  </td>
                </React.Fragment>
              )}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);


export default compose(
  connect (
    state => ({...state}),
    dispatch => bindActionCreators ({...ittReportActionCreators, ...reportsDataActionCreators, ...sessionActionCreators}, dispatch)
  ),

  withRouter,

  withHandlers({
    add: props => _ => props.addReportsDataStart('itt', props.session.projectCode),
    configure: props => _ => props.setSession('itt.config', true)
  }),

  withProps( props => {
    return {
      data: Object.values(props.ittReports.data).sort((d1, d2) => d1.serial_no < d2.serial_no ? -1 : 1),
      reportData: Object.values(props.reportsData.data).sort((d1, d2) => +d1.reporting_period - +d2.reporting_period)
    }
  }),

  lifecycle ({
    componentDidMount () {
      const projectCode = this.props.match.params.code;
      this.props.fetchIttReport(projectCode);
      this.props.fetchReportsData('itt', projectCode);
    }
  })

) (ITTDataTable);
