import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, useNavigate} from 'react-router-dom';
import TopNavigationBar from './components/TopNavigationBar/TopNavigationBar';
import LogInPage from './pages/LogInPage/LogInPage';
import SignUpPage from './pages/SignUpPage/SignUpPage';
import SearchPage from './pages/SearchPage/SearchPage';
import CartPage from './pages/CartPage/CartPage';
import React, { useState, useEffect } from 'react';
import ProductPage from './pages/ProductPage/ProductPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import SubscriptionsPage from './pages/SubscriptionsPage/SubscriptionsPage';
import ReviewsPage from './pages/ReviewsPage/ReviewsPage';
import LandingPage from './pages/LandingPage/LandingPage';

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = token;
    }
    return config;
  },
  (error) => {}
);

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate])

  if (!token) {
    return null;
  }

  return element;
};

function App() {
  const [userProfile, setUserProfile] = useState(null);
  const [userCurrentPoints, setUserCurrentPoints] = useState(0);
  const [searchType, setSearchType] = useState('MAGAZINE');
  const [searchString, setSearchString] = useState('');
  const [searchSortBy, setSearchSortBy] = useState('none');
  const [searchOrderBy, setSearchOrderBy] = useState('ascending');
  const [cartProducts, setCartProducts] = useState(null);
  const [cartPrice, setCartPrice] = useState(0);
  const [cartHighlightOn, setCartHighlightOn] = useState(false);

  const updateUserProfile = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/users/get-profile', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setUserProfile(response.data);
      console.log(`updateUserProfile: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error) {
      console.log(error)
      if (error.response) {
        console.log(`Error: ${error.response.data.message}`);
      } else {
        console.log('Network error. Please try again.');
      }
    }
  };

  useEffect(() => {
    if (userProfile == null) {
      return
    }

    setUserCurrentPoints(userProfile.points_accumulated)

  }, [userProfile])

  const addTaxAndPoints = (responseCartProducts) => {
    responseCartProducts.forEach(product => {
      const taxRate = (product.type === "MAGAZINE") ? 0.0825 : 0.0;
      product.estimated_tax = parseFloat((product.price * taxRate).toFixed(2));
  
      const pointRate = (product.type === "MAGAZINE") ? 0.1 : 0.2;  
      product.points_gained = Math.floor(product.price * pointRate * 100);
    });
  
    return responseCartProducts;
  };

  const updateCartProducts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/get-cart', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setCartProducts(addTaxAndPoints(response.data))
      console.log(`updateCartProducts: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error) {
      console.log(error)
      if (error.response) {
        console.log(`Error: ${error.response.data.message}`);
      } else {
        console.log('Network error. Please try again.');
      }
    }
  };

  useEffect(() => {
    updateUserProfile();
    updateCartProducts();
  }, []);

  useEffect(() => {
    const updateCartPrice = () => {
      if (cartProducts && cartProducts.length > 0) {
        const totalPrice = cartProducts.reduce((total, product) => {
          return total + product.price;
        }, 0);
        setCartPrice(totalPrice);

        setCartHighlightOn(true);
        setTimeout(() => {
          setCartHighlightOn(false);
        }, 350);

      } else {
        setCartPrice(0);
      }
    };

    updateCartPrice();
  }, [cartProducts])

  const addProductToCart = async (id) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/add-to-cart', 
        { product_id: id },
        { headers: { 'Content-Type': 'application/json', }, }
      );

      console.log(response.data);
      console.log(`Product ${id} was added to cart.`);
      updateCartProducts();
    } catch (error) {
      console.log(error)
      if (error.response) {
        console.log(`Error: ${error.response.data.message}`);
      } else {
        console.log('Network error. Please try again.');
      }
    }
  };

  const removeProductFromCart = async (id) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/remove-from-cart', 
        { product_id: id },
        { headers: { 'Content-Type': 'application/json', }, }
      );

      console.log(response.data);
      console.log(`Product ${id} was removed from cart.`);
      updateCartProducts();
    } catch (error) {
      console.log(error)
      if (error.response) {
        console.log(`Error: ${error.response.data.message}`);
      } else {
        console.log('Network error. Please try again.');
      }
    }
  };

  return (
    <Router>
      <div className='App d-flex align-content-start justify-content-center'>
        <TopNavigationBar 
          currentSearchType={searchType}
          currentSearchString={searchString}
          currentSearchSortBy={searchSortBy}
          currentSearchOrderBy={searchOrderBy}
          updateSearchType={(newSearchType) => {setSearchType(newSearchType)}}
          updateSearchString={(newSearchString) => {setSearchString(newSearchString)}}
          updateSearchSortBy={(newSearchSortBy) => {setSearchSortBy(newSearchSortBy)}}
          updateSearchOrderBy={(newSearchOrderBy) => {setSearchOrderBy(newSearchOrderBy)}}
          currentCartPrice={cartPrice}
          enableCartHighlight={cartHighlightOn}
        />

        <Routes>
          <Route path='/login' element={<LogInPage/>} />
          <Route path='/signup' element={<SignUpPage/>} />
          <Route path='/landing' element={<ProtectedRoute element={<LandingPage
            currentSearchType={searchType}
            addProductToCart={(id) => {addProductToCart(id)}}
            removeProductFromCart={(id) => {removeProductFromCart(id)}}
            currentCartProducts={cartProducts}
          />} />} />
          <Route path='/search' element={<ProtectedRoute element={
            <SearchPage 
              addProductToCart={(id) => {addProductToCart(id)}}
              removeProductFromCart={(id) => {removeProductFromCart(id)}}
              currentCartProducts={cartProducts}
            /> } />} />
          <Route path='/products/:id' element={<ProtectedRoute element={
            <ProductPage
            addProductToCart={(id) => {addProductToCart(id)}}
            removeProductFromCart={(id) => {removeProductFromCart(id)}}
            currentCartProducts={cartProducts}
            /> } />} />
          <Route path='/cart' element={<ProtectedRoute element={
            <CartPage 
              addProductToCart={(id) => {addProductToCart(id)}}
              removeProductFromCart={(id) => {removeProductFromCart(id)}}
              currentCartProducts={cartProducts}
              currentPoints={userCurrentPoints}
              checkoutCallback={() => {
                updateCartProducts()
                updateUserProfile()
              }}
            /> } />} />
          <Route path='/profile' element={<ProtectedRoute element={<ProfilePage/>}/>} />
          <Route path='/subscriptions' element={<ProtectedRoute element={
            <SubscriptionsPage
              currentPoints={userCurrentPoints}
              cancelCallback={() => { updateUserProfile() }}
            />
          }/>} />
          <Route path='/reviews' element={<ProtectedRoute element={<ReviewsPage/>}/>} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;
