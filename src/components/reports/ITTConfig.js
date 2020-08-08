
import React from 'react';
import { lifecycle, compose, withProps, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import * as ittReportActionCreators from 'actions/ittReportAction';
import * as sessionActionCreators from 'actions/sessionAction';
import FlatButton from 'components/Common/FlatButton';
import DialogForm from 'components/Admin/Common/DialogForm';
import InputField from 'components/Admin/Common/InputField';
import Switch from 'components/Admin/Common/Switch';
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
    maxWidth: 500,
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

const ReportLevelForm = ({ data, errors, addIttReportCancel, addIttReportFinish, onChange, onToggle }) => {
  const formTitle = `Add New ${data.level}`;

  return (
    <DialogForm id='rem-itt-frm' title={formTitle} mode='add'
        onCancel={addIttReportCancel} onAdd={() => addIttReportFinish(data)}
      show={data.editing} style={{width: 400}} >
      <InputField id='rem-itt-frm-description' label='Description' type='text' field='description' value={data.description}
          onChange={onChange} required errorMsg={errors['name'] || 'Description is required.'} />
      {
        data.level === 'Activity' &&
        <fieldset style={styles.fieldset}>
          <legend style={styles.legend}>Project Baseline</legend>
          <InputField id='rem-itt-frm-baseline_date' label='Date' type='date' field='baseline_date' value={data.baseline_date} onChange={onChange} />
          <InputField id='rem-itt-frm-baseline_value' label='Value' type='text' field='baseline_value' value={data.baseline_value} onChange={onChange} />
          <Switch id='rem-itt-frm-unit' label='Use Percent' field='unit' checked={data.unit} onChange={onToggle} />
        </fieldset>
      }
    </DialogForm>
  );
}

const getLabel = (serial) => {
  const labels = ['Goal', 'Outcome', 'Output', 'Activity'];
  return labels[serial.split('.').length];
};

const ReportConfig = ({ data, newData, addIttReportStart, addIttReportCancel, addIttReportFinish,
    onChangeIttReport, onToggleIttReport, onComplete }) => (
  <div className='mdl-grid'>
    <div className='mdl-cell--10-col mdl-cell--1-offset' style={{maxWidth: 700}}>
      <h4>Indicator Tracking Table - Configuration</h4>
      <table className="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th className="mdl-data-table__cell--non-numeric">Indicator</th>
            <th>Baseline Date</th>
            <th>Baseline Value</th>
            <th className="mdl-data-table__cell--non-numeric">
              <FlatButton icon='add_circle_outline' label='Add Goal' onClick={() => addIttReportStart ('Goal')} style={styles.buttons}/>
            </th>
          </tr>
        </thead>
        <tbody>
          { data.map (d => 
            <tr key={d.serial_no}>
              <td className="mdl-data-table__cell--non-numeric" style={styles.level}>{d.serial_no}</td>
              <td className="mdl-data-table__cell--non-numeric" style={styles.level}>{d.level}</td>
              <td className="mdl-data-table__cell--non-numeric" style={styles.description}>{d.description}</td>
              <td style={styles.cell}>{d.baseline_date}</td>
              <td style={styles.cell}>{d.baseline_value} {d.unit ? '%' : ''}</td>
              <td className="mdl-data-table__cell--non-numeric">
                { d.level !== 'Activity' &&
                <FlatButton icon='add_circle_outline' label={`Add ${getLabel(d.serial_no)}`} style={styles.buttons}
                    onClick={() => addIttReportStart(getLabel(d.serial_no), d.id)} />
                }
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div style={{ marginTop: 20, borderTop: '1px solid rgba(0, 0, 0, 0.2)', paddingTop: 20 }}>
        <ColoredButton label='Done' onClick={onComplete} />
      </div>
    </div>
    <ReportLevelForm data={newData} errors={{}} addIttReportCancel={addIttReportCancel}
        addIttReportFinish={addIttReportFinish} onChange={onChangeIttReport} onToggle={onToggleIttReport} />
  </div>
);

export default compose(
  connect (
    state => ({...state}),
    dispatch => bindActionCreators ({...ittReportActionCreators, ...sessionActionCreators}, dispatch)
  ),

  withRouter,

  withHandlers({
    onComplete: props => _ => props.setSession('itt.config', false)
  }),

  withProps( props => {
    return {
      data: Object.values(props.ittReports.data).sort((d1, d2) => d1.serial_no < d2.serial_no ? -1 : 1),
      newData: props.ittReports.newData
    }
  }),

  lifecycle ({
    componentDidMount () {
      const projectCode = this.props.match.params.code;
      this.props.fetchIttReport(projectCode);
    }
  })
) (ReportConfig);
