import './TopNavigationBar.css';
import React, { useState, useEffect } from 'react';
import ButtonToggle from '../ButtonToggle/ButtonToggle';
import SearchBar from '../SearchBar/SearchBar';
import ButtonRounded from '../../components/ButtonRounded/ButtonRounded';
import { FaCartShopping } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { useLocation } from 'react-router-dom';
import { useNavigate} from 'react-router-dom';


function TopNavigationBar({ 
  currentSearchType,
  currentSearchString,
  currentSearchSortBy, 
  currentSearchOrderBy,
  updateSearchType,
  updateSearchString,
  updateSearchSortBy,
  updateSearchOrderBy,
  currentCartPrice,
  enableCartHighlight
}) {
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  useEffect(() => {
    if (loading) { // Don't auto-navigate to search page on reload
      setLoading(false);
      return;
    }

    const baseUrl = `/search?type=${currentSearchType}&sortby=${currentSearchSortBy}&orderby=${currentSearchOrderBy}&search=${currentSearchString}`
    console.log(baseUrl)
    navigate(baseUrl);
  }, [currentSearchType, currentSearchString, currentSearchSortBy, currentSearchOrderBy])

  const location = useLocation();
  const logoOnly = location.pathname == '/login' || location.pathname == '/signup';

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdownVisibility = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const toggleSearchType = () => {
    const newSearchType = (currentSearchType === 'MAGAZINE') ? 'NEWSPAPER' : 'MAGAZINE';
    console.log('searchType: ' + newSearchType);
    updateSearchType(newSearchType)

    if (currentSearchSortBy === 'issues' || currentSearchSortBy === 'city') {
    updateSearchSortBy('none');
    }
  }

  const handleSortByChange = (sort) => {
    console.log('searchSortBy: ' + sort);
    updateSearchSortBy(sort)
  };

  const handleOrderByChange = (order) => {
    console.log('searchOrderBy: ' + order);
    updateSearchOrderBy(order)
  };

  const sortByButtonData = [
    { id: 0, sort: 'title', text: 'Title' },
    { id: 1, sort: 'price', text: 'Price' },
    { id: 2, sort: (currentSearchType === 'MAGAZINE') ? 'issues' : 'city', text: (currentSearchType === 'MAGAZINE') ? 'Issues' : 'City' },
    { id: -1, sort: 'none', text: 'None' }
  ];

  const formatCartPrice = () => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(currentCartPrice);
  };

  return (
    <div className='container-fluid' id='main-container' style={{
      backgroundColor: logoOnly ? 'transparent' : '#FFFFFF'
    }}>
      <div className='row d-flex align-items-center' id='main-row'>

        <div className='col-auto p-0 mx-2'>
          <img 
            src={require('../../images/logo.png')}
            alt="Paper Trail Logo"
            style={{ width: '1auto', height: '3rem' }}
          />
        </div>

        <div className='col-auto p-0 mx-2' id='toggle-col' style={{
          opacity: logoOnly ? 0 : 1,
          visibility: logoOnly ? "hidden" : "visible"
        }}>
          <ButtonToggle
            toggledOn = {(currentSearchType === 'MAGAZINE')}
            onToggle={() => {toggleSearchType()}}
            labelOn={'Magazines'}
            labelOff={'Newspapers'}
          />
        </div>

        <div className='col p-0 mx-2' id='search-col' style={{
          opacity: logoOnly ? 0 : 1,
          visibility: logoOnly ? "hidden" : "visible"
        }}>
          <SearchBar
            defaultText={`Search for ${(currentSearchType === 'MAGAZINE') ? 'magazines' : 'newspapers'}`}
            initialSearchTerm={currentSearchString}
            onSearch={(searchTerm) => {
              console.log('searchText: ' + searchTerm)
              updateSearchString(searchTerm)
            }}
            onMenu={() => {
              toggleDropdownVisibility ()
            }}
          />

          <div 
            className='row'
            id='dropdown-row'
            style={{
              opacity: logoOnly ? 0 : (dropdownVisible ? 1 : 0),
              visibility: logoOnly ? "hidden" : (dropdownVisible ? "visible" : "hidden"),
            }}
          >
            <div className='col'>

              <div className='row'>
                <div className='col dropdown-label'>
                  Sort By
                </div>
              </div>
              
              <div className='row' id='dropdown-sort-by-row'>
              {sortByButtonData.map((button) => (
                <div className="col" key={button.id}>
                  <ButtonRounded
                    onClick={() => handleSortByChange(button.sort)}
                    text={button.text}
                    textSize="1rem"
                    textWeight={500}
                    borderRadius="1.5rem"
                    paddingHorizontal="1rem"
                    backgroundColor={(currentSearchSortBy === button.sort) ? '#27D99D' : '#FFFFFF'}
                    accentColor={(currentSearchSortBy === button.sort) ? '#FFFFFF' : '#4D4D4D'}
                  />
                </div>
              ))}
              </div>

              <div className='row'>
                <div className='col separator-line'/>
              </div>

              <div className='row'>
                <div className='col dropdown-label'>
                  Order By
                </div>
              </div>

              <div className='row' id='dropdown-order-by-row'>
                <div className='col'>
                  <ButtonRounded
                    onClick={() => {handleOrderByChange('ascending')}}
                    text={'Ascending'}
                    textSize={'1rem'}
                    textWeight={500}
                    borderRadius={'1.5rem'}
                    paddingHorizontal={'1rem'}
                    backgroundColor={(currentSearchOrderBy === 'ascending') ? '#27D99D' : '#FFFFFF'}
                    accentColor={(currentSearchOrderBy === 'ascending') ? '#FFFFFF' : '#4D4D4D'}
                  />
                </div>
                <div className='col'>
                  <ButtonRounded
                    onClick={() => {handleOrderByChange('descending')}}
                    text={' Descending'}
                    textSize={'1rem'}
                    textWeight={500}
                    borderRadius={'1.5rem'}
                    paddingHorizontal={'1rem'}
                    backgroundColor={(currentSearchOrderBy === 'ascending') ? '#FFFFFF' : '#27D99D'}
                    accentColor={(currentSearchOrderBy === 'ascending') ? '#4D4D4D' : '#FFFFFF'}
                  />
                </div>
              </div>

            </div>
          </div>

        </div>

        <div className='col-auto p-0 mx-2' id='cart-col'style={{
          opacity: logoOnly ? 0 : 1,
          visibility: logoOnly ? "hidden" : "visible"
        }}>
          <ButtonRounded
            onClick={() => {navigate('/cart')}}
            text={formatCartPrice()}
            textSize={'1rem'}
            textWeight={'500'}
            borderRadius={'1.5rem'}
            paddingHorizontal={'1rem'}
            startIcon={FaCartShopping}
            startIconSize={'1.5rem'}
            startIconGap={'0.25rem'}
            backgroundColor={enableCartHighlight ? '#27D99D' : '#E6E6E6'}
            accentColor={enableCartHighlight ? '#FFFFFF' : '#4D4D4D'}
          />
        </div>

        <div className='col-auto p-0 mx-2' id='profile-col'style={{
          opacity: logoOnly ? 0 : 1,
          visibility: logoOnly ? "hidden" : "visible"
        }}>
          <ButtonRounded
            onClick={() => {navigate('/profile')}}
            borderRadius={'1.5rem'}
            paddingHorizontal={'0.75rem'}
            startIcon={CgProfile}
            startIconSize={'1.5rem'}
          />
        </div>

      </div>

    </div>
  )
}

export default TopNavigationBar;