import React, { useState } from 'react';
import './ButtonToggle.css';

const ButtonToggle = ({ toggledOn, onToggle, labelOn = 'ON', labelOff = 'OFF'}) => {

  return (
    <div className='container' id='button-toggle-div'>
      <div className='row' id='background-row' onClick={onToggle}>
        <div className='col' id='off-col' style={{color: toggledOn ? "#4D4D4D" : "#FFFFFF"}}>
          {labelOff}
        </div>
        <div className='col' id='on-col' style={{color: toggledOn ? "#FFFFFF" : "#4D4D4D"}}>
          {labelOn}
        </div>
        <div 
          className='highlight' 
          style={{
            left: toggledOn ? 'calc(50% + 0.5rem)' : '0%',
            width: toggledOn ? 'calc(50% - 0.5rem)' : 'calc(50% + 0.5rem)',
          }}
        />
      </div>
    </div>
  );
};

export default ButtonToggle;
