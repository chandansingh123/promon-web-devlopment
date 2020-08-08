import React from 'react';

import SelectFn from 'components/Common/SelectFn';
import ColoredButton from 'components/Admin/Common/ColoredButton';

import ActiveIcon from './ActiveIcon';
import InactiveIcon from './InactiveIcon';

const style = {
  padding: 4
};

const TableCell = ({ id, data, column, index, onChange, onClick, options, useId}) => {
  switch (column.type) {
    case 'string':
    return (
      <td className="mdl-data-table__cell--non-numeric" style={style}>
        <div style={{width: column.width}}>
        {column.editable ?
          <div className="mdl-textfield mdl-js-textfield">
            <input id={`${id}-${column.field}`} className="mdl-textfield__input"  value={data[column.field] || ''} type="text"
              onChange={(event) => onChange(column.field, (useId ? data.id : index), event.target.value)}/>
          </div> :
          <div id={`${id}-${column.field}`} style={{ paddingRight: 4,textOverflow: 'ellipsis', overflow: 'hidden' }} title={data[column.field]} >
            {data[column.field]}
          </div>
        }
        </div>
      </td>
    );
    case 'boolean':
    return (
      <td className="mdl-data-table__cell--non-numeric" onClick={() => column.editable ? onClick(column.field, index): false}  style={style}>
        <div style={{width: column.width, display: 'table'}}>
          <div id={`${id}-${column.field}`} style={{display: 'table-cell', textAlign: 'center'}}>
            {data[column.field] ? <ActiveIcon/> : <InactiveIcon/>}
          </div>
        </div>
      </td>
    );
    case 'select':
    return (
      <td className="mdl-data-table__cell--non-numeric" style={style}>
        <div style={{width: column.width, display: 'table'}}>
          <div className="mdl-textfield mdl-js-textfield">
            <SelectFn id={`${id}-${column.field}`} options={column.options} value={data[column.field]} prefix={index} keyFn={column.keyFn} valueFn={column.valueFn}
              field={column.field} onChange={(field, value) => onChange(field, data.id, value)} />
          </div>
        </div>
      </td>
    );
    case 'number':
    return (
      <td style={style}>
        <div style={{width: column.width}}>
          {column.editable ?
            <div className="mdl-textfield mdl-js-textfield">
              <input id={`${id}-${column.field}`} className="mdl-textfield__input" value={data[column.field]} type="number"
                  onChange={(event) => onChange(column, index, event.target.value)} />
              <span className="mdl-textfield__error">Input is not a number!</span>
            </div> :
            data[column.field] ? <div id={`${id}-${column.field}`}>data[column.field]</div> : ''
          }
        </div>
      </td>
    );
    case 'buttons':
    const buttonMapping = {Accept: 'done', Reject: 'clear'};
    return (
        <td style={style}>
          <div style={{width: column.width}}>
          {column.buttons.map (btn =>
            <ColoredButton id={`${id}-${btn.name}`} key={btn.name} icon={buttonMapping[btn.name]} style={{margin: 4}} tooltip={btn.name}
              onClick={() => btn.onClick(data, btn.name)} />)}
          </div>
        </td>
      );
    default:
    return (
      <td id={`${id}-${column.field}`} >...</td>
    );
  }
};

const TableRow = (props) => (
  <tr id={props.id}>
   { props.columns.map( (column, index) => <TableCell id={props.id} key={index} index={props.rowIndex} column={column} {...props} />) }
  </tr>
);

const EditableTable = ({ id, columns, datas, onChange, onClick, inDialog, useId }) => {

  const verticalStyle = inDialog ? {maxHeight: 250, overflowY: 'auto', overflowX: 'visible', position: 'relative', width: '100%'} : {};
  const horizontalStyle = inDialog ? {overflowX: 'auto'} : {overflowX: 'auto', position: 'relative'};

  return (
    <div className="pm-editable-table" style={horizontalStyle}>
      <table className="mdl-data-table mdl-js-data-table pm-editable-table">
        <thead>
          <tr>
            {columns.map( (column, index) => {
              return (
                <th key={index} className="mdl-data-table__cell--non-numeric" style={{...style, whiteSpace: 'pre-wrap'}} >
                  <div style={{width: column.width}}>{column.label}</div>
                </th>
              )
            })}
          </tr>
        </thead>
      </table>
      <div style={verticalStyle}>
        <table  id={`${id}-tbl`} className="mdl-data-table mdl-js-data-table pm-editable-table">
          <tbody>
            { datas.map((rowData, index) =>
              <TableRow id={`${id}-tbl-${index}`} data={rowData} key={index} columns={columns} rowIndex={index} onChange={onChange} onClick={onClick} useId={useId} inDialog={inDialog} />)
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EditableTable;
