import './SubscriptionsPage.css';
import React, { useState, useEffect } from 'react';
import SubscriptionProduct from '../../components/SubscriptionProduct/SubscriptionProduct';
import axios from 'axios';
import ButtonRounded from '../../components/ButtonRounded/ButtonRounded';

function SubscriptionsPage({ currentPoints, cancelCallback }) {

  const [currentSubscriptions, setCurrentSubscriptions] = useState(null);
  const [subscriptionsToCancel, setSubscriptionsToCancel] = useState([]);
  const [totalPointsRemoved, setTotalPointsRemoved] = useState(0);
  const [magazineSubTotal, setMagazineSubTotal] = useState(0);
  const [newspaperSubTotal, setNewspaperSubTotal] = useState(0);
  const [estimatedTaxTotal, setEstimatedTaxTotal] = useState(0);

  const formatCurrency = (number) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    return formatter.format(number);
  };


  useEffect(() => {
    let totalPoints = 0;
    let magazineTotal = 0;
    let newspaperTotal = 0;
    let estimatedTax = 0;

    subscriptionsToCancel?.forEach((id) => {
      const findSubscriptionByID = (id) => {
        const entry = Object.entries(currentSubscriptions).find(([_, value]) => value.subscription_id === id);
        return entry ? entry[1] : null;
      }

      const subscription = findSubscriptionByID(id);

      if (subscription != null) {
        const product = subscription.product_info;

        totalPoints += product.points_gained;

        if (product.type === "MAGAZINE") {
          magazineTotal += subscription.amount_to_refund;
        }
  
        if (product.type === "NEWSPAPER") {
          newspaperTotal += subscription.amount_to_refund;
        }

        estimatedTax += product.estimated_tax;
      }
    });

    setTotalPointsRemoved(totalPoints);
    setMagazineSubTotal(magazineTotal);
    setNewspaperSubTotal(newspaperTotal);
    setEstimatedTaxTotal(estimatedTax);
  }, [subscriptionsToCancel]);


  const getUserSubcriptions = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/subscriptions', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(response.data);
      const calcedSubscriptions = await appendSubscriptionProducts(response.data)
      console.log('################')
      console.log(calcedSubscriptions)
      if (calcedSubscriptions == null) {
        throw new Error('Could not fetch products');
      }
      setCurrentSubscriptions(calcedSubscriptions);
    } catch (error) {
      console.log(error)
      if (error.response) {
        console.log(`Error: ${error.response.data.message}`);
      } else {
        console.log('Network error. Please try again.');
      }
    }
  }

  const appendSubscriptionProducts = async (subscriptions) => {
    for (let subscription of subscriptions) {
      try {
        const id = subscription.product_id;
        const response = await axios.get(`http://127.0.0.1:5000/products/${id}`);
        let product = response.data;
  
        const taxRate = (product.type === "MAGAZINE") ? 0.0825 : 0.0;
        product.estimated_tax = parseFloat((subscription.amount_to_refund * taxRate).toFixed(2));
  
        const pointRate = (product.type === "MAGAZINE") ? 0.1 : 0.2;  
        product.points_gained = Math.floor(product.price * pointRate * 100);
  
        subscription.product_info = product;
  
      } catch (error) {
        console.log(error);
        if (error.response) {
          console.log(`Error: ${error.response.data.message}`);
        } else {
          console.log('Network error. Please try again.');
        }
        return null;
      }
    }
  
    return subscriptions;
  }

  const toggleCancel = (id) => {
    if (subscriptionsToCancel.includes(id)) {
      setSubscriptionsToCancel(subscriptionsToCancel.filter(subscription_id => subscription_id !== id));
    } else {
      setSubscriptionsToCancel((subscriptionsToCancel) => [...subscriptionsToCancel, id]);
    }
  }

  const confirmCancellation = async () => {
    if(subscriptionsToCancel.length == 0) {
      alert('Cannot cancel 0 products');
      return
    }

    try {
      const response = await axios.post('http://127.0.0.1:5000/subscriptions/cancel',
        { subscription_ids : subscriptionsToCancel },
      );

      setTimeout(() => {
        alert('Cancellation Successful');
        console.log('Cancellation Successful');
      }, 100); 

      cancelCallback();
      setSubscriptionsToCancel([]);
      getUserSubcriptions();
    } catch (error) {
      console.log(error)
      if (error.response) {
        console.log(`Error: ${error.response.data.message}`);
      } else {
        console.log('Network error. Please try again.');
      }
    }
  }
  

  useEffect (() => {
    getUserSubcriptions()
  }, [])

  const handleCancelSubscriptions = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/subscriptions/cancel',
        { subscription_ids: subscriptionsToCancel },
        { headers: { 'Content-Type': 'application/json', }, }
      );

      if(subscriptionsToCancel.length == 0){
        alert('Cannot cancel 0 products');
      }else{
        cancelCallback()
        setTimeout(() => {
          alert('Cancellation Successful');
          console.log('Cancellation Successful');
        }, 100); 
      }

    } catch (error) {
      console.log(error)
      if (error.response) {
        console.log(`Error: ${error.response.data.message}`);
      } else {
        console.log('Network error. Please try again.');
      }
    }
  }

  return(
    <div className='container'>
      <div className='row'>
        <div className='col' id='result-message-col'>
          {`${currentSubscriptions ? currentSubscriptions.length : 0} Ongoing Subscriptions`}
        </div>
      </div>

      <div className='row' style={{
        marginTop: '1rem'
      }}>
        <div className='col-8 px-3' style={{
          paddingBottom: '1rem'
        }}>
          <div className='row'>
            {currentSubscriptions ? currentSubscriptions.map(subscription => (
              <div className='col-12 p-0'>
                <SubscriptionProduct
                  subscriptionProductInfo={subscription}
                  toggleCancel={toggleCancel}
                  isInCancelList={subscriptionsToCancel.includes(subscription.subscription_id)}
                />
              </div>
            )) : <div></div>}
          </div>
        </div>

        <div className='col-4'>
          <div className='row'>
            <div className='col return-summary-col'>
              
              <div className='row'>
                <div className='col title-summary-col'>
                  Point Deductions
                </div>
              </div>

              <div className='row'>
                <div className='col description-col'>
                  Current Points
                </div>
                <div className='col-auto p-0 amount-col'>
                 {currentPoints}
                </div>
              </div>

              <div className='row'>
                <div className='col description-col'>
                  Removed Points
                </div>
                <div className='col-auto p-0 amount-col'>
                  {-totalPointsRemoved}
                </div>
              </div>

              <div className='row m-0'>
                <div className='col separator-line'/>
              </div>

              <div className='row'>
                <div className='col description-col'>
                  Post Cancellation Point Balance
                </div>
                <div className='col-auto p-0 amount-col'>
                  {currentPoints - totalPointsRemoved}
                </div>
              </div>

            </div>
          </div>

          <div className='row'>
            <div className='col return-summary-col'>

              <div className='row'>
                <div className='col title-summary-col'>
                  Cancellation Summary
                </div>
              </div>

              <div className='row'>
                <div className='col description-col'>
                  Magazine Subtotal
                </div>
                <div className='col-auto p-0 amount-col'>
                  {formatCurrency(magazineSubTotal)}
                </div>
              </div>

              <div className='row'>
                <div className='col description-col'>
                  Newspaper Subtotal
                </div>
                <div className='col-auto p-0 amount-col'>
                  {formatCurrency(newspaperSubTotal)}
                </div>
              </div>

              <div className='row m-0'>
                <div className='col separator-line'/>
              </div>

              <div className='row'>
                <div className='col description-col'>
                  Returned Tax
                </div>
                <div className='col-auto p-0 amount-col'>
                  {formatCurrency(estimatedTaxTotal)}
                </div>
              </div>

              <div className='row m-0'>
                <div className='col separator-line'/>
              </div>

              <div className='row'>
                <div className='col total-col'>
                  Refund Total
                </div>
                <div className='col-auto p-0 total-col'>
                  {formatCurrency(magazineSubTotal + newspaperSubTotal + estimatedTaxTotal)}
                </div>
              </div>

              <div className='row'>
                <div className='col mt-3'>
                  <ButtonRounded
                    onClick={() => {confirmCancellation()}}
                    text={'Confirm Cancellations'}
                    textSize={'1rem'}
                    borderRadius={'0.5rem'}
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

export default SubscriptionsPage;