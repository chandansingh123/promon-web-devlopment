
import React from 'react';
import ReactDOM from 'react-dom';

const rootDiv =  document.getElementById('app');

class RenderInRoot extends React.Component {

  constructor (props) {
    super (props);
    this.el = document.createElement ('div');
  }

  componentDidMount () {
    rootDiv.appendChild (this.el);
  }

  componentWillUnmount () {
    rootDiv.removeChild (this.el);
  }

  render () {
    return ReactDOM.createPortal (this.props.children, this.el);
  }
}

export default RenderInRoot;
