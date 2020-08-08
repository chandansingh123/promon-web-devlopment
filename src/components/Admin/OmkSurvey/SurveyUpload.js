
import React from 'react';
import { withRouter } from 'react-router-dom';

import FileUploader from 'components/Common/FileUploader';
import SelectFn from 'components/Common/SelectFn';
import CancelButton from 'components/Admin/Common/CancelButton';
import ColoredButton from 'components/Admin/Common/ColoredButton';
import Switch from 'components/Admin/Common/Switch';

const styles = {
  row: {
    height: 36
  },
  cell: {
    height: 24
  },
  buttons: {
    marginTop: 10
  }
};

class SurveyUpload extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      data: undefined,
      fields: [],
      error: false,
      hasHeader: false
    };

    this.renderHead = this.renderHead.bind(this);
  }

  componentDidMount () {
    this.props.uploadStartingOmkSurvey ();
  }

  componentDidUpdate() {
    window.componentHandler.upgradeAllRegistered();
  }

  setData (data) {
    this.setState ({ data: data.response });
  }

  setField (index, value) {
    const updatedFields = [...this.state.fields];
    updatedFields[index] = value;
    this.setState ({
      fields: updatedFields
    });
    const newData = this.convertToDate(index, value);
    if (newData)
      this.validateData (index, value, newData);
    else
      this.validateData (index, value, this.state.data);
  }

  convertToDate(colIndex, value) {
    const surveyData = this.props.omkSurvey.data[this.props.surveyId];
    const fields = surveyData ? surveyData.fields : [];
    const datatype = fields.filter (f => f.value === value)[0].datatype;

    if (datatype === 'date') {
      const newData = [];
      const regex = /^\d+$/;
      this.state.data.forEach (rowData => {
        const data = [...rowData];
        const pad2 = num => num < 10 ? '0' + num : num;
        const format = date => date.getUTCFullYear() + '-' + pad2(date.getUTCMonth()+1) + '-' + pad2(date.getUTCDate());
        if (data[colIndex].toString().match(regex)) {
          data[colIndex] = format(new Date((data[colIndex] - 25569) * 24 * 3600 * 1000));
          newData.push(data);
        } else {
          newData.push(data);
        }
      });
      this.setState({ data: newData});
      return newData;
    }
  }

  validateData (colIndex, value, data) {
    let error = false;

    const surveyData = this.props.omkSurvey.data[this.props.surveyId];
    const fields = surveyData ? surveyData.fields : [];
    const datatype = fields.filter (f => f.value === value)[0].datatype;

    if (datatype === 'string') {
      data.forEach ((rowData, rowIndex) => {
        const el = document.getElementById (`rem-omk-upload-${rowIndex}-${colIndex}`);
        if (el) {
          el.style.color = 'black';
          el.style.borderBottom = '';
          el.title = '';
        }
      });
    } else {
      data.forEach ((rowData, rowIndex) => {
        error = this.validateCell (rowIndex, colIndex, rowData, datatype) ? true : error;
      });
    }

    this.setState ({error});
  }

  validateCell (row, col, data, datatype) {
    const regex = {
      int: /^\d*$/,
      float: /^[+-]?\d*(\.\d*)?$/,
      date: /^\d{4}-\d?\d-\d?\d$/,
      datetime: /^\d{4}-\d?\d-\d?\d \d{2}:\d{2}:\d{2}$/
    };
    const errorTooltip = {
      int: 'Must be a whole number',
      float: 'Must be a decimal number',
      date: 'Must be date in the format YYYY-MM-DD',
      datetime: 'Must be date time in the format YYYY-MM-DD HH:MI:SS'
    };

    if (this.state.hasHeader && row === 0)
      return false;

    const el = document.getElementById (`rem-omk-upload-${row}-${col}`);
    if (!data[col].toString ().match (regex[datatype])) {
      el.style.color = 'red';
      el.style.borderBottom = '1px solid red';
      el.title = errorTooltip[datatype];
      return true;
    } else {
      el.style.color = 'black';
      el.style.borderBottom = '';
      return false;
    }
  }

  uploadData () {
    const id = this.props.surveyId;
    const payload = {
      data: this.state.hasHeader ? this.state.data.slice (1) : this.state.data,
      fields: this.state.fields
    }
    this.props.dataUploadOmkSurvey (id, payload);
  }

  onChange () {
    this.setState ({ hasHeader: !this.state.hasHeader });
  }

  renderRow (row, index) {
    if (this.state.hasHeader && index === 0)
      return null;

    return (
      <tr key={index} style={styles.row} id={`rem-omk-upload-${index}`}>
        { row.map ((col, colIndex) =>
          <td key={colIndex} style={styles.cell} >
            <div id={`rem-omk-upload-${index}-${colIndex}`}>{col}</div>
          </td>) }
      </tr>
    );
  }

  renderHead (index, fields) {
    return (
      <th key={index} style={{height: 36}} >
        <SelectFn options={fields} keyFn={x => x.value} valueFn={x => x.label} field='field' value={this.state.fields[index]}
            onChange={(_, value) => this.setField (index, value)}/>
      </th>
    );
  }

  render () {
    const surveyData = this.props.omkSurvey.data[this.props.surveyId];
    const fields = surveyData ? surveyData.fields : [];

    const data = this.state.data || [];
    const maxCols = data.reduce ((acc, cv) => Math.max (acc, cv.length), 0);
    const switchLabel = this.state.hasHeader ? 'Discard header row' : 'File does not have header row';

    return (
      <div className='mdl-cell--1-offset'>
        <div className='mdl-cell mdl-cell--4-col'>
          <h4>Upload Data (Excel)</h4>
          { !this.state.data &&
            <FileUploader id='rem-omk-upload-file' url={`surveys/${this.props.surveyId}/data-upload/`} postUpload={this.setData.bind(this)} />
          }
        </div>

        {
          this.props.omkSurvey.uploadSuccess &&
          <div className='mdl-cell mdl-cell--4-col' style={{backgroundColor: 'lightgreen', padding: '20px 40px', fontSize: 20}}>
            Data Uploaded Successfully.
          </div>
        }

        { this.state.data &&
          <div className='mdl-cell--11-col' style={{overflowX: 'auto'}} >
            <Switch id='rem-omk-upload-dataheader' checked={this.state.hasHeader} disabled={false} label={switchLabel}
                onChange={this.onChange.bind(this)} field='x' />

            <div style={{maxHeight: 500}}>
              <table className='mdl-data-table mdl-js-data-table'>
                <thead>
                  <tr>
                    { [...Array(maxCols)].map ((i, index) => this.renderHead (index, fields)) }
                  </tr>
                </thead>
                <tbody>
                { data.map ((row, index) => this.renderRow (row, index)) }
                </tbody>
              </table>
            </div>
          </div>
        }

        <div style={styles.buttons}>
          <CancelButton style={{float: 'left'}} onClick={this.props.history.goBack}/>
          { this.state.data &&
            <ColoredButton style={{float: 'left', marginLeft: 10}} label='Import Data' disabled={this.state.error}
              onClick={this.uploadData.bind(this)}/> }
        </div>

      </div>
    );
  }
}

export default withRouter (SurveyUpload);
