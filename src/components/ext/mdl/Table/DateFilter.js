import React from 'react';

import FlatButton from 'components/Common/FlatButton';

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

class DateFilter extends React.Component {

  constructor(props) {
    super (props);
    this.state = {
      from: undefined,
      to: undefined,
      expanded: false
    }
    this.isFiltered.bind(this);
    this.toggleExpansion.bind(this);
  }

  componentDidUpdate (_, prevState) {
    if (prevState !== this.state)
      this.props.filterHandler ({ callback: (value) => this.isFiltered(value) });
  }

  isFiltered (value) {
    let flag;
    const isEmpty = value => (value === undefined || value === '');
    if (isEmpty (this.state.from) && isEmpty (this.state.to))
      flag = true;
    else if (isEmpty (this.state.from))
      flag = value <= this.state.to;
    else if (isEmpty (this.state.to))
      flag = value >= this.state.from;
    else
      flag = value >= this.state.from && value <= this.state.to;
    return flag;
  }

  toggleExpansion(evt) {
    evt.preventDefault();
    this.setState({ expanded: !this.state.expanded });
  }

  renderExpanded() {
    return (
      <div style={styles.formContainer}>
        <div style={styles.form}>
          <h4 style={styles.formTitle}>Filter - {this.props.title}</h4>
          <form onSubmit={this.toggleExpansion.bind(this)} style={{display: 'flex', flexDirection: 'column', paddingLeft: 10}}>
            <div>
              <div style={{width: 50, display: 'inline-block'}}>After</div>
              <div className='mdl-textfield mdl-js-textfield' style={{padding: 0, paddingTop: 12, width: 200}}>
                <input className='mdl-textfield__input' type='date' value={this.state.from}
                    style={{width: 115, padding: 0, display: 'inline-block', fontSize: 12, fontWeight: 200}}
                    onChange={(event) => this.setState({ from: event.target.value })} />
              </div>
            </div>
            <div>
              <div style={{width: 50, display: 'inline-block'}}>Before</div>
              <div className='mdl-textfield mdl-js-textfield' style={{width: 200}}>
                <input className='mdl-textfield__input' type='date' value={this.state.to}
                    style={{width: 115, padding: 0, display: 'inline-block', fontSize: 12, fontWeight: 200}}
                    onChange={(event) => this.setState({ to: event.target.value })} />
              </div>
            </div>
            <input type='submit' style={{display: 'none'}}/>
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
          { this.state.from && this.state.to && <div>{this.state.from}&nbsp;-&nbsp;{this.state.to}</div> }
          { this.state.from && !this.state.to && <div>After {this.state.from}</div> }
          { !this.state.from && this.state.to && <div>Before {this.state.to}</div> }
        </div>
      </div>
    );
  }

  render() {
    return this.state.expanded ? this.renderExpanded() : this.renderCondensed();
  }
}

export default DateFilter;
