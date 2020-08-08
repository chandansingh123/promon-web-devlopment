
import React from 'react';
import dialogPolyfill from 'dialog-polyfill';
import { StyleSheet, css } from 'aphrodite';

const styles = StyleSheet.create ({
  container: {
    minWidth: 400,
    minHeight: 200,
    padding: 0
  },
  title: {
    padding: 10,
    textAlign: 'center',
    background: 'red',
    color: 'whitesmoke',
    fontSize: 26
  }
});

class DeleteConfirmation extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      id: props.id
    }
    this.dialog = null;    
  }

  componentDidMount () {
    this.dialog = document.getElementById (this.state.id);
    document.getElementsByTagName ('BODY')[0].appendChild (this.dialog);
    dialogPolyfill.registerDialog (this.dialog);
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.deleting)
      this.dialog.showModal ();
    else {
      if (this.dialog.open)
        this.dialog.close ();
    }
  }

  componentWillUnmount () {
    this.dialog.parentNode.removeChild (this.dialog);
  }

  render () {
    const { id, module } = this.props;

    return (
      <dialog className={`mdl-dialog ${css(styles.container)}`} id={id} >
        <div className={`mdl-dialog__title ${css(styles.title)}`}>Confirm</div>
        <div className="mdl-dialog__content">
          <p>{`Are you certain that you want to delete this ${module}?`}</p>
          <p>You can not undo this action.</p>
        </div>
        <div className="mdl-dialog__actions">
          <button type="button" className="mdl-button" id={`${id}-yes`} onClick={this.props.submit} >Yes</button>
          <button type="button" className="mdl-button close" id={`${id}-no`} onClick={this.props.cancel}>No</button>
        </div>
      </dialog>
    );
  }
}

export default DeleteConfirmation;
