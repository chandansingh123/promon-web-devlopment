
import React from 'react';
import {Link} from 'react-router-dom';
import { StyleSheet, css } from 'aphrodite';


const styles = StyleSheet.create ({
  buttonCell: {
    padding: '0 10px',
    height: 40,
    display: 'flex',
    justifyContent: 'space-evenly',
    borderBottom: '0px'
  },
  optionalCol: {
    '@media (max-width: 992px)': {
      display: 'none'
    }
  },
  headerCell: {
    paddingLeft: 2,
    paddingRight: 2,
    overflowX: 'hidden'
  }
});

const oldStyles = {
  tableCell: {
    paddingRight: 4,
    paddingLeft: 18,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    tableLayout: 'fixed'
  },
  searchContainer: {
    marginBottom: 5,
    display: 'flex',
    flexDirection: 'row-reverse',
    marginRight: 10
  },
  searchInput: {
    width: 400,
    paddingBottom: 0,
    paddingTop: 0,
    marginRight: -30
  }
};

const activeIcon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#8bc04a" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
const inactiveIcon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="red" d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></svg>								

class Table extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      data: props.data,
      filteredData: props.data,
      searchTerm: ''
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (state.data !== props.data)
      return {
        filteredData: props.data,
        data: props.data,
        searchTerm: ''
      };
    return null;
  }

  onSearch (event) {
    event.preventDefault ();
    const searchTerm = this.state.searchTerm;

    const filteredData = [];
    for (let i = 0; i < this.props.data.length; i++) {
      for (let j = 0; j < this.props.cols.length; j++) {
        const cellValue = this.props.data[i][this.props.cols[j].field];
        if (String (cellValue).includes (searchTerm)) {
          filteredData.push (this.props.data[i]);
          break;
        }
      }
    }
    this.setState ({filteredData});
  }

  renderButton (id, index, action, rowData) {
    const actionMap = {
      edit:      { color: '#2f9ae0', icon: 'mode_edit' },
      delete:    { color: 'red',     icon: 'delete_forever' },
      download:  { color: '#2f9ae0', icon: 'cloud_download' },
      detail:    { color: '#2f9ae0', icon: 'keyboard_arrow_right' },
      upload:    { color: '#2f9ae0', icon: 'file_upload' },
      export:    { color: '#2f9ae0', icon: 'file_download' },
      data:      { color: '#2f9ae0', icon: 'view_list' },
    };

    const disable = action.disable ? action.disable(rowData.id, rowData) : false;
    const color = disable ? 'grey' : actionMap[action.type].color;

    return (
      <button className='mdl-button mdl-js-button mdl-button--icon' id={`${id}-${action.type}`} key={index}
          onClick={() => action.action (rowData.id, rowData)} disabled={disable}
          style={{ color }} title={action.tooltip} >
        <i className="material-icons">{ actionMap[action.type].icon }</i>
      </button>
    );
  }

  displayMap (value, link, id) {
    if (typeof(value) === 'boolean') {
      return value ? activeIcon : inactiveIcon;
    } else {
      if (link)
        return <Link to={`${link}${value}`} id={`${id}-link`} style={{textDecoration: 'underline'}}>{value}</Link>;
      else
        return value;
    }
  }

  renderRow (id, index, cols, actions, rowData) {
    return (
      <tr id={`${id}-${index}`} key={index} style={{height: 40}} >
        { cols.map (col =>
          <td className={col.className} key={col.field}  id={`${id}-${col.field}`} style={{height: 40, padding: 0}}>
            <div style={{...oldStyles.tableCell}} title={rowData[col.field] ? rowData[col.field].toString() : ''}>
              {this.displayMap (rowData[col.field], col.link, `${id}-${col.field}`)}
            </div>
          </td> )
        }

        { actions &&
          <td className={`mdl-data-table__cell--non-numeric ${css(styles.buttonCell)}`} >
            { actions.map ((action, index) => this.renderButton ( id, index, action, rowData) ) }
          </td>
        }
      </tr>
    );
  }

  computeColClass (col, totalWidth, totalNonOptionalWidth) {
    const style = StyleSheet.create ({
      col: {
        width: (100 * col.width / totalWidth) + '%',
        '@media (max-width: 992px)': {
          width: (100 * col.width / totalNonOptionalWidth) + '%',
        }
      }
    });

    const className = `mdl-data-table__cell--non-numeric ${css(style.col)}`;
    if (col.optional)
      return `${className} ${css(styles.optionalCol)}`;
    else
      return className;
  }

  render () {
    const props = this.props;
    const totalWidth = props.cols.reduce ((acc, cv) => acc + cv.width, 0);
    const totalNonOptionalWidth = props.cols.filter(c => !c.optional).reduce ((acc, cv) => acc + cv.width, 0);

    // Calculate width of button td
    const actionColWidth = props.actions ? 32 * props.actions.length + 20 : 0;
    const style = StyleSheet.create ({
      buttonCell: { width: actionColWidth }
    });

    // Compute classes for content td
    props.cols.forEach (col => col.className = this.computeColClass (col, totalWidth, totalNonOptionalWidth));

    return (
      <div style={{paddingBottom: 10}} >
        <form onSubmit={this.onSearch.bind(this)} >
          <div style={oldStyles.searchContainer} >
            <button className='mdl-button mdl-js-button mdl-button--icon' id={`${props.id}-search-btn`} type='submit' style={{zIndex: 1}}>
              <i className='material-icons'>search</i>
            </button>
            <div className='mdl-textfield mdl-js-textfield mdl-textfield--floating-label rem-mdl-textfield' style={oldStyles.searchInput}>
              <input className='mdl-textfield__input' placeholder='Search...' id={`${props.id}-search`} style={{fontSize: 13}}
                  onChange={(event) => this.setState ({searchTerm: event.target.value})} value={this.state.searchTerm} />
              <label className='mdl-textfield__label' ></label>
            </div>
          </div>
        </form>

        <div>
          <table id={`${props.id}-head`} className="mdl-data-table mdl-js-data-table mdl-shadow--2dp" style={oldStyles.table}>
            <colgroup>
              { props.cols.map((col, index) => <col key={index} className={col.className} />)}
              { props.actions && <col className={`${css(style.buttonCell)}`} /> }
            </colgroup>
            <thead id={`${props.id}-head`}>
              <tr>
                {props.cols && props.cols.map (col => <th key={col.field} className={`${col.className} ${css(styles.headerCell)}`} >{col.label}</th>)}
                <th className="mdl-data-table__cell--non-numeric" style={oldStyles.buttonCell}></th>
              </tr>
            </thead>
            <tbody id={`${props.id}-body`}>
              { this.state.filteredData.map((rowData, index) => this.renderRow (props.id, index, props.cols, props.actions, rowData)) }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Table;
