import './SignUpPage.css';
import React, { useState, useEffect } from 'react';
import FieldText from '../../components/FieldText/FieldText';
import ButtonRounded from '../../components/ButtonRounded/ButtonRounded';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignUpPage() {

  const [currentSection, setCurrentSection] = useState(0);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());
  const [pageLoaded, setPageLoaded] = useState(false);

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    const errorMessages = {};

    // Account Information Validation
    if (name === "accountFirstName" && !value.trim()) {
      errorMessages[name] = "First name is required.";
    } else if (name === "accountLastName" && !value.trim()) {
      errorMessages[name] = "Last name is required.";
    } else if (name === "accountEmail" && !/\S+@\S+\.\S+/.test(value)) {
      errorMessages[name] = "A valid email address is required.";
    } else if (name === "accountUsername" && !value.trim()) {
      errorMessages[name] = "Username is required.";
    } else if (name === "accountPassword" && !value.trim()) {
      errorMessages[name] = "Password is required.";

      // Mailing Address Validation
    } else if (name === "mailingFullName" && !value.trim()) {
      errorMessages[name] = "Full name is required.";
    } else if (name === "mailingAddress1" && !value.trim()) {
      errorMessages[name] = "Address Line 1 is required.";
    } else if (name === "mailingCity" && !value.trim()) {
      errorMessages[name] = "City is required.";
    } else if (name === "mailingState" && !value.trim() && value.length < 3) {
      errorMessages[name] = "State Abbreviation is required (e.g. TX).";
    } else if (name === "mailingZipCode" && !/^\d{5}$/.test(value)) {
      errorMessages[name] = "Zip code must be exactly 5 digits.";
    } else if (name === "mailingCountry" && !value.trim()) {
      errorMessages[name] = "Country is required.";
    } else if ((name === "mailingPhone1" || name === "mailingPhone2") && !/^\d{3}$/.test(value)) {
      errorMessages[name] = "This phone number segment must be 3 digits.";
    } else if (name === "mailingPhone3" && !/^\d{4}$/.test(value)) {
      errorMessages[name] = "This phone number segment must be 4 digits.";
    }

    // Payment Information Validation
    else if (name === "paymentFullName" && !value.trim()) {
      errorMessages[name] = "Name on card is required.";
    } else if (name === "paymentCard1" && !/^\d{4}$/.test(value)) {
      errorMessages[name] = "This card number segment must be 4 digits.";
    } else if (name === "paymentCard2" && !/^\d{4}$/.test(value)) {
      errorMessages[name] = "This card number segment must be 4 digits.";
    } else if (name === "paymentCard3" && !/^\d{4}$/.test(value)) {
      errorMessages[name] = "This card number segment must be 4 digits.";
    } else if (name === "paymentCard4" && !/^\d{4}$/.test(value)) {
      errorMessages[name] = "This card number segment must be 4 digits.";
    } else if (name === "paymentExpiryMonth" && !/^\d{2}$/.test(value)) {
      errorMessages[name] = "Expiry month must be exactly 2 digits.";
    } else if (name === "paymentExpiryYear" && !/^\d{2}$/.test(value)) {
      errorMessages[name] = "Expiry year must be exactly 2 digits.";
    } else if (name === "paymentSecurityCode" && !/^\d{3}$/.test(value)) {
      errorMessages[name] = "Security code must be exactly 3 digits.";
    } else if (name === "paymentZipCode" && !/^\d{5}$/.test(value)) {
      errorMessages[name] = "Zip code must be exactly 5 digits.";
    }


    return errorMessages;
  };

  const [formData, setFormData] = useState({
    accountFirstName: '',
    accountMiddleInitial: '',
    accountLastName: '',
    accountEmail: '',
    accountUsername: '',
    accountPassword: '',
    mailingFullName: '',
    mailingAddress1: '',
    mailingAddress2: '',
    mailingCity: '',
    mailingState: '',
    mailingZipCode: '',
    mailingCountry: '',
    mailingPhone1: '',
    mailingPhone2: '',
    mailingPhone3: '',
    paymentFullName: '',
    paymentCard1: '',
    paymentCard2: '',
    paymentCard3: '',
    paymentCard4: '',
    paymentExpiryMonth: '',
    paymentExpiryYear: '',
    paymentSecurityCode: '',
    paymentZipCode: ''
  });

  useEffect(() => {
    const handleWheel = (event) => {
      const currentTime = Date.now();
      
      if (currentTime - lastUpdateTime >= 500) {
        setCurrentSection((prevSection) => {
          let newSection = prevSection;
          if (event.deltaY > 0) {
            newSection = Math.min(3, prevSection + 1);
          } else if (event.deltaY < 0) {
            newSection = Math.max(0, prevSection - 1);
          }
          return newSection;
        });

        setLastUpdateTime(currentTime);
      }
    };

    window.addEventListener('wheel', handleWheel);
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [lastUpdateTime]);

  useEffect(() => {
    console.log(currentSection);
  }, [currentSection]);

  useEffect(() => {
    setTimeout(() => {
      setPageLoaded(true);
    }, 0);
  });

  const handleInputChange = (name, value) => {
    console.log(`${name}: ${value}`)
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    const fieldError = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      ...fieldError,
    }));

    if (!Object.keys(fieldError).length) {
      setErrors((prevErrors) => {
        const { [name]: _, ...rest } = prevErrors;
        return rest;
      });
    }
  };

  const navigate = useNavigate();
  const handleSignUp = async (e) => {

    const requiredFields = [
      'accountFirstName',
      'accountLastName',
      'accountEmail',
      'accountUsername',
      'accountPassword',
      'mailingFullName',
      'mailingAddress1',
      'mailingCity',
      'mailingState',
      'mailingZipCode',
      'mailingCountry',
      'mailingPhone1',
      'mailingPhone2',
      'mailingPhone3',
      'paymentFullName',
      'paymentCard1',
      'paymentCard2',
      'paymentCard3',
      'paymentCard4',
      'paymentExpiryMonth',
      'paymentExpiryYear',
      'paymentSecurityCode',
      'paymentZipCode'
    ];

    const emptyFields = requiredFields.filter(field => !formData[field]?.trim());

    if (Object.keys(errors).length > 0) {
      alert("Please fill in all required fields.");
      return;
    }
    
    const formattedMailingAddress = [
      formData.mailingFullName,
      formData.mailingAddress1,
      formData.mailingAddress2,
      `${formData.mailingCity}, ${formData.mailingState} ${formData.mailingZipCode}`,
      formData.mailingCountry,
      `(${formData.mailingPhone1}) ${formData.mailingPhone2}-${formData.mailingPhone3}`,
    ]
      .join('\n');

      const formattedCreditCard = [
        formData.paymentFullName,
        `${formData.paymentCard1}-${formData.paymentCard2}-${formData.paymentCard3}-${formData.paymentCard4}`,
        `${formData.paymentExpiryMonth}/${formData.paymentExpiryYear}`,
        `${formData.paymentSecurityCode}`,
        `${formData.paymentZipCode}`
      ]
        .join('\n');
    
    const requestBody = {
      first_name: formData.accountFirstName,
      middle_initial: formData.accountMiddleInitial,
      surname: formData.accountLastName,
      address: formattedMailingAddress,
      email: formData.accountEmail,
      username: formData.accountUsername,
      password: formData.accountPassword,
      default_credit_card: formattedCreditCard,
    };

    console.log(requestBody)


    try {
      const response = await axios.post('http://127.0.0.1:5000/auth/sign-up', requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(response.data.message);
      localStorage.setItem('token', response.data.token);
      navigate('/search')
    } catch (error) {
      if (error.response) {
        console.log(`Error: ${error.response.data.message}`);
      } else {
        console.log('Network error. Please try again.');
      }
    }
  };
  
  return(
    <div className='container-fluid' style={{
      overflow: 'hidden'
    }}>
      <img
        src={require('../../images/log-in-sign-up-background.jpg')}
        alt='A big rack of magazines'
        id='log-in-sign-up-background-img'
      />

      <div className='row d-flex justify-content-center sign-up-row' style={{
        transform: currentSection === 0 ? 'translate(-50%, -50%)' : 
                    currentSection > 0 ? 'translate(-50%, -25vh)' : 
                    'translate(-50%, 25vh)',
        opacity: pageLoaded ? (currentSection === 0 ? 1 : 0) : 0
      }}>
        <div className='col-auto sign-up-col' id='user-info-col'>

          <div className='row'>
            <div className='col' style={{fontSize: '2rem'}}>
              Account Information
            </div>
          </div>

          <div className='row mt-2'>
            <div className='col-5 p-0'>
              <FieldText
                labelText={'First Name'}
                onTextChange={(text) => handleInputChange('accountFirstName', text)}
                errorMessage={errors.accountFirstName}
              />
            </div>
            <div className='col-2 px-3'>
              <FieldText
                labelText={'Middle Initial'}
                onTextChange={(text) => handleInputChange('accountMiddleInitial', text)}
              />
            </div>
            <div className='col-5 p-0'>
              <FieldText
                labelText={'Last Name'}
                onTextChange={(text) => handleInputChange('accountLastName', text)}
                errorMessage={errors.accountLastName}
              />
            </div>
          </div>

          <div className='row mt-2'>
            <div className='col'>
              <FieldText
                labelText={'Email'}
                onTextChange={(text) => handleInputChange('accountEmail', text)}
                errorMessage={errors.accountEmail}
              />
            </div>
          </div>

          <div className='row mt-2'>
            <div className='col'>
              <FieldText
                labelText={'Username'}
                onTextChange={(text) => handleInputChange('accountUsername', text)}
                errorMessage={errors.accountUsername}
              />
            </div>
          </div>

          <div className='row mt-2'>
            <div className='col'>
              <FieldText
                labelText={'Password'}
                onTextChange={(text) => handleInputChange('accountPassword', text)}
                errorMessage={errors.accountPassword}
                isPassword={true}
              />
            </div>
          </div>
        </div>
      </div>

      <div className='row d-flex justify-content-center sign-up-row' style={{
        transform: currentSection === 1 ? 'translate(-50%, -50%)' : 
                    currentSection > 1 ? 'translate(-50%, -25vh)' : 
                    'translate(-50%, 25vh)',
        opacity: pageLoaded ? (currentSection === 1 ? 1 : 0) : 0
      }}>
        <div className='col-auto sign-up-col' id='mailing-address-col'>
          
          <div className='row'>
            <div className='col' style={{fontSize: '2rem'}}>
              Mailing Address
            </div>
          </div>

          <div className='row mt-2'>
            <div className='col'>
              <FieldText
                labelText={'Full Name'}
                onTextChange={(text) => handleInputChange('mailingFullName', text)}
                errorMessage={errors.mailingFullName}
              />
            </div>
          </div>

          <div className='row mt-2'>
            <div className='col'>
              <FieldText
                labelText={'Address Line 1'}
                onTextChange={(text) => handleInputChange('mailingAddress1', text)}
                errorMessage={errors.mailingAddress1}
              />
            </div>
          </div>

          <div className='row mt-2'>
            <div className='col'>
              <FieldText
                labelText={'Address Line 2'}
                onTextChange={(text) => handleInputChange('mailingAddress2', text)}
              />
            </div>
          </div>

          <div className='row mt-2'>
            <div className='col' style={{paddingRight:'1rem'}}>
              <FieldText
                labelText={'City'}
                onTextChange={(text) => handleInputChange('mailingCity', text)}
                errorMessage={errors.mailingCity}
              />
            </div>
            <div className='col'>
              <FieldText
                labelText={'State/Province/Region'}
                onTextChange={(text) => handleInputChange('mailingState', text)}
                errorMessage={errors.mailingState}
              />
            </div>
          </div>

          <div className='row mt-2'>
            <div className='col' style={{paddingRight:'1rem'}}>
              <FieldText
                labelText={'Zip Code'}
                onTextChange={(text) => handleInputChange('mailingZipCode', text)}
                errorMessage={errors.mailingZipCode}
              />
            </div>
            <div className='col'>
              <FieldText
                labelText={'Country'}
                onTextChange={(text) => handleInputChange('mailingCountry', text)}
                errorMessage={errors.mailingCountry}
              />
            </div>
          </div>

          <div className='row mt-2'>
            <div className='col p-0'>
              <FieldText
                labelText={'Phone Number'}
                onTextChange={(text) => handleInputChange('mailingPhone1', text)}
                errorMessage={errors.mailingPhone1}
              />
            </div>
            <div className='col px-3'>
              <FieldText
                labelText={'\u200B'}
                onTextChange={(text) => handleInputChange('mailingPhone2', text)}
                errorMessage={errors.mailingPhone2}
              />
            </div>
            <div className='col p-0'>
              <FieldText
                labelText={'\u200B'}
                onTextChange={(text) => handleInputChange('mailingPhone3', text)}
                errorMessage={errors.mailingPhone3}
              />
            </div>
          </div>

        </div>
      </div>

      <div className='row d-flex justify-content-center sign-up-row' style={{
        transform: currentSection === 2 ? 'translate(-50%, -50%)' : 
                    currentSection > 2 ? 'translate(-50%, -25vh)' : 
                    'translate(-50%, 25vh)',
        opacity: pageLoaded ? (currentSection === 2 ? 1 : 0) : 0
      }}>
        <div className='col-auto sign-up-col' id='payment-info-col'>

          <div className='row'>
            <div className='col' style={{fontSize: '2rem'}}>
              Payment Information
            </div>
          </div>

          <div className='row mt-2'>
            <div className='col'>
              <FieldText
                labelText={'Name On Card'}
                onTextChange={(text) => handleInputChange('paymentFullName', text)}

              />
            </div>
          </div>

          <div className='row mt-2'>
            <div className='col' style={{
              paddingLeft: '0rem',
              paddingRight:'1rem'
              }}>
              <FieldText
                labelText={'Card Number'}
                onTextChange={(text) => handleInputChange('paymentCard1', text)}
                errorMessage={errors.paymentCard1}
              />
            </div>
            <div className='col p-0'>
              <FieldText
                labelText={'\u200B'}
                onTextChange={(text) => handleInputChange('paymentCard2', text)}
                errorMessage={errors.paymentCard2}
              />
            </div>
            <div className='col px-3'>
              <FieldText
                labelText={'\u200B'}
                onTextChange={(text) => handleInputChange('paymentCard3', text)}
                errorMessage={errors.paymentCard3}
              />
            </div>
            <div className='col p-0'>
              <FieldText
                labelText={'\u200B'}
                onTextChange={(text) => handleInputChange('paymentCard4', text)}
                errorMessage={errors.paymentCard4}
              />
            </div>
          </div>

          <div className='row mt-2'>
            <div className='col-2' style={{
              paddingLeft: '0rem',
              paddingRight:'1rem'
              }}>
              <FieldText
                labelText={'Expiry Month'}
                onTextChange={(text) => handleInputChange('paymentExpiryMonth', text)}
                errorMessage={errors.paymentExpiryMonth}
              />
            </div>
            <div className='col-2 p-0'>
              <FieldText
                labelText={'Expiry Year'}
                onTextChange={(text) => handleInputChange('paymentExpiryYear', text)}
                errorMessage={errors.paymentExpiryYear}
              />
            </div>
            <div className='col-4 px-3'>
              <FieldText
                labelText={'Security Code'}
                onTextChange={(text) => handleInputChange('paymentSecurityCode', text)}
                errorMessage={errors.paymentSecurityCode}
              />
            </div>
            <div className='col-4 p-0'>
              <FieldText
                labelText={'Zip Code'}
                onTextChange={(text) => handleInputChange('paymentZipCode', text)}
                errorMessage={errors.paymentZipCode}
              />
            </div>
          </div>



        </div>
      </div>

      <div className='row d-flex justify-content-center sign-up-row' style={{
        transform: currentSection === 3 ? 'translate(-50%, -50%)' : 
                    currentSection > 3 ? 'translate(-50%, -25vh)' : 
                    'translate(-50%, 25vh)',
        opacity: pageLoaded ? (currentSection === 3 ? 1 : 0) : 0
      }}>
        <div className='col-auto sign-up-col' id='sign-up-button-col' style={{
          backgroundColor: 'transparent',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <ButtonRounded
            onClick={() => {handleSignUp()}}
            buttonHeight={'5rem'}
            text={'Sign Up!'}
            textSize={'2rem'}
            borderRadius={'1rem'}
          />
        </div>
      </div>
      
      


    </div>
  );
}

export default SignUpPage;