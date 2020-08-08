
import React from 'react';
import { compose, withProps, withHandlers } from 'recompose';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actionCreators from 'actions/reportsAction';
import InputField from 'components/Admin/Common/InputField';
import Switch from 'components/Admin/Common/Switch';
import FileUploader from 'components/Common/FileUploader';
import ColoredButton from 'components/Admin/Common/ColoredButton';
import CancelButton from 'components/Admin/Common/CancelButton';


const ReportsForm = ({data, onChange, onToggle, postUpload, save, addReportsCancel }) => (
    <div  style={{paddingTop: 20, paddingLeft: 20}}>
      <h4 style={{paddingLeft: 20}}>
        {data.id ? 'Edit Report' : 'Add a new Report'}
      </h4>
      <form>
        <div style={{borderBottom: '1px solid rgba(0,0,0,.1)', display: 'flex'}}>
          <div style={{borderRight: '1px solid rgba(0, 0, 0, .2)', paddingRight: 20, paddingBottom: 20}}>
            <InputField id='rem-rep-frm-name' label='Name' type='text' field='name'
                value={data.name} onChange={onChange} required errorMsg='Report name is required.' />
            <InputField id='rem-rep-frm-code' label='Code (optional)' type='text' field='code' disabled={!!data.id}
                value={data.code} onChange={onChange} />
            <Switch id='rem-rep-frm-project_specific' label='Project Specific' checked={data.project_specific}
                field='project_specific' onChange={onToggle} />
            <FileUploader id='rem-rep-frm-uploader' url={`surveys/excel`} postUpload={postUpload} />
          </div>

          <div style={{ padding: '10px 20px', maxHeight: 400, overflowY: 'auto', fontSize: '12px', width: 500}}>
            <div style={{ display: 'table'}}>
              <div style={{display: 'table-row', fontSize: '14px', fontWeight: 'bold'}}>
                <div style={{display: 'table-cell', minWidth: 300, borderBottom: '1px solid rgba(0, 0, 0, .4)'}}>Column</div>
                <div style={{display: 'table-cell', minWidth: 150, borderBottom: '1px solid rgba(0, 0, 0, .4)'}}>Type</div>
              </div>
              { data.fields && data.fields.sort((f1, f2) => f1.order - f2.order).map((f, idx) =>
                <div style={{display: 'table-row'}} key={idx}>
                  <div style={{display: 'table-cell'}}>{f.label}</div>
                  <div style={{display: 'table-cell'}}>{f.displayType}</div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mdl-dialog__actions">
          <ColoredButton id='rem-tnt-frm-save' onClick={save} label='Save' disabled={!data.id && !data.fields} />
          <CancelButton id='rem-tnt-frm-cancel' onClick={addReportsCancel}/>
        </div>
      </form>
    </div>
  );


export default compose (
  connect (
    state => ({...state}),
    dispatch => bindActionCreators (actionCreators, dispatch)
  ),

  withProps (props => ({
    data: props.reports.newData,
    onChange: props.formFieldChangeReports,
    onToggle: props.formSwitchToggleReports,
    onCancel: props.addCancelReports
  })),

  withHandlers({
    postUpload: props => data => {
      const typeMap = {
        'string': 'String',
        'select1': 'Select (single)',
        'select': 'Select (multiple)',
        'dateTime': 'Date Time',
        'date': 'Date',
        'time': 'Time',
        'int': 'Number',
        'decimal': 'Number (decimal)',
        'geopoint': 'Location (latitude, longitude)',
        'file': 'File (PDF, Word, Excel)',
        'image': 'Picture'
      }
      const fields = Object.values(data.response.fields)
        .filter(f => f.value !== '_meta_instanceid')
        .sort((f1, f2) => f1.order - f2.order)
        .map(f1 => ({
          label: f1.label,
          displayType: typeMap[f1.omk_datatype],
          value: f1.value,
          type: f1.omk_datatype,
          values: f1.values
        }));
      props.formFieldChangeReports('fields', fields);
    },
    save: props => _ => {
      if (props.data.id)
        props.editReportsFinish(props.data.code, props.data);
      else
        props.addReportsFinish(props.data);
    }
  })

) (ReportsForm);
