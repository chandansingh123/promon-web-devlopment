
import  React from 'react';

import ColoredButton from './ColoredButton';

class HeaderWithAddButton extends React.Component {

  shouldComponentUpdate () {
    return false;
  }

  render () {
    const props = this.props;

    return (
      <div id={props.id} >

        <ColoredButton id={`${props.id}-btn`} disabled={props.disabled} icon='add' label='Add' style={{float: 'right'}}
          onClick={props.handleAddClick} />
    
        <h4 id={`${props.id}-txt`} >{props.headerText}</h4>
      </div>
    )
  }
} 

export default HeaderWithAddButton;
