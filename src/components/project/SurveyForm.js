
import React from 'react';
import { connect } from 'react-redux';
import { compose, withProps, withHandlers } from 'recompose';
import { withRouter } from 'react-router-dom';

import { onChangeFullSurvey, onToggleFullSurvey, addCancelFullSurvey, addFullSurvey, updateFullSurvey, onIndexedChangeFullSurvey } from 'actions/fullSurveyAction';
import { downloadOmkSurvey } from 'actions/omkSurveyAction';
import Stepper from 'components/ext/mdl/Stepper';
import CheckBox from 'components/ext/mdl/CheckBox';
import FileUploader from 'components/Common/FileUploader';
import InputField from 'components/Admin/Common/InputField';
import Switch from 'components/Admin/Common/Switch';
import EditableTable from 'components/Common/EditableTable';
import FlatButton from 'components/Common/FlatButton';

const styles = {
  stepContent: {
    padding: '20px 20px 0 20px'
  },
  stepHeader: {
    fontSize: 20,
    marginBottom: 4,
    marginTop: 0
  },
  stepSubHeader: {
    margin: '4px 0 10px 0',
    fontStyle: 'italic',
    fontSize: 12
  },
  sectionHeader: {
    fontWeight: 'bold',
    borderBottom: '1px solid rgba(0,0,0, 0.5)',
    fontSize: '16px',
    marginBottom: 5
  },
  summaryLabel: {
    fontWeight: 'bold',
    width: 120
  }
};


const AddSurveyForm = ({ data, onChange, onToggle, disableBaseline }) => (
  <form style={styles.stepContent}>
    <InputField id='rem-fsr-frm-name' value={data.name} label='Name' onChange={onChange} field='name' 
        required errorMsg='Name of the survey is required.' />
    <Switch id='rem-fsr-frm-baseline' disabled={disableBaseline} field='baseline' checked={data.baseline} onChange={onToggle}
        label={data.baseline ? 'This is a baseline survey.' : 'This is not a baseline survey.'} />
    <div className='mdl-textfield mdl-js-textfield mdl-textfield--floating-label'>
      <textarea className='mdl-textfield__input' type='text' rows='5' id='rem-fsr-frm-note' value={data.note}
          onChange={(evt) => onChange('note', evt.target.value)}
          style={{fontSize: '13px'}} />
      <label className='mdl-textfield__label' forhtml='rem-fsr-frm-note'>Note</label>
    </div>
  </form>
);

const UploadForm = ({ projectCode, surveyName, data,
    postUpload, downloadOmkSurvey }) => (
  <div style={styles.stepContent}>
    { data.id &&
      <div >
        {data.filename}
        <FlatButton id='rem-srv-frm-download' icon='cloud_download' onClick={() => downloadOmkSurvey(data.omk_survey)} small={true} />
      </div>
    }
    <FileUploader id='rem-omk-frm' meta={{projectCode, surveyName}} url={`surveys/excel`} postUpload={postUpload} />
  </div>
);


const LabelCustomizationForm = ({ data, onChange }) => {
  const columns = [
    { label: 'Group', field: 'group', editable: false, type:'string', width: 180  },
    { label:'Code', field: 'actual_value', editable: false, type: 'string', width: 250 },
    { label:'Label', field: 'label', editable: true, type: 'string', width: 250 }
  ];

  return (
    <div style={styles.stepContent}>
      <h3 style={styles.stepHeader}>Label Customization</h3>
      <div style={styles.stepSubHeader}>You can change the label to match the label used in maps, tables and charts.</div>
      <div style={{maxWidth: 1000}}>
        <EditableTable columns={columns} datas={data.fields} inDialog={true}
            onChange={(field, index, value) => onChange('fields', index, field, value)} />
      </div>
    </div>
  );
}


const DisplayCustomizationForm = ({ data, onChange }) => (
  <div style={styles.stepContent}>
      <h3 style={styles.stepHeader}>Field Customization.</h3>
      <div style={styles.stepSubHeader}>Unselect the fields that you do not plan to use in the maps, tables or charts.</div>
      <div style={{display: 'flex', flexWrap: 'wrap'}}>
        {
          data.fields.map((f, index) =>
            <CheckBox key={index} id={`rem-fsr-frm-fields-${f.value}`} label={f.label} checked={f.display}
                field='display' onClick={(field, value) => onChange('fields', index, field, value)} />)
        }
      </div>
    
  </div>
);


const DefaultDisplayCustomizationForm = ({ data, onChange }) => (
  <div style={styles.stepContent}>
      <h3 style={styles.stepHeader}>Table Field Customization</h3>
      <div style={styles.stepSubHeader}>Select the fields that should be displayed when the table loads.</div>
      <div style={{display: 'flex', flexWrap: 'wrap'}}>
        {
          data.fields
            .map((f, index) => {
              if (f.display)
                return <CheckBox key={index} id={`rem-fsr-frm-fields-${f.value}`} label={f.label} checked={f.defaultDisplay}
                  field='defaultDisplay' onClick={(field, value) => onChange('fields', index, field, value)} />;
              else
                return null;
            })
        }
      </div>
    
  </div>
);

const VerificationForm = ({ data }) => (
  <div style={styles.stepContent}>
    <h3 style={styles.stepHeader}>Survey Summary</h3>
    <div style={styles.stepSubHeader}>Please verify the information and press Finish to add the survey.</div>
    <div style={{fontSize: '13px'}}>
      <h4 style={{marginBottom: 0}}>{data.name}</h4>
      <div>{data.baseline ?
        'The survey is a baseline survey. The location information in this survey will be used to plot locations on the project map.' :
        'The survey is not a baseline survey.'}
      </div>
      { data.note &&
        <div>
          <h5 style={styles.sectionHeader}>Brief Note</h5>
          <div>{data.note}</div>
        </div>
      }
      <div>
        <h5 style={styles.sectionHeader}>Files and Images</h5>
        <table>
          <tbody>
            { data.files &&
              <tr>
                <td style={styles.summaryLabel}>Files</td>
                <td>{data.files.join(', ')}</td>
              </tr>
            }
            { data.images &&
              <tr>
                <td style={styles.summaryLabel}>Files</td>
                <td>{data.images.join(', ')}</td>
              </tr>
            }
            { data.location &&
              <tr>
                <td style={styles.summaryLabel}>Location Field</td>
                <td>{data.location}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
      <div>
        <h5 style={styles.sectionHeader}>Survey Fields</h5>
        <div>{ data.fields.filter(f => f.display).map(f => f.label).join(', ')}</div>
      </div>
    </div>
  </div>
);

const SurveyFrom = ({ projectCode, data, onChange, onToggle, onIndexedChangeFullSurvey, postUpload, downloadOmkSurvey, save, cancel }) => (
  <div style={{height: 'calc(100vh - 48px)', display: 'flex'}}>
    <Stepper onFinish={save} cancel={cancel}
      steps={[
        { label: 'Add Survey', component: <AddSurveyForm data={data} onChange={onChange} onToggle={onToggle} /> },
        {
          label: 'Upload File',
          component: <UploadForm projectCode={projectCode} surveyName={data.name} data={data} postUpload={postUpload} downloadOmkSurvey={downloadOmkSurvey} />
        },
        { label: 'Customization - Label', component: <LabelCustomizationForm data={data} onChange={onIndexedChangeFullSurvey} /> },
        { label: 'Customization - Map/Table', component: <DisplayCustomizationForm data={data} onChange={onIndexedChangeFullSurvey} /> },
        { label: 'Customization - Table', component: <DefaultDisplayCustomizationForm data={data} onChange={onIndexedChangeFullSurvey} /> },
        { label: 'Verification', component: <VerificationForm data={data} /> }
      ]}
    />
  </div>
);


export default compose (
  connect (
    state => ({
      projectName: state.session.projects.find(p => p.code === state.session.projectCode).name,
      projectCode: state.session.projectCode,
      data: state.fullSurvey.newData,
    }),
    dispatch => ({
      onChangeFullSurvey: (field, value) => dispatch(onChangeFullSurvey(field, value)),
      onToggleFullSurvey: field => dispatch(onToggleFullSurvey(field)),
      onIndexedChangeFullSurvey: (field, index, subField, value) => dispatch(onIndexedChangeFullSurvey(field, index, subField, value)),
      cancel: _ => dispatch(addCancelFullSurvey()),
      add: (projectCode, data) => dispatch(addFullSurvey(projectCode, data)),
      update: (projectCode, data) => dispatch(updateFullSurvey(projectCode, data)),
      downloadOmkSurvey: omkSurveyId => dispatch(downloadOmkSurvey(omkSurveyId))
    })
  ),

  withRouter,

  withProps ( props => {
    return {
      onChange: props.onChangeFullSurvey,
      onToggle: props.onToggleFullSurvey
    }
  }),

  withHandlers ({
    postUpload: props => response => {
      const data = response.response;
      const fields = Object.values (data.fields).sort((f1, f2) => f1.order - f2.order);
      fields.forEach(f => {
        f.display = true
        f.defaultDisplay = false
      });
      props.onChangeFullSurvey('fields', fields);
      props.onChangeFullSurvey('meta', data.meta);
      props.onChangeFullSurvey('hash', data.hash);
      props.onChangeFullSurvey('filename', data.filename);
      if (data.meta.files) {
        const files = data.meta.files.map(file => fields.find(field => field.value === file).label);
        props.onChangeFullSurvey('files', files);
      }
      if (data.meta.images) {
        const images = data.meta.images.map(file => fields.find(field => field.value === file).label);
        props.onChangeFullSurvey('images', images);
      }
      if (data.meta.location) {
        const location = fields.find(field => field.value === data.meta.location).label;
        props.onChangeFullSurvey('location', location);
      }
    },
    save: props => _ => {
      if (props.data.id)
        props.update(props.projectCode, props.data);
      else
        props.add(props.projectCode, props.data);
    }
  })

) (SurveyFrom);
