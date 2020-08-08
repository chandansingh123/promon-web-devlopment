import React from 'react'

const styles = {
  obfuscator: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    pointerEvents: 'auto',
    position: 'absolute', top: 0, left: 0,
    height: '100%', width: '100%',
    zIndex: 4,
  }
};

const SurveyNote = ({ name, note, setNoteDisplay }) => (
  <React.Fragment>
    <div style={styles.obfuscator} onClick={_ => {console.log('......888..'); setNoteDisplay(false)}} />

    <div style={{zIndex: 10, position: 'absolute', width: '100vw', height: '100vh', justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
      <div style={{ boxShadow: 'rgba(0, 0, 0, 0.23) 0px 20px 75px',  minWidth: 250, backgroundColor: 'white' }}>
        <h3 style={{background: 'rgb(40, 186, 230)', lineHeight: 1.4, color: 'white', marginTop: 0, marginBottom: 5, padding: 10, fontSize: '28px'}}>
          {name}
        </h3>
        <div style={{padding: 20}}>
          {note.split('\n').map((line, idx) =>
            <React.Fragment key={idx}>
              {line}
              <br />
            </React.Fragment>
          )}
        </div>

        <div style={{borderTop: '1px solid rgba(0, 0, 0, 0.2)', textAlign: 'center'}}>
          <button onClick={_ => setNoteDisplay(false)}
            style={{width: 100, padding: 10, border: '1px solid rgb(255, 255, 255)', margin: 10, cursor: 'pointer', background: 'rgb(63, 81, 181)',
            color: 'rgb(255, 255, 255)', fontSize: '14p'}}>
            Done
          </button>
        </div>
      </div>
    </div>
  </React.Fragment>
);

export default SurveyNote;
