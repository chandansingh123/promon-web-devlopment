import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import { setUi, fetchUserProfile } from 'actions/userActions';
import FileUploader from 'components/Common/FileUploader';
import InputField from 'components/Admin/Common/InputField';

const GeojsonForm = ({ projectCode, setUi, ui, fetchUserProfile }) => (
  <div style={{width: '50%', padding: 20}}>
    <h4 style={{fontSize: '20px'}}>Upload New Geojson Layer</h4>
    <form id='map-upload-frm'>
      <InputField id='map-upload-frm-name' label='Name' value={ui['baselayer.name']} field=''
          errorMsg='A name for the layer is mandatory.' required
          onChange={(_, value) => setUi('baselayer.name', value)} />
      <FileUploader id='rem-map-uploader' url={`projects/${projectCode}/base-layers`} meta={{name: ui['baselayer.name']}}
          validate={validateForm} postUpload={fetchUserProfile} />
    </form>
  </div>
);

function validateForm () {
  let isValid = true;
  const frm = document.getElementById ('map-upload-frm');
  const inputElements = frm.getElementsByClassName('mdl-textfield');
  for (let i = 0; i < inputElements.length; i++) {
    const flag = inputElements[i].MaterialTextfield && inputElements[i].MaterialTextfield.checkValidity (true);
    isValid = isValid && flag;
  }
  return isValid;
}

export default compose(
  connect(
    state => ({
      projectCode: state.session.projectCode,
      ui: state.ui
    }),
    dispatch => ({
      setUi: (key, value) => dispatch(setUi(key, value)),
      fetchUserProfile: _ => dispatch(fetchUserProfile())
    })
  )

) (GeojsonForm);
