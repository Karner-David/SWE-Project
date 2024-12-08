import React from 'react';
import './ButtonRounded.css'; 

const ButtonRounded = (
  { onClick, buttonHeight,
    text, textSize, textWeight, 
    showBorder, borderColor, borderRadius, paddingHorizontal,
    startIcon, startIconSize, startIconGap, 
    endIcon, endIconSize, endIconGap,
    backgroundColor, accentColor}) => {

  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: `0 ${paddingHorizontal} 0 ${paddingHorizontal}`,
    height: buttonHeight ? buttonHeight : '3rem',
    fontSize: textSize,
    fontFamily: 'Anuphan',
    fontWeight: textWeight ? textWeight : 700,
    backgroundColor: backgroundColor ? backgroundColor : '#27D99D',
    color: accentColor ? accentColor : '#FFFFFF',
    borderRadius: borderRadius,
    borderColor: borderColor ? borderColor : 'transparent',
    borderStyle: 'solid',
    borderWidth: showBorder ? '0.125rem' : '0',
    lineHeight: -1,
    transition: 'background-color 0.5s ease, color 0.5s ease',
  };

  const startIconStyle = {
    fontSize: startIconSize,
    margin: `0 ${startIconGap ? startIconGap : '0'} 0 0`,
  };

  const endIconStyle = {
    fontSize: endIconSize,
    margin: `0 0 0 ${endIconGap ? endIconGap : '0'}`,
  };

  return (
    <button id='button'
      onClick={onClick}
      style={buttonStyle}
    >
      {startIcon && React.createElement(startIcon, { style: startIconStyle })}
      {text}
      {endIcon && React.createElement(endIcon, { style: endIconStyle })}
    </button>
  );
};

export default ButtonRounded;