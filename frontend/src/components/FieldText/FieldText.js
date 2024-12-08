import './FieldText.css';
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const FieldText = ({labelText, defaultText, onTextChange, isPassword, isNumber, numMax, errorMessage}) => {

  const [text, setText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (event) => {
    var newValue = event.target.value
    if (isNumber) { newValue = Math.min(numMax, parseFloat(newValue))}
    if (newValue < 0) {
      newValue = 0;
    }
    setText(newValue);
    onTextChange(newValue);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  }

  const borderStyle = {
    borderWidth: isFocused ? "0.125rem" : "0.125rem",
    borderColor: isFocused ? "#11A36F" : "#D9D9D9"
  };

  return (
    <div className='row'>
      <div className='col'>

        <div className='row'>
          <div className='col'>
            <p id='label-text'>
              {labelText}
            </p>
          </div>
        </div>

        <div className='row' id='text-input-row'>
          <div className='col'>
            <input
              id="text-input"
              type={isNumber ? "number" : (isPassword && !isVisible && text !== '') ? "password" : "text"}
              value={text}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={defaultText ? defaultText : ''}
            />
          </div>
          <div className='col-auto' id='visibility-button-col' style={borderStyle}> 
            {isPassword && (
              <div>
                {isVisible
                ? 
                <FaEyeSlash style={{fontSize: "1.5rem"}} onClick={toggleVisibility}/>
                : 
                <FaEye style={{fontSize: "1.5rem"}} onClick={toggleVisibility}/>}
              </div>
            )}
          </div>
        </div>
        
        {/* Error Message */}
        <div className='row'>
          <div className='col'>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>
        </div>

      </div>
    </div>
  );
};

export default FieldText;

