
import React from 'react';

import request from 'superagent';
import FormData from 'form-data';

import config from 'config/config';

import FlatButton from 'components/Common/FlatButton';

const styles = {
  container: {
    width: 400,
    height: 240,
    maxWidth: '100%',
    maxHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c8dadf',
    padding: 24,
    outline: '2px dashed #92b0b3',
    outlineOffset: -10
  },
  downloadIcon: {
    width: '100%',
    height: 36,
    fill: '#92b0b3',
    marginBottom: 16
  },
  resetLink: {
      color: '#2196f3',
      textDecoration: 'underline',
      cursor: 'pointer'
  }
}

class FileUploader extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      state: 'INITIAL',
      file: null,
      uploadedFiles: []
    };
    this.onDrop = this.onDrop.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
  }

  stopDefault (evt) {
    if ('preventDefault' in evt) {
      evt.stopPropagation();
      evt.preventDefault();
    }
  }

  onDrop(e) {
    if (this.state.uploading)
      return false;
    this.stopDefault(e);

    const files = e.target.files || e.dataTransfer.files;
    const fileList = Object.keys(files).map(file => files[file]);
    this.setState({
      file : fileList[0],
      state: 'FILE_SET'
    });
  }

  onDragOver = evt => this.stopDefault(evt)

  onDragLeave = evt => this.stopDefault(evt)
  
  resetFile () {
    this.setState({
      state: 'INITIAL',
      file: null
    });
    return false;
  }

  handleUpload () {
    const validationSuccess = this.props.validate ? this.props.validate() : true;
    if (!validationSuccess)
      return;

    const formData = new FormData();
    formData.append('document', this.state.file);
    if (this.props.meta) {
      Object.keys(this.props.meta).forEach(key => formData.append(key, this.props.meta[key]));
    }
    const token = localStorage.getItem('token');
    this.setState({ state: 'UPLOADING' });

    request.post(`${config.backend.url}/${this.props.url}`)
      .set('Authorization',`Token ${token}`)
      .send(formData)
      .end((error,response) => {
      if(!error && response) {
        this.setState({
          state: 'INITIAL',
          uploadedFiles: [...this.state.uploadedFiles, this.state.file.name]
        });
        if (this.props.postUpload)
          this.props.postUpload ({
            response: response.body,
            filename: this.state.file.name,
            field: this.props.field
          });
      } else {
        this.setState({ state: 'FILE_SET' });
      }
    });
  }

  render () {
    return (
      <div style={styles.container}  onDragOver={this.onDragOver} onDragLeave={this.onDragLeave} onDrop={this.onDrop}>
        <svg style={styles.downloadIcon} xmlns="http://www.w3.org/2000/svg" width="50" height="43" viewBox="0 0 50 43">
          <path d="M48.4 26.5c-.9 0-1.7.7-1.7 1.7v11.6h-43.3v-11.6c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v13.2c0 .9.7 1.7 1.7 1.7h46.7c.9 0 1.7-.7
            1.7-1.7v-13.2c0-1-.7-1.7-1.7-1.7zm-24.5 6.1c.3.3.8.5 1.2.5.4 0 .9-.2 1.2-.5l10-11.6c.7-.7.7-1.7 0-2.4s-1.7-.7-2.4 0l-7.1
            8.3v-25.3c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v25.3l-7.1-8.3c-.7-.7-1.7-.7-2.4 0s-.7 1.7 0 2.4l10 11.6z">
          </path>
        </svg>

        { this.state.state === 'INITIAL' && <div style={{fontSize: '15px', fontWeight: 'bold'}}>Drag your file here. </div> }
        { this.state.state === 'FILE_SET' && 
          <div>
            <div>
              {this.state.file.name}
              <FlatButton icon='cancel' onClick={this.resetFile.bind(this)} small />
            </div>
            <FlatButton icon='cloud_upload' label='UPLOAD' onClick={this.handleUpload.bind(this)}/>
          </div>
        }
        <div style={{flexGrow: 1, width: '100%'}}>
          {this.state.uploadedFiles.length > 0 &&
            <div>
              <div style={{textDecoration: 'underline', fontWeight: 'bold'}}>Uploaded Files:</div>
              <ul style={{listStyleType: 'none', padding: 0}}>
                { this.state.uploadedFiles.map((f, idx) => <li key={idx}>{f}</li>) }
              </ul>
            </div>
          }
        </div>
        { this.state.state === 'UPLOADING' && <div>Uploading&hellip;</div> }
      </div>
    );
  }
}

export default FileUploader;
