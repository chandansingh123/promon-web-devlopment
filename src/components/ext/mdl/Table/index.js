import React from 'react';
import { Link } from 'react-router-dom';

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import DateFilter from './DateFilter';
import SelectFilter from './SelectFilter';


class Table extends React.Component {

  renderDownloads(cell) {
    if (cell === undefined || cell === null)
      return;
    return (
      <div style={{display: 'flex', justifyContent: 'space-around', marginTop: -8, marginBottom: -8, flexDirection: 'column'}}>
        { (typeof(cell) === 'object') ?
          <React.Fragment>
            { Object.keys(cell).map((filename, idx) =>
              <div key={idx}>
                <Link to={cell[filename]} target='_blank'>{filename}</Link>
              </div>
            )}
          </React.Fragment> :
          <Link to={cell} target='_blank'>
            <div style={{color: '#2f9ae0', cursor: 'pointer', lineHeight: '10px'}}>
              <i className="material-icons">cloud_download</i>
            </div>
          </Link>
      }
      </div>
    )
  }

  headerFunction (column, idx, values) {
    const filters = ((type) => {
      switch (type) {
        case 'date':
          return { type:'CustomFilter', getElement: (handler) => <DateFilter filterHandler={handler} title={column.label} /> };
        case 'select':
        case 'select1':
          return { type:'CustomFilter', getElement: (handler) => <SelectFilter filterHandler={handler} values={values} title={column.label} /> };
        default:
          return { type: 'TextFilter' };
      }
    });

    switch (column.type) {
      case 'file':
      return <TableHeaderColumn width={column.width} isKey={false} key={column.value} dataField={column.value} dataFormat={this.renderDownloads} />;
      case 'id':
      return <TableHeaderColumn isKey={true} key={column.value} dataField={column.value} hidden={true} />
      default:
      const dataFormat = column.link ?
        (cell) => <Link to={`${column.link}${cell}`} style={{textDecoration: 'underline'}}>{cell}</Link> :
        (cell) => <div style={{ textOverflow: 'ellipsis', overflow: 'hidden'}} title={cell} >{cell}</div>;
      return (
        <TableHeaderColumn width={column.width} isKey={false} key={column.value} dataField={column.value}
          hidden={column.display === undefined ? false : !column.display}
          filter={filters(column.type)} dataSort thStyle={{ 'verticalAlign': 'top' }}
          dataFormat={dataFormat} >
          {column.label}
        </TableHeaderColumn>
      );
    }
  }

  renderActions(cell, row) {
    if (cell=== undefined || cell ==='' || cell === 'N/A') {
      return null;
    }

    const buttons = {
      location: 'location_on',
      detail:   'account_circle',
      edit:     'mode_edit',
      delete:   'delete_forever',
      download: 'cloud_download',
      upload:   'file_upload',
      export:   'file_download',
      data:     'view_list',
      approval: 'keyboard_arrow_right'
    };

    return (
      <div style={{display: 'flex', justifyContent: 'space-around', marginTop: -8, marginBottom: -8}}>
        {this.props.actions.filter(a => !a.hide).map(a => (
          <span key={a.type} style={{color:`${cell ? 'blue' : '#ccc'}`, cursor: `${cell ? 'pointer' : 'default'}`}} onClick={() => a.action(cell, row)}>
            <i className="material-icons" >{buttons[a.type]}</i>
          </span>
        ))}
      </div>
    )
  }

  render() {
    const props = {};
    if (this.props.exportTo) {
      props.exportCSV = true;
      props.csvFileName = this.props.exportTo;
    }

    const options = {
      paginationShowsTotal: (from, to, total) => <p style={{fontSize: '12px'}}>Showing { from } to { to } of { total } entries</p>,
    };
    if (this.props.modal) {
      options.insertModal = this.props.modal.onClick;
      options.insertText = this.props.modal.text;
      props.insertRow = true;
    }

    const headers = this.props.columns.map ((c, idx) => this.headerFunction(c, idx, c.values));
    if (this.props.actions) {
      const width = this.props.actions.length <= 2 ? 60 : this.props.actions.length * 30;
      headers.push(<TableHeaderColumn width={width.toString()} key={this.props.keyField} dataField={this.props.keyField} isKey={true}
        dataFormat={this.renderActions.bind(this)} dataAlign='center'/>);
    }

    return (
      <div style={{fontSize: '12px'}}>
        <BootstrapTable data={this.props.data} striped hover pagination options={options} {...props} >
          { headers }
        </BootstrapTable>
      </div>
    );
  }
}

export default Table;
