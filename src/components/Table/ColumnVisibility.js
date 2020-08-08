
import React, { PureComponent } from 'react';

const styles = {
  container: {
    background: '#fff',
    border: '1px solid rgba(0, 0, 0, 0.2)',
    borderRadius: 6
  },
  column: {
    padding: 0,
    marginTop: 2
  },
  label: {
    fontSize: 12,
    overflowY: 'hidden',
    textOverflow: 'ellipsis'
  }
};

class ColumnVisibility extends PureComponent {

  componentDidMount() {
    window.componentHandler.upgradeAllRegistered();
  }

  componentDidUpdate() {
    window.componentHandler.upgradeAllRegistered();
  }

  render() {
    const { cols, visible, toggleVisibility } = this.props;

    return (
      <div style={styles.container}>
        <div className="mdl-grid">
          {cols.map( (col, index) =>
            <div key={index} className="mdl-cell mdl-cell--4-col" style={styles.column} >
              <label className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" htmlFor={`rem-tbl-${col.value}`} style={styles.label} >
                <input type="checkbox" id={`rem-tbl-${col.value}`} className="mdl-checkbox__input" value={col.value} checked={visible[col.value]}
                  onChange={(event) => toggleVisibility(event.target.value)} />
                <span className="mdl-checkbox__label" style={styles.label} title={col.label}>{col.label}</span>
              </label>
            </div>
            )
          }
        </div>
      </div>
    );
  }
}

export default ColumnVisibility;
