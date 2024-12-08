import './LogInPage.css';
import React, { useState, useEffect } from 'react';
import FieldText from '../../components/FieldText/FieldText';
import ButtonRounded from '../../components/ButtonRounded/ButtonRounded';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LogInPage() {
  const [startAnimations, setStartAnimations] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState('');

  const onUsernameTextChange = (new_username) => {
    setUsername(new_username)
    console.log('Username:', new_username);
  };

  const onPasswordTextChange = (password) => {
    setUserPassword(password)
    console.log('Password:', password);
  };

  const navigate = useNavigate();
  const onLogIn = async () => {
    const requestBody = {
      username: username,
      password: userPassword,
    };

    console.log("onLogIn called")

    try {
      const response = await axios.post('http://127.0.0.1:5000/auth/log-in', requestBody);
      console.log(response.data.message);
      console.log(response.data.token);
      localStorage.setItem('token', response.data.token);
      navigate('/search');
    } catch (error) {
      if (error.response) {
        console.log(`Error: ${error.response.data.message}`);
        setLoginStatus(error.response.data.message);
      } else {
        console.log('Network error. Please try again.');
      }
    }
  }

  useEffect(() => {
    setStartAnimations(true);
  }, []);

  return (
    <div className='container-fluid d-flex justify-content-center'>

      <img
        src={require('../../images/log-in-sign-up-background.jpg')}
        alt='A big rack of magazines'
        id='log-in-sign-up-background-img'
      />

      <div className='row h-100' id='main-row'>
        
        <div 
          id='left-mask'
          style={{
            transform: isSignUp ? 'translateX(-100%)' : (startAnimations ? 'translateX(0%)' : 'translateX(-100%)'),
          }}
        />

        <div 
          className='col-7'
          id='log-in-section-col'
          style={{
            transform: isSignUp ? 'translateX(-100vw)' : (startAnimations ? 'translateX(0%)' : 'translateX(-100vw)'),
          }}
          >
          <div className='row h-100 d-flex justify-content-center align-items-center'>
            <div className='col' id='log-in-content-col'>
              
              <div className='row w-100 d-flex justify-content-start'>
                <div className='col' id='log-in-text-col'>
                  Log In
                </div>
              </div>

              <div className='row'>
                <div className='col' id='username-field-text-col'>
                  <FieldText 
                    labelText={"Username"}
                    onTextChange={onUsernameTextChange}
                    isPassword={false}
                    defaultText={'Enter your username'}
                  />
                </div>
              </div>

              <div className='row'>
                <div className='col' id='password-field-text-col'>
                  <FieldText 
                    labelText={"Password"}
                    onTextChange={onPasswordTextChange}
                    isPassword={true}
                    defaultText={'Enter your password'}
                  />
                </div>
              </div>

              <div className='row'>
                {loginStatus && (
                  <div className='col' id='input-err-col'>
                    <p>{loginStatus}. Please try again.</p>
                  </div>
                )}

                <div className='col' id='forgot-password-col'>
                  <div onClick={() => {}}>
                    Forgot Password?
                  </div>
                </div>
              </div>

              <div className='row'>
                <div className='col' id='log-in-button-col'>
                  <ButtonRounded
                    onClick={() => {onLogIn()}}
                    text={'Log In'}
                    textSize={'1.5rem'}
                    borderRadius={'0.5rem'}
                  />
                </div> 
              </div> 
              
              <div className='row' id='separator-row'>
                <div className='col separator-line'/>
                <div className='col-auto' id='separator-text-col'>
                  OR
                </div>
                <div className='col separator-line'/>
              </div>

              <div className='row'>
                <div className='col' id='third-party-col'>
                  <ButtonRounded
                    onClick={() => {}}
                    text={'Continue with Third Party'}
                    textSize={'1rem'}
                    textWeight={'500'}
                    showBorder={true}
                    borderColor={'#D9D9D9'}
                    borderRadius={'0.5rem'}
                    backgroundColor={'#FFFFFF'}
                    accentColor={'#4D4D4D'}
                  />
                </div>
              </div>


            </div>
          </div>
        </div>

        <div 
          className='col-5' 
          id='sign-up-section-col'
          style={{
            opacity: isSignUp ? '0' : (startAnimations ? '1' : '0'),
          }}
          >
          <div className='row h-100 d-flex justify-content-center align-items-center'>
            <div className='col' id='sign-up-content-col'>
              
              <div className='row'>
                <div className='col' id='sign-up-text-col'>
                  New here?
                </div>
              </div>

              <div className='row'>
                <div className='col' id='description-text-col'>
                Subscribe today to get the latest magazines and newspapers with
                free delivery straight to your door!
                </div>
              </div>

              <div className='row'>
                <div className='col' id='sign-up-button-col'>
                  <ButtonRounded
                    onClick={() => {
                      setIsSignUp(true);
                      setTimeout(() => {
                        navigate('/signup');
                      }, 1000);
                    }}
                    text={'Sign Up'}
                    textSize={'1.5rem'}
                    borderRadius={'0.5rem'}
                    fillWidth={true}
                  />
                </div> 
              </div> 

            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default LogInPage;