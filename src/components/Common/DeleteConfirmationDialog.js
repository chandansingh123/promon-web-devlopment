import React from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const styles = {
  container: {
    width: 500,
    boxShadow: '0 20px 75px rgba(0, 0, 0, 0.23)',
  },
  header: {
    marginTop: 0,
    background: 'red',
    padding: '10px 20px',
    lineHeight: 1.2,
    color: 'white',
    fontSize: '30px'
  },
  icon: {
    fontSize: '20px',
    paddingRight: 12
  },
  content: {
    padding: '0 30px'
  },
  buttonContainer: {
    borderTop: '1px solid rgba(0,0,0,0.2)',
    margin: '20px 0',
    textAlign: 'center'
  },
  button: {
    width: 160,
    padding: 10,
    border: '1px solid #fff',
    margin: 10,
    cursor: 'pointer',
    background: '#3f51b5',
    color: '#fff',
    fontSize: '14px'
  }
};


const DeleteConfirmationDialog = ({ type, name, onDelete, text }) => {
  const body = text ?
    {__html: text} :
    {__html:  `Are you sure you want to delete the ${type} - "${name}" <br />The ${type} will be permanently removed from the system.`};

  confirmAlert({
    customUI: ({ onClose }) => {
      return (
        <div style={styles.container}>
          <h3 style={styles.header}>
            <i className="material-icons" style={styles.icon}>warning</i>
            Please Confirm
          </h3>
          <div style={styles.content} dangerouslySetInnerHTML={body} />
          <div style={styles.buttonContainer}>
            <button style={styles.button} onClick={onClose}>No</button>
            <button style={styles.button} onClick={() => {
                onDelete();
                onClose();
            }}>Yes, Delete it!</button>
          </div>
        </div>
      )
    }
  })
};

export default DeleteConfirmationDialog;
