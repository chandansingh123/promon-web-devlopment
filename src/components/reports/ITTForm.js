import React from 'react';
import { compose, withProps } from 'recompose';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import * as ittReportActionCreators from 'actions/ittReportAction';
import * as reportsDataActionCreators from 'actions/reportsDataAction';
import ColoredButton from 'components/Admin/Common/ColoredButton';
import InputField from 'components/Admin/Common/InputField';
import CancelButton from 'components/Admin/Common/CancelButton';

const styles = {
  level: {
    fontSize: 12,
    fontWeight: 'bold',
    padding: '2px 10px'
  },
  description: {
    fontSize: 13,
    padding: '2px 10px',
    maxWidth: 400,
    overflowX: 'hidden'
  },
};


const ITTForm = ({ data, newData, onChange, onSave, onCancel }) => (
  <div className='mdl-grid'>
    <div className='mdl-cell--10-col mdl-cell--1-offset' style={{maxWidth: 700}}>
      <h4>Indicator Tracking Table - Data Entry</h4>

      <InputField label='Reporting Period' value={newData.reporting_period}
          field='reporting_period' onChange={onChange} />

      <table className="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
        <thead>
          <tr>
            <th></th>
            <th className="mdl-data-table__cell--non-numeric">Indicator</th>
            <th>Target</th>
            <th>Actual</th>
            <th>% of Target</th>
          </tr>
        </thead>
        <tbody>
          { data.filter(d => d.level === 'Activity').map(d =>
            <tr key={d.serial_no}>
              <td className="mdl-data-table__cell--non-numeric" style={styles.level}>{d.serial_no}</td>
              <td className="mdl-data-table__cell--non-numeric" style={styles.description}>{d.description}</td>
              <td>
                <InputField value={newData[`target_${d.id}`]} field={`target_${d.id}`} width={40} onChange={onChange} />
              </td>
              <td>
                <InputField value={newData[`actual_${d.id}`]} field={`actual_${d.id}`} width={40} onChange={onChange} />
              </td>
              <td>{
                (newData[`actual_${d.id}`] && newData[`target_${d.id}`]) ?
                (newData[`actual_${d.id}`] * 100 / newData[`target_${d.id}`]).toFixed(2) : 0
              } % </td>
            </tr>
          )}
        </tbody>
      </table>

      <div style={{ marginTop: 20, borderTop: '1px solid rgba(0, 0, 0, 0.2)', paddingTop: 20 }}>
        <ColoredButton label='Save' onClick={onSave} style={{margin: '0 10px' }}/>
        <CancelButton onClick={onCancel} />
      </div>
    </div>
  </div>
);


export default compose(
  connect (
    state => ({...state}),
    dispatch => bindActionCreators ({...ittReportActionCreators, ...reportsDataActionCreators}, dispatch)
  ),

  withRouter,

  withProps( props => {
    return {
      data: Object.values(props.ittReports.data).sort((d1, d2) => d1.serial_no < d2.serial_no ? -1 : 1),
      newData: props.reportsData.newData,
      onChange: props.formFieldChangeReportsData,
      onSave: () => props.addReportsDataFinish(props.match.params.reportCode, props.reportsData.newData, props.match.params.code),
      onCancel: props.addReportsDataCancel
    }
  })

) (ITTForm);
