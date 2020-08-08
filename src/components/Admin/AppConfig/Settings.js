
import React from 'react';

import EditableTable from 'components/Common/EditableTable';

const columns = [
  {
    label: 'Key',
    field: 'key',
    editable: false,
    type:'string',
    width: 180
  },
  {
    label:'Value',
    field: 'value',
    editable: true,
    type: 'string',
    width: 250
  }
];

const Settings = ({data}) => (
  <div>
    <EditableTable columns={columns} datas={Object.values(data).sort((r1, r2) => (r1.key > r2.key))} />
  </div>
);

export default Settings;
