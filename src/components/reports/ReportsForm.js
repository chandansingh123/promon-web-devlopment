import React from 'react';
import { compose, withProps, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as reportsActionCreators from 'actions/reportsAction';
import * as reportsDataActionCreators from 'actions/reportsDataAction';
import SimpleInputField from 'components/ext/mdl/SimpleInputField';
import ColoredButton from 'components/Admin/Common/ColoredButton';
import CancelButton from 'components/Admin/Common/CancelButton';
import FileUploader from 'components/Common/FileUploader';

const styles = {
  label: {
    display: 'inline-block',
    width: 250,
    paddingRight: 10,
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    verticalAlign: 'top',
    paddingTop: 10
  },
  container: {
    maxHeight: 'calc(100vh - 46px)',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column'
  }
};


const SelectX = ({ id, options, keyFn, valueFn, onChange, value }) => (
  <div className="mdl-textfield mdl-js-textfield rem-omk-detail" style={{ display: 'inline-block', paddingBottom: 0, paddingTop: 8 }}>
    <select className="mdl-textfield__input" id={id} type="text" style={{ fontSize: 11 }} value={value || ''}
      onChange={event => onChange(event.target.value)} >
      <option value="" disabled />
      {options && options.map(opt => <option value={keyFn(opt)} key={keyFn(opt)}> {valueFn(opt)} </option>)}
    </select>
  </div>
);

const FieldRenderer = ({report, data, onChange, postUpload, field}) => {
  switch(field.type){
    case 'string': return <SimpleInputField multiline value={data[field.value]} onChange={(value) => onChange(field.value, value)} />;
    case 'int': return <SimpleInputField type='int' value={data[field.value]} onChange={(value) => onChange(field.value, value)} />;
    case 'decimal': return <SimpleInputField type='int' value={data[field.value]} onChange={(value) => onChange(field.value, value)} />;
    case 'select1':
      const options = (field.dependent_field && field.dependent_field.length > 1) ?
        field.values.filter(v => v.dependent_value === data[field.dependent_field]) :
        field.values;
      return <SelectX options={options} keyFn={f=> f.value} valueFn={f=>f.label} value={data[field.value]}
        onChange={(value) => onChange(field.value, value)} />;
    case 'file': return <FileUploader url={`reports/${report.urlcode}/data/files`} postUpload={postUpload} field={field.value} />;
    case 'date': return <SimpleInputField type='date' value={data[field.value]} onChange={(value) => onChange(field.value, value)} />;
    default: return <div></div>
  }
}


const ReportsForm = ({report, data, onChange, addReportsDataCancel, save, postUpload }) => {
  if (!report || !report.fields)
    return null;

  return (
    <div className='mdl-cell--10-col mdl-cell--1-offset' style={styles.container}>
      <h4>{report.name}</h4>

      <form>
        {data && data.editing && report.fields.map((field, idx) => 
          <div key={idx}>
            <div style={styles.label} title={field.label}>{field.label}</div>
            <FieldRenderer report={report} data={data} onChange={onChange} postUpload={postUpload} field={field} />
          </div>
        )}
        { data && data.editing &&
          <div style={{borderTop: '1px solid rgba(0, 0, 0, .2)', padding: 12, marginTop: 16}}>
            <ColoredButton id='rem-tnt-frm-save' onClick={() => save(report.urlcode, data)} label='Save' style={{margin: '0 10px'}} />
            <CancelButton id='rem-tnt-frm-cancel' onClick={addReportsDataCancel}/>
          </div>
        }
      </form>
    </div>
  );
}


export default compose(
  connect (
    state => ({...state}),
    dispatch => bindActionCreators ({...reportsActionCreators, ...reportsDataActionCreators}, dispatch)
  ),

  withProps(props => ({
    report: Object.values(props.reports.data).find(r => r.urlcode === props.reportCode),
    data: props.reportsData.newData
  })),

  withHandlers({
    onChange: props => (field, data) => props.formFieldChangeReportsData(field, data),
    postUpload: props => payload =>  {
      let fileData = props.data[payload.field] || {};
      fileData = {...fileData, [payload.filename]: payload.response.filename};
      props.formFieldChangeReportsData(payload.field, fileData);
    },
    save: props => (reportCode, data) => {
      if (data.id)
        props.editReportsDataFinish(reportCode, data.id, data);
      else
        props.addReportsDataFinish(reportCode, data);
    }
  })

) (ReportsForm)
