import React from 'react';
import { StyleSheet, css } from 'aphrodite';

import Stepper from 'components/Common/Stepper';
import Dialog from 'components/Admin/Common/Dialog';
import Cancel from 'components/Admin/Common/CancelButton';
import InputField from 'components/Admin/Common/InputField';
import EditableTable from 'components/Common/EditableTable';
import FileUploader from 'components/Common/FileUploader';

const styles = StyleSheet.create ({
  hiddenInput: {
    left: 41,
    position: 'absolute',
    bottom: 52,
    zIndex: -1
  }
});

const OmkSurveyInfo = (props) => (
  <form>
    <div style={{paddingLeft: 20}} >
      <div style={{height: 60}}></div>
      <InputField id='rem-omk-frm-name' disabled={props.omkSurvey.newData.label} label='Name' type='text' field='name'
          value={props.omkSurvey.newData.name} onChange={props.onChange}
          required errorMsg='Survey name is required.' />
    </div>
  </form>
);

const OmkSurveyFileForm = (props) => (
  <div>
    <form>
      <div className={`${css(styles.hiddenInput)}`}>
        <InputField value={props.omkSurvey.newData.fields && props.omkSurvey.newData.fields.length ? props.omkSurvey.newData.fields[0].id : ''}
            onChange={() => console.log()} field=''
            required errorMsg='You need to upload an Excel survey file before continuing.' />
      </div>
      <div style={{height: 20, marginBottom: 5, marginLeft: 20}}>
        {props.omkSurvey.newData.filename && <div id='rem-omk-frm-filename'>Uploaded file: {props.omkSurvey.newData.filename}</div>}
      </div>
      <FileUploader id='rem-omk-frm' url={`surveys/${props.omkSurvey.newData.id}/excel/`}
          postUpload={() => props.fetchPartialOmkSurvey (props.omkSurvey.newData.id, 'fields')} />
    </form>
  </div>
);


const columns = [
  {
    label: 'Group',
    field: 'group',
    editable: false,
    type:'string',
    width: 160
  },
  {
    label:'Label',
    field: 'label',
    editable: true,
    type: 'string',
    width: 230
  },
  {
    label:'Code (from Excel File)',
    field: 'value',
    editable: false,
    type: 'string',
    width: 220
  },
  {
    label:'Discrete Data?',
    field: 'discrete',
    editable: true,
    type: 'boolean',
    width: 60
  }
];

const OmkSurveyFields = (props) => (
  <div>
    {
      !props.omkSurvey.isFetching &&
      props.omkSurvey.newData.fields &&
      <EditableTable id='rem-omk-frm' columns={columns} datas={props.omkSurvey.newData.fields} inDialog={true}
      onClick={props.onSwitchToggle} onChange={props.onChange} />
    }
  </div>
);

const SurveyForm = (props) => {
  const cancelButton = <Cancel id='rem-omk-frm-cancel' key={1} onClick={props.onCancel}/>

  const steps = {
    1: {
      label: 'Add Survey Name',
      step: 1,
      component: <OmkSurveyInfo onChange={props.formFieldOmkSurveyChange} omkSurvey={props.omkSurvey}/>,
      handleNext: props.omkSurvey.newData.id ? false : props.saveOmkSurvey,
      buttons: [cancelButton]
    },
    2: {
      label: 'Upload Survey File',
      step: 2,
      component: <OmkSurveyFileForm omkSurvey={props.omkSurvey} fetchPartialOmkSurvey={props.fetchPartialOmkSurvey} />,
      handleNext: props.saveOmkSurveyFile,
      buttons: [cancelButton]
    },
    3: {
      label: 'Verify Questions',
      step: 3,
      component: <OmkSurveyFields omkSurvey={props.omkSurvey} onSwitchToggle={props.onSwitchToggle} inDialog={true} useId={false}
        onChange={(field, index, value) => props.onChange('fields', index, field, value)} />,
      buttons: [cancelButton]
    }
  };

  return (
    <Dialog style={{minWidth: 850, maxWidth: '100vw', width: 850}} resetForm={props.addOmkSurveyCancel} show={props.show} >
      <Stepper id='rem-omk-frm' reset={!props.show} finalButtonLabel='Save' steps={steps}
        onFinish={() => props.addEditOmkSurvey (props.omkSurvey.newData)} />
    </Dialog>
  )
};

export default SurveyForm;
