
import React from 'react';

import RenderInRoot from './RenderInRoot';
import ColoredButton from './ColoredButton';
import CancelButton from './CancelButton';

const styles = {
  container: {
    display: 'none',
    position: 'fixed',
    zIndex: 100,
    left: 0,
    top: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
  content: {
    backgroundColor: '#fefefe',
    border: '1px solid #888',
    maxWidth: '100vw',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 600,
    transform: 'translateX(-50%) translateY(-50%)'
  }
};

class DialogForm extends React.Component {
  constructor (props) {
    super (props);
    this.displayErrors = this.displayErrors.bind (this);
  }

  validateForm () {
    let isValid = true;
    const frm = document.getElementById (`${this.props.id}-form`);
    const inputElements = frm.getElementsByClassName('mdl-textfield');
    for (let i = 0; i < inputElements.length; i++) {
      const flag = inputElements[i].MaterialTextfield && inputElements[i].MaterialTextfield.checkValidity (true);
      isValid = isValid && flag;
    }
    return isValid;
  }

  componentDidUpdate () {
    if (this.props.errors)
      this.displayErrors (this.props.errors);
  }

  displayErrors (errors) {
    const keys = Object.keys (errors);
    keys.forEach (key => {
      if (!errors[key])
        return;
      const el = document.getElementById (`${this.props.id}-${key}`);
      if (el && el.parentElement)
        el.parentElement.classList.add ('is-invalid');
    });
  }

  onCancel () {
    // Reset errors
    const frm = document.getElementById (`${this.props.id}-form`);
    const inputElements = frm.getElementsByClassName('mdl-textfield');
    for (let i = 0; i < inputElements.length; i++) {
      inputElements[i].MaterialTextfield && inputElements[i].classList.remove ('is-invalid');
    }

    this.props.onCancel ();
  }

  submitForm () {
    if (this.validateForm ())
      this.props.mode === 'add' ? this.props.onAdd () : this.props.onUpdate ();
  }

  renderForm () {
    const buttonLabel = this.props.mode === 'add' ? 'Add' : 'Update';

    return (
      <div className="mdl-card mdl-shadow--2dp" style={{width: '100%', height: '100%'}}>
        <div className="mdl-card__title mdl-card--expand">
          <h2 className="mdl-card__title-text">{this.props.title}</h2>
        </div>

        <div className="mdl-card__supporting-text mdl-card--border" style={{width: '100%'}}>
          <form id={`${this.props.id}-form`}>
            {this.props.children}
          </form>
        </div>

        <div className="mdl-dialog__actions">
          <ColoredButton id='rem-tnt-frm-save' onClick={this.submitForm.bind(this)} label={buttonLabel}/>
          <CancelButton id='rem-tnt-frm-cancel' onClick={this.onCancel.bind(this)}/>
        </div>

      </div>
    );
  }

  render() {
    const { id } = this.props;
    const containerStyle = { ...styles.container, display: this.props.show ? 'block' : 'none' };
    const contentStyle = { ...styles.content, ...this.props.style };

    return (
      <RenderInRoot>
        <div id={id} style={containerStyle} >
          <div style={contentStyle}>
            {this.renderForm()}
          </div>
        </div>
      </RenderInRoot>
    )
  }
}

export default DialogForm;
