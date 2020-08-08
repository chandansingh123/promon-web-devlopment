import React from 'react';

const ConfirmationPopUp = function(props){
  return(
    <dialog className="mdl-dialog pm-dialog-confirmation_popup" id={props.id}>
        <div className="mdl-dialog__title pm-dialog-confirmation_popup_title">{props.title}</div>
        <div className="mdl-dialog__content"><p>{props.message}</p><p>{props.subMessage}</p></div>
        <div className="mdl-dialog__actions">
            <button type="button" className="mdl-button" id="success">{props.successButtonText}</button>
            <button type="button" className="mdl-button close" id="cancel">{props.cancelButtonText}</button>
        </div>
    </dialog>
  )
}

export default ConfirmationPopUp;
