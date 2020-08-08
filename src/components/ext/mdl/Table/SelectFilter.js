
import React from 'react';

import FlatButton from 'components/Common/FlatButton';
import CheckBox from 'components/ext/mdl/CheckBox';

const styles = {
  obfuscator: {
    backgroundColor: 'rgba(0,0,0,0)',
    pointerEvents: 'auto',
    position: 'absolute', top: 0, left: 0,
    height: '100%', width: '100%',
    zIndex: 4,
  },
  form: {
    'backgroundColor': 'rgba(255,255,255,1)',
    border: '1px solid rgba(0,0,0,0.2)',
    zIndex: 5,
    boxShadow: 'rgba(0, 0, 0, 0.23) 0px 20px 75px'
  },
  formContainer: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0
  },
  formTitle: {
    margin: '5px 0',
    fontSize: '20px',
    borderBottom: '1px solid gray',
    padding: '0 10px',
    textAlign: 'center'
  }
};


class SelectFilter extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      expanded: false,
      values: {},
      loaded: false,
      allSelected: true
    }
    this.isFiltered.bind(this);
    this.toggleExpansion.bind(this);
  }

  componentDidUpdate (_, prevState) {
    window.componentHandler.upgradeAllRegistered();
    if (!this.state.loaded)
      this.getValues();
    if (prevState.values !== this.state.values)
      this.props.filterHandler ({ callback: (value) => this.isFiltered(value) });
  }

  isFiltered (value) {
    if (!this.state.loaded || this.state.allSelected)
      return true;
    const splitValue = value.split(',');
    for (let i=0; i < splitValue.length; i++) {
      if (this.state.values[splitValue[i]])
        return true;
    }
    return false;
  }

  toggleExpansion (evt) {
    evt.preventDefault();
    this.setState({expanded: !this.state.expanded});
  }

  toggleSelection(field, value) {
    const values = {...this.state.values, [field]: value};
    const allSelected = Object.values(values).reduce((acc, v) => acc & v, true);
    this.setState({ values, allSelected });
  }

  getValues() {
    const values = this.props.values;
    if (values && values.length) {
      const valueV = {'': true};
      values.forEach (v => valueV[v] = true);
      this.setState({values: valueV, loaded: true, allSelected: true});
    }
  }

  renderExpanded() {
    const values = this.state.values;
    return (
      <div style={styles.formContainer}>
        <div style={styles.form}>
          <h4 style={styles.formTitle}>Filter - {this.props.title}</h4>
          <form onSubmit={this.toggleExpansion.bind(this)} style={{display: 'flex', flexDirection: 'column', paddingLeft: 10}}>
            { this.state.loaded &&
              Object.keys(values).map ((v, idx) =>
                <CheckBox key={idx} label={v} field={v} onClick={this.toggleSelection.bind(this)} checked={this.state.values[v]} />)
            }
            <input hidden='true' type='submit' value='Done' />
          </form>
        </div>
        <div style={styles.obfuscator} onClick={this.toggleExpansion.bind(this)}/>
      </div>
    );
  }

  renderCondensed() {
    return (
      <div>
        <FlatButton style={{float: 'right'}} icon='filter_list' onClick={this.toggleExpansion.bind(this)} small />

        <div style={{fontSize: 12, fontWeight: 'normal', lineHeight: '24px', overflowX: 'hidden', textOverflow: 'ellipsis'}} >
          { this.state.allSelected ?
            <div>All Selected</div> :
            <div>{ Object.keys(this.state.values).filter(v => this.state.values[v]).join() }</div>
          }
        </div>
      </div>
    );
  }

  render() {
    return this.state.expanded ? this.renderExpanded() : this.renderCondensed();
  }
}

export default SelectFilter;
