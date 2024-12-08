import './CartPage.css';
import React, { useState, useEffect } from 'react';
import FieldText from '../../components/FieldText/FieldText';
import CartProduct from '../../components/CartProduct/CartProduct';
import ButtonRounded from '../../components/ButtonRounded/ButtonRounded';
import axios from 'axios';

function CartPage({ removeProductFromCart, currentCartProducts, currentPoints, checkoutCallback }) {

  const [pointsUsed, setPointsUsed] = useState(0)
  const [totalPointsGained, setTotalPointsGained] = useState(0);
  const [magazineSubTotal, setMagazineSubTotal] = useState(0);
  const [newspaperSubTotal, setNewspaperSubTotal] = useState(0);
  const [estimatedTaxTotal, setEstimatedTaxTotal] = useState(0);

  useEffect(() => {
    let totalPoints = 0;
    let magazineTotal = 0;
    let newspaperTotal = 0;
    let estimatedTax = 0;

    currentCartProducts?.forEach((product) => {
      totalPoints += product.points_gained;
      
      if (product.type === "MAGAZINE") {
        magazineTotal += product.price;
      }

      if (product.type === "NEWSPAPER") {
        newspaperTotal += product.price;
      }

      estimatedTax += product.estimated_tax;
    });

    setTotalPointsGained(totalPoints);
    setMagazineSubTotal(magazineTotal);
    setNewspaperSubTotal(newspaperTotal);
    setEstimatedTaxTotal(estimatedTax);
  }, [currentCartProducts]);

  const formatCurrency = (number) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    return formatter.format(number);
  };

  const handleCheckout = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/checkout',
        { points_spent: pointsUsed },
        { headers: { 'Content-Type': 'application/json', }, }
      );

      console.log(response.data);
      console.log(`Checkout Successful`);
      checkoutCallback();
    } catch (error) {
      console.log(error)
      if (error.response) {
        console.log(`Error: ${error.response.data.message}`);
      } else {
        console.log('Network error. Please try again.');
      }
    }
  }

  return (
    <div className='container'>
      <div className='row'>
        <div className='col' id='result-message-col'>
           {currentCartProducts ? currentCartProducts.length : 0} Products In Cart
        </div>
      </div>

      <div className='row' style={{
        paddingTop: '1rem'
      }}>

        <div className='col-8 px-3'>
          <div className='row'>
            {currentCartProducts ? currentCartProducts.map(cartProduct => (
              <div className='col-12 p-0'>
                <CartProduct
                  cartProductInfo={cartProduct}
                  removeProductFromCart={(id) => {removeProductFromCart(id)}}
                />
              </div>
            )) : <div></div>}
          </div>
        </div>

        <div className='col-4'>

          <div className='row'>
            <div className='col order-summary-col'>
              
              <div className='row'>
                <div className='col title-summary-col'>
                  Points To Use
                </div>
              </div>

              <div className='row'>
                <div className='col' style={{
                  marginBottom: '0.5rem'
                }}>
                  <FieldText
                    onTextChange={(value) => {setPointsUsed(value)}}
                    isNumber={true}
                    numMax={currentPoints}
                  />
                </div>
              </div>

              <div className='row'>
                <div className='col description-col'>
                  Current Points
                </div>
                <div className='col-auto p-0 amount-col'>
                  {currentPoints ? currentPoints : 0}
                </div>
              </div>

              <div className='row'>
                <div className='col description-col'>
                  Points Used
                </div>
                <div className='col-auto p-0 amount-col'>
                  {pointsUsed ? -pointsUsed : 0}
                </div>
              </div>

              <div className='row m-0'>
                <div className='col separator-line'/>
              </div>

              <div className='row'>
                <div className='col description-col'>
                  Remaining Points
                </div>
                <div className='col-auto p-0 amount-col'>
                  {pointsUsed ? currentPoints - pointsUsed : currentPoints}
                </div>
              </div>

              <div className='row'>
                <div className='col description-col'>
                  Total Points Gained
                </div>
                <div className='col-auto p-0 amount-col'>
                  +{totalPointsGained}
                </div>
              </div>

              <div className='row m-0'>
                <div className='col separator-line'/>
              </div>

              <div className='row'>
                <div className='col description-col'>
                  Post Purchase Point Balance
                </div>
                <div className='col-auto p-0 amount-col'>
                  {(pointsUsed ? currentPoints - pointsUsed : currentPoints) + totalPointsGained}
                </div>
              </div>

            </div>
          </div>

          <div className='row'>
            <div className='col order-summary-col'>

              <div className='row'>
                <div className='col title-summary-col'>
                  Order Summary
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
                  Newspapers Subtotal
                </div>
                <div className='col-auto p-0 amount-col'>
                  {formatCurrency(newspaperSubTotal)}
                </div>
              </div>

              <div className='row'>
                <div className='col description-col'>
                  Shipping & Handling
                </div>
                <div className='col-auto p-0 amount-col'>
                  FREE
                </div>
              </div>

              <div className='row m-0'>
                <div className='col separator-line'/>
              </div>

              <div className='row'> 
                <div className='col description-col'>
                  Used Points
                </div>
                <div className='col-auto p-0 amount-col'>
                  -{formatCurrency(pointsUsed ? pointsUsed/100 : 0)}
                </div>
              </div>

              <div className='row m-0'>
                <div className='col separator-line'/>
              </div>

              <div className='row'>
                <div className='col description-col'>
                  Total Before Tax
                </div>
                <div className='col-auto p-0 amount-col'>
                  {formatCurrency(magazineSubTotal + newspaperSubTotal - (pointsUsed ? pointsUsed/100 : 0))}
                </div>
              </div>

              <div className='row'>
                <div className='col description-col'>
                  Estimated Tax
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
                  Order Total
                </div>
                <div className='col-auto p-0 total-col'>
                {formatCurrency(magazineSubTotal + newspaperSubTotal - (pointsUsed ? pointsUsed/100 : 0) + estimatedTaxTotal)}
                </div>
              </div>

              <div className='row'>
                <div className='col mt-3'>
                  <ButtonRounded
                    onClick={() => {handleCheckout()}}
                    text={'Place Order'}
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

export default CartPage;