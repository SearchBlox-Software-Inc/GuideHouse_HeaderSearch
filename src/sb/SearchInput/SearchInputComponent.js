import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import * as qs from 'query-string';
import { defaultType, trendingSearch, showAutoSuggest, suggestSmartFAQs, topQuery, searchUrlRedirect } from '../Common/Defaults';
// import { defaultType, trendingSearch, showAutoSuggest, suggestSmartFAQs, topQuery } from '../Common/Defaults';
import * as parser from '../Common/SbCore';
import VoiceContext from '../../VoiceContext';

import VoiceSearch from '../SearchInput/VoiceSearchInput';
import TrendingComponent from '../AutoSuggest/TrendingComponent';
import AutoSuggestComponent from '../AutoSuggest/AutoSuggestComponent';
import SuggestedSmartFAQs from './../SmartFAQs/SuggestedSmartFAQs';
import TopQuerySuggestions from '../topQuery/TopQuerySuggestions';

import '../css/search_component.css';

// ------------------------------

const SearchInputComponent = ({ response, resetSuggestSearchQueries, query: queryProp, selectedSmartFAQ, saveSelectedSmartFAQ }) => {
   const parameters = Object.assign({}, qs.parse(window.location.search));
   const regex = /^[a-z\d\-_&\s]+$/gi;

   const [query, setQuery] = useState('');
   const [dropdownShown, setDropdownVisibility] = useState(false);
   const [recording, setRecording] = useState(false);
   const [svgBTNs]=useState({
      close:(<svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line y1="-0.5" x2="29.6956" y2="-0.5" transform="matrix(0.707044 0.707169 -0.707044 0.707169 1 1)" stroke="white"/>
      <line y1="-0.5" x2="29.6956" y2="-0.5" transform="matrix(-0.707044 0.707169 0.707044 0.707169 22 1)" stroke="white"/>
      </svg>),
      searchBTN:(<svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10.0763" cy="10.0763" r="9.57629" stroke="white"/>
      <line x1="16.9395" y1="17.8925" x2="24.0645" y2="25.0176" stroke="white"/>
      </svg>)
   })
   
   const dropdownRef = useRef(null);

   // ------------------------------

   useEffect(() => {
      const urlParameters = Object.assign({}, qs.parse(window.location.search));
      
      if(urlParameters.query)
         setQuery(urlParameters.query);

      document.addEventListener('mousedown', handleClickOutsideDropdown);

      return () => {
         document.removeEventListener('mousedown', handleClickOutsideDropdown);
      };
   }, []);


   useEffect(() => {
      setQuery((queryProp)
         .replace(/&quot;/g, '"')
         .replace(/&amp;/g, "&")
         .replace(/\\/g, ''));
   }, [queryProp]);

   // ------------------------------

   const triggerSearch = (query, searchType = defaultType) => {
      setQuery(query);
      setDropdownVisibility(false);
      
      let params = parser.getInitialUrlParameters(query);

      params.page = 1;

      if(params.default !== searchType)
         params.default = searchType;

      delete params.mlt_id;
      delete params.mlt_col;
      delete params.XPC;

      if(response && response.resultInfo && response.resultInfo.hits <= 0) {
         params = parser.clearAllFilters(params);
      }

      let stringifiedParams = qs.stringify(params);
      let decodedPramsString = decodeURIComponent(stringifiedParams);
      let searchUrl = searchUrlRedirect;
      let redirection_origin = "";
      if(document.getElementById("redirection_origin")){
         redirection_origin = document.getElementById("redirection_origin").value;
      }
      if(searchUrl!=="" && redirection_origin!=="" && redirection_origin!==null){
         window.open(
         `${redirection_origin+searchUrl}?${decodedPramsString}`,
         "_self"
         );
      }
      else if(searchUrl!=="" && redirection_origin===""){
         window.open(
         `${window.location.origin+searchUrl}?${decodedPramsString}`,
         "_self"
         );
      }
      else{
         window.open(
         `${window.location.origin+window.location.pathname}?${decodedPramsString}`,
         "_self"
         );
      }
   };


   const clearSearchInput = e => {
      e.preventDefault();
      const urlParameters = Object.assign({}, qs.parse(window.location.search),urlParameters);
      const locationHref = document.location.href.split("?")[0];

      document.location.href = locationHref;
   };

  const handleInputFocus = () => {
    if(trendingSearch.enabled && !query.length && !dropdownShown) {
      setDropdownVisibility(true);
    }
  };

   const handleInputKeyDown = e => {
      const keyCode = e.keyCode;

      if(keyCode === 40 && dropdownShown) {
         e.preventDefault();
         document.querySelectorAll('.input-dropdown li button')[0].focus();
      } else if(keyCode === 13) {
         resetSelectedSmartFAQ();
         triggerSearch(e.target.value);
      }
   };

   const handleInputChange = e => {
      const currentInput = e.target.value;

      setQuery(currentInput);
  
      if(!currentInput.length || currentInput.length >= 3) {
         if(!dropdownShown)
            setDropdownVisibility(true);  
      } else if(dropdownShown) {
         setDropdownVisibility(false);
      }
   };

   const triggerVoiceSearch = () => {
      setQuery('');
      setRecording(true);
   };

   const voiceSearch = data => {
      if(data.length) {
         const newQuery = data[data.length - 1];
         
         setQuery(newQuery);
         triggerSearch(newQuery);
      }
   };

   const handleClickOutsideDropdown = e => {
      if (dropdownRef && dropdownRef.current && !dropdownRef.current.contains(e.target) && e.target.id !== 'searchInput') {
        setDropdownVisibility(false);
      }
   };
  
   const handleDropdownKeyDown = e => {
      const keyCode = e.keyCode;
      const dropdownItems = document.querySelectorAll('.input-dropdown li button');
      const currentIndex = Array.from(dropdownItems).indexOf(e.target);
      
      if(keyCode === 40 || keyCode === 38) {
        // Down and up arrow keys
         e.preventDefault();
         let newIndex = currentIndex;

         if(keyCode === 40)
            newIndex = currentIndex + 1 >= dropdownItems.length ? 0 : currentIndex + 1;
         else
            newIndex = currentIndex - 1 < 0 ? dropdownItems.length - 1 : currentIndex - 1;
         
         dropdownItems[newIndex].focus();
  
      } else if(keyCode === 27) { 
         // Escape key
         setDropdownVisibility(false);
      }
   };

   const resetSelectedSmartFAQ = () => {
      if(Object.keys(selectedSmartFAQ).length) {
         saveSelectedSmartFAQ({});
      }
   };

   // ------------------------------

   return (
      <> 
         <VoiceContext.Consumer>
            {  
               value => {
                  const voiceSearchEnabled = ((value && value['voice-enabled']) || (Object.keys(value).length === 0 && voiceSearch));
                  const voiceSearchEnabledPlaceholder = recording ? 'Listening...' : 'What can we help you find?';
               
                  return (
                     <>
                        <div className="input-wrapper">
                           <input id="searchInput"
                              aria-label="Search input"
                              autoComplete="off"
                              className={` justify-content-between ${voiceSearchEnabled ? 'voice-search-enabled' : ''}`} 
                              placeholder={voiceSearchEnabled ? voiceSearchEnabledPlaceholder : 'Search'}
                              value={query}
                              onFocus={handleInputFocus}
                              onKeyDown={handleInputKeyDown}
                              onChange={handleInputChange}
                           />

                           <div className="input-buttons">
                             <div className="clear-search-container">
                                
                                  <button title="Clear Search" 
                                      aria-label="Clear search" 
                                      onClick={clearSearchInput} 
                                      className={`clear-btn-hide ${query.length > 0 ? "clear-btn-show":""}`} 
                                  >
                                    {svgBTNs.close}
                                    </button>
                              
                              </div>
                              {
                                voiceSearchEnabled &&
                                  <div onClick={triggerVoiceSearch}>
                                      <VoiceSearch voiceSearch={voiceSearch} isRecording={setRecording}/>
                                  </div>
                              }
                              <button title="Search Button" 
                                      aria-label="search" className="search-btn-main" onClick={()=>triggerSearch(query)}>
                           {svgBTNs.searchBTN}
                        </button>
                           </div>

                           {
                              dropdownShown &&
                                 <div className="input-dropdown" ref={dropdownRef} onKeyDown={handleDropdownKeyDown}>
                                    {
                                      trendingSearch.enabled && !query.length &&
                                        <div className="input-dropdown__item">
                                          <TrendingComponent triggerSearch={triggerSearch} resetSelectedSmartFAQ={resetSelectedSmartFAQ} />
                                        </div>
                                    }

                                    {
                                      query.length >= 3 &&
                                        <>
                                          {
                                            (showAutoSuggest || parameters.autoSuggestDisplay) && regex.test(query) && 
                                                <div className="input-dropdown__item">
                                                  <AutoSuggestComponent query={query}  
                                                      triggerSearch={triggerSearch}
                                                      resetSelectedSmartFAQ={resetSelectedSmartFAQ}
                                                  />
                                                </div>
                                          }

                                          {
                                            suggestSmartFAQs.enabled && 
                                              <div className="input-dropdown__item">
                                                <SuggestedSmartFAQs query={query}
                                                  saveSelectedSmartFAQ={saveSelectedSmartFAQ}
                                                  triggerSearch={triggerSearch}
                                                />
                                              </div>
                                          }

                                          {
                                            topQuery &&
                                              <div className="input-dropdown__item">
                                                <TopQuerySuggestions triggerSearch={triggerSearch} resetSelectedSmartFAQ={resetSelectedSmartFAQ} />
                                              </div>
                                          }
                                        </>
                                    }
                                 </div>
                           }
                        </div>
                        
                     </>
                  );
               }
            }
         </VoiceContext.Consumer>
      </>
   );
};

export default SearchInputComponent;

SearchInputComponent.propTypes = {
   query: PropTypes.string,
   resetSuggestSearchQueries: PropTypes.func,
   response: PropTypes.object,
   securityResponse: PropTypes.func,
   saveSelectedSmartFAQ: PropTypes.func,
   selectedSmartFAQ: PropTypes.object
};
