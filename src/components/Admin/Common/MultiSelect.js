
import React from 'react';

import Select from './Select';
import DeletableChip from './DeletableChip';
import * as utils from 'utils/Utils';

const MultiSelect = (props) => {
  const options = {...props.options}
  const selected = props.selected ? props.selected : [];
  Object.keys(props.options).forEach (optionKey => {
    utils.includesObject(optionKey,selected) && delete options[optionKey];
  });

  return (
    <div style={props.style}>
      <Select field={props.field} options={options} value="" onChange={props.onChange} id={props.id} label={props.label} style={{marginTop: -5}} />
      <div style={{marginTop: -15}} >
        {selected.map( (_selected,index) =>
          <DeletableChip id={`${props.id}-${_selected}`} key={index} textStyle={props.textStyle}
            onDelete={() => props.removeSelected( props.field, _selected )} label={props.options[_selected]} />)}
      </div>
    </div>
  );
};

export default MultiSelect;
