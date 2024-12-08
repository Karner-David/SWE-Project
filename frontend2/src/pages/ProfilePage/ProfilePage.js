import React, { useState, useEffect } from 'react';
import './ProfilePage.css';
import FieldText from "../../components/FieldText/FieldText";
import axios from 'axios';
import ButtonRounded from '../../components/ButtonRounded/ButtonRounded';
import { useNavigate} from 'react-router-dom';

function ProfilePage () {

  const navigate = useNavigate();

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

  const formatResponseToFormData = (response) => {
    const [mailingFullName, mailingAddress1, mailingAddress2, cityStateZip, mailingCountry, mailingPhone] = response.mailing_address.split('\n');
    const [paymentFullName, paymentCard, paymentExpiry, paymentSecurityCode, paymentZipCode] = response.default_credit_card.split('\n');
    
    const [paymentCard1, paymentCard2, paymentCard3, paymentCard4] = paymentCard.split('-');
    const [paymentExpiryMonth, paymentExpiryYear] = paymentExpiry.split('/');
  
    const [mailingPhone1, mailingPhone2, mailingPhone3] = mailingPhone.match(/\d+/g) || [];
  
    setFormData({
      accountFirstName: response.first_name,
      accountMiddleInitial: response.middle_initial,
      accountLastName: response.surname,
      accountEmail: response.email_address,
      accountUsername: response.username,
      accountPassword: response.password,
      mailingFullName: mailingFullName,
      mailingAddress1: mailingAddress1,
      mailingAddress2: mailingAddress2,
      mailingCity: cityStateZip.split(',')[0].trim(),
      mailingState: cityStateZip.split(',')[1]?.trim().split(' ')[0] || '',
      mailingZipCode: cityStateZip.split(' ')[2] || '',
      mailingCountry: mailingCountry,
      mailingPhone1: mailingPhone1 || '',
      mailingPhone2: mailingPhone2 || '',
      mailingPhone3: mailingPhone3 || '',
      paymentFullName: paymentFullName,
      paymentCard1: paymentCard1,
      paymentCard2: paymentCard2,
      paymentCard3: paymentCard3,
      paymentCard4: paymentCard4,
      paymentExpiryMonth: paymentExpiryMonth,
      paymentExpiryYear: paymentExpiryYear,
      paymentSecurityCode: paymentSecurityCode,
      paymentZipCode: paymentZipCode,
    });
  };

  const getUserProfile = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/users/get-profile', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response.data);
      formatResponseToFormData(response.data);
    } catch (error) {
      console.log(error)
      if (error.response) {
        console.log(`Error: ${error.response.data.message}`);
      } else {
        console.log('Network error. Please try again.');
      }
    }
  }

  useEffect(() => {
    getUserProfile()
  }, [])

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

  const handleUpdateProfile = async () => {
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
      mailing_address: formattedMailingAddress,
      email_address: formData.accountEmail,
      username: formData.accountUsername,
      password: formData.accountPassword,
      default_credit_card: formattedCreditCard,
    };

    try {
      const response = await axios.post('http://127.0.0.1:5000/users/update-profile', requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(response.data.message);
      getUserProfile()
    } catch (error) {
      if (error.response) {
        console.log(`Error: ${error.response.data.message}`);
      } else {
        console.log('Network error. Please try again.');
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login')
  }

  return (
    <div className='container'>
      <div className='row' style={{
        marginTop: '6rem'
      }}>
        <div className='col-8 px-3' style={{
          paddingBottom: '1rem'
        }}>

          <div className='row'>
            <div className='col' style={{
              fontSize: '1.5rem',
              fontWeight: 700
            }}>
              Account Information
            </div>
          </div>

          <div className='row mt-2'>
            <div className='col-5 p-0'>
              <FieldText
                labelText={'First Name'}
                onTextChange={(text) => handleInputChange('accountFirstName', text)}
                defaultText={formData.accountFirstName}
                errorMessage={errors.accountFirstName}
              />
            </div>
            <div className='col-2 px-3'>
              <FieldText
                labelText={'Middle Initial'}
                onTextChange={(text) => handleInputChange('accountMiddleInitial', text)}
                defaultText={formData.accountMiddleInitial}
              />
            </div>
            <div className='col-5 p-0'>
              <FieldText
                labelText={'Last Name'}
                onTextChange={(text) => handleInputChange('accountLastName', text)}
                defaultText={formData.accountLastName}
                errorMessage={errors.accountLastName}
              />
            </div>
          </div>

          <div className='row mt-2'>
            <div className='col'>
              <FieldText
                labelText={'Email'}
                onTextChange={(text) => handleInputChange('accountEmail', text)}
                defaultText={formData.accountEmail}
                errorMessage={errors.accountEmail}
              />
            </div>
          </div>

          <div className='row mt-2'>
            <div className='col'>
              <FieldText
                labelText={'Username'}
                onTextChange={(text) => handleInputChange('accountUsername', text)}
                defaultText={formData.accountUsername}
                errorMessage={errors.accountUsername}
              />
            </div>
          </div>

          <div className='row mt-2'>
            <div className='col'>
              <FieldText
                labelText={'Password'}
                onTextChange={(text) => handleInputChange('accountPassword', text)}
                isPassword={true}
              />
            </div>
          </div>

          <div className='row'>
            <div className='col' style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              marginTop: '2rem'
            }}>
              Mailing Address
            </div>
          </div>

          <div className='row mt-2'>
            <div className='col'>
              <FieldText
                labelText={'Full Name'}
                onTextChange={(text) => handleInputChange('mailingFullName', text)}
                defaultText={formData.mailingFullName}
                errorMessage={errors.mailingFullName}
              />
            </div>
          </div>

          <div className='row mt-2'>
            <div className='col'>
              <FieldText
                labelText={'Address Line 1'}
                onTextChange={(text) => handleInputChange('mailingAddress1', text)}
                defaultText={formData.mailingAddress1}
                errorMessage={errors.mailingAddress1}
              />
            </div>
          </div>

          <div className='row mt-2'>
            <div className='col'>
              <FieldText
                labelText={'Address Line 2'}
                onTextChange={(text) => handleInputChange('mailingAddress2', text)}
                defaultText={formData.mailingAddress2}
                errorMessage={errors.mailingAddress2}
              />
            </div>
          </div>

          <div className='row mt-2'>
            <div className='col' style={{paddingRight:'1rem'}}>
              <FieldText
                labelText={'City'}
                onTextChange={(text) => handleInputChange('mailingCity', text)}
                defaultText={formData.mailingCity}
                errorMessage={errors.mailingCity}
              />
            </div>
            <div className='col'>
              <FieldText
                labelText={'State/Province/Region'}
                onTextChange={(text) => handleInputChange('mailingState', text)}
                defaultText={formData.mailingState}
                errorMessage={errors.mailingState}
              />
            </div>
          </div>

          <div className='row mt-2'>
            <div className='col' style={{paddingRight:'1rem'}}>
              <FieldText
                labelText={'Zip Code'}
                onTextChange={(text) => handleInputChange('mailingZipCode', text)}
                defaultText={formData.mailingZipCode}
                errorMessage={errors.mailingZipCode}
              />
            </div>
            <div className='col'>
              <FieldText
                labelText={'Country'}
                onTextChange={(text) => handleInputChange('mailingCountry', text)}
                defaultText={formData.mailingCountry}
                errorMessage={errors.mailingCountry}
              />
            </div>
          </div>

          <div className='row mt-2'>
            <div className='col p-0'>
              <FieldText
                labelText={'Phone Number'}
                onTextChange={(text) => handleInputChange('mailingPhone1', text)}
                defaultText={formData.mailingPhone1}
                errorMessage={errors.mailingPhone1}
              />
            </div>
            <div className='col px-3'>
              <FieldText
                labelText={'\u200B'}
                onTextChange={(text) => handleInputChange('mailingPhone2', text)}
                defaultText={formData.mailingPhone2}
                errorMessage={errors.mailingPhone2}
              />
            </div>
            <div className='col p-0'>
              <FieldText
                labelText={'\u200B'}
                onTextChange={(text) => handleInputChange('mailingPhone3', text)}
                defaultText={formData.mailingPhone3}
                errorMessage={errors.mailingPhone3}
              />
            </div>
          </div>

          <div className='row'>
            <div className='col' style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              marginTop: '2rem'
            }}>
              Payment Information
            </div>
          </div>

          <div className='row mt-2'>
            <div className='col'>
              <FieldText
                labelText={'Name On Card'}
                onTextChange={(text) => handleInputChange('paymentFullName', text)}
                defaultText={formData.paymentFullName}
                errorMessage={errors.paymentFullName}
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

        <div className='col-4'>
          <div className='row'>
            <div className='col buttons-col'>

              <div className='row'>
                <div className='col'>
                  <ButtonRounded
                    onClick={() => {handleUpdateProfile()}}
                    text={'Save Profile Changes'}
                    borderRadius={'0.5rem'}
                  />
                </div>
              </div>

              <div className='row'>
                <div className='col py-3'>
                  <ButtonRounded
                    onClick={() => {navigate('/subscriptions')}}
                    text={'View Subscriptions'}
                    borderRadius={'0.5rem'}
                  />
                </div>
              </div>

              <div className='row'>
                <div className='col'>
                  <ButtonRounded
                    onClick={() => {navigate('/reviews')}}
                    text={'View Reviews'}
                    borderRadius={'0.5rem'}
                  />
                </div>
              </div>

              <div className='row'>
                <div className='col' style={{
                  marginTop: '1rem'
                }}> 
                  <ButtonRounded
                    onClick={() => {logout()}}
                    text={'Log Out'}
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
      </div>
    </div>
  )

}

export default ProfilePage;