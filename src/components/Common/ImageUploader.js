
import React from 'react';
import PropTypes from 'prop-types';

import request from 'superagent';
import FormData from 'form-data';

import AlertError from './AlertError';

const styles = {
  container: {
    marginLeft: 20,
    marginRight: 20,
    width: 'calc(100% - 40px)',
    height: 262,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  resetLink: {
      color: '#2196f3',
      textDecoration: 'underline',
      cursor: 'pointer'
  }
}

class ImageUploader extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      editing : true,
      reset : false,
      uploadedFile:null,
      uploading:false,
      uploaded:false,
    };
    this.handleFileSelect = this.handleFileSelect.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
  }

  handleFileSelect (e) {
    if(this.state.uploaded || this.state.uploading)
      return false;
    e.stopPropagation();
    e.preventDefault();
    const files = e.target.files || e.dataTransfer.files;
    const fileList = Object.keys(files).map(file => files[file]);
    this.setState({
      uploadedFile : fileList[0],
    });
  }

  handleDragOver (e) {
    if ('preventDefault' in e) {
      e.stopPropagation();
      e.preventDefault();
    }
  }

  handleDragEnd (e) {
    if ('preventDefault' in e) {
      e.stopPropagation();
      e.preventDefault();
    }
  }
  
  resetFile () {
    this.setState({
      editing : true,
      reset : false,
      uploadedFile:null,
      uploading:false,
      uploaded:false,
    });
    return false;
  }

  handleUpload () {
    const formData = new FormData();
    formData.append('file', this.state.uploadedFile);
    const token = localStorage.getItem('token');
    this.setState({uploading:true, editing:false});

    request.put(this.props.url)
      .set('Authorization',`Token ${token}`)
      .send(formData)
      .end((error,response) => {
      if(!error && response) {
        this.setState({uploaded:true, uploading:false});
        if (this.props.onSuccess)
          this.props.onSuccess (response.text);
      } else {
        this.setState({uploadingError:true, uploading: false});
      }
    });
  }

  getExtFromType (type) {
    const parts = type.split('/');
    return parts[parts.length - 1];
  };

  getExtFromName (name) {
    const parts = name.split('.');
    return parts[parts.length - 1];
   };
   
  render () {

    let fileExt = null;
    
    if(this.state.uploadedFile){
      fileExt = this.state.uploadedFile.type ? `.${this.getExtFromType(this.state.uploadedFile.type)}` : `.${this.getExtFromName(this.state.uploadedFile.name)}`;  
    }

    const fileNames = this.state.uploadedFile ? this.state.uploadedFile.name.replace(fileExt, '') : 'Select File';

    return (
      <div style={styles.container} className="box"
        onDragOver={this.handleDragOver} onDragLeave={this.handleDragEnd} onDrop={this.handleFileSelect} >
        { this.state.editing &&
          <div>
            <svg className="box__icon" xmlns="http://www.w3.org/2000/svg" width="50" height="43" viewBox="0 0 50 43">
              <path d="M48.4 26.5c-.9 0-1.7.7-1.7 1.7v11.6h-43.3v-11.6c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v13.2c0 .9.7 1.7 1.7 1.7h46.7c.9 0 1.7-.7 1.7-1.7v-13.2c0-1-.7-1.7-1.7-1.7zm-24.5 6.1c.3.3.8.5 1.2.5.4 0 .9-.2 1.2-.5l10-11.6c.7-.7.7-1.7 0-2.4s-1.7-.7-2.4 0l-7.1 8.3v-25.3c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v25.3l-7.1-8.3c-.7-.7-1.7-.7-2.4 0s-.7 1.7 0 2.4l10 11.6z">
              </path>
            </svg>
            <input id={`${this.props.id}-file`} type='file' tabIndex='-1'
              ref={x => this.input = x} className="input"
              multiple={false} onChange={this.handleFileSelect}/>
            <label htmlFor="file">  
              <strong>{fileNames}</strong>
              {this.state.uploadedFile && <span>&nbsp; or <span style={styles.resetLink} onClick={this.resetFile.bind(this)}> Reset</span>.</span>}
              {!this.state.uploadedFile && <span> or drag it here.</span>}
            </label>
            
            <button id={`${this.props.id}-btn-upload`} type="button" className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect box__button"
                disabled={!this.state.uploadedFile} onClick={this.handleUpload.bind(this)}>
              Upload
            </button>
          </div>
        }
        { this.state.uploading && <div className="box__uploading">Uploading&hellip;</div> }
        { this.state.uploaded && <div className="box__success">File Uploaded</div> }
        { this.state.uploadingError && <AlertError message="There was an error while uploading file. Please contact system admin."/>}
      </div>
    );
  }
}


ImageUploader.propTypes = {
  id: PropTypes.string.isRequired,

  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,

  currentImage: PropTypes.string,
};


export default ImageUploader;
