
import React from 'react';

import RenderInRoot from './RenderInRoot';

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


const Dialog = (props) => {
  const id = props.id;
  const containerStyle = { ...styles.container, display: props.show ? 'block' : 'none' };
  const contentStyle = { ...styles.content, ...props.style };

  return (
    <RenderInRoot>
      <div id={id} style={containerStyle} >
        <div style={contentStyle}>
          <div>
            {props.children}
          </div>
        </div>
      </div>
    </RenderInRoot>
  )
};

export default Dialog;
