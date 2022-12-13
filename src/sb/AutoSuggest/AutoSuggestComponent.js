import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { getAutoSuggest, getSuggestClickCount } from '../Common/SbCore';


// ------------------------------

const AutoSuggest = ({ query, triggerSearch, resetSelectedSmartFAQ }) => {
   const [suggestedQueries, setSuggestedQueries] = useState([]);

   useEffect(() => {
      getAutoSuggest(query)
         .then(response => {
            let suggestions = [];

            if(response.data === undefined){
               throw new Error("Autosuggest error");
               
            } else if(response.data[0].constructor.name === 'Object') {
               //smartsuggest
               const keys = Object.keys(response.data[0]);
               
               if(keys.length) {
                  suggestions = keys.map(key => response.data[0][key]);
               }
               
            } else {
               //autocomplete
               if(response.data.length)
                  suggestions = [ ...response.data ];
            }
            
            setSuggestedQueries([ ...suggestions ]); 
         })
         .catch(error => error);
   }, [query]);


   const highlightFunc = (text, search) => {
      const regex = new RegExp("(" + RegExp.escape(search) + ")", "gi");
      return "<span>" + text.replace(regex, "<strong>$1</strong>") + "</span>";
   };

   const handleClick = suggestedQuery => {
      resetSelectedSmartFAQ();
      triggerSearch(suggestedQuery);
      getSuggestClickCount({suggest: suggestedQuery, query });
   };

   return (
      <>
         {
            Boolean(suggestedQueries.length) &&
               <ul className="autosuggest-container">
                  <h3>suggestions</h3>
                  {
                     suggestedQueries.map((suggestedQuery, i) => (
                           <li key={`suggested-suggestedQuery-${i}`}>
                              <button className="suggested-query" 
                                 dangerouslySetInnerHTML={{__html: highlightFunc(suggestedQuery.replace(/\\/g, ''), query)}} 
                                 onClick={() => handleClick(suggestedQuery)}
                              />
                           </li>
                        )
                     )
                  }
               </ul>
         }
      </>
   );
};
   
export default AutoSuggest;

AutoSuggest.propTypes = {
   query: PropTypes.string,
   triggerSearch: PropTypes.func,
   resetSelectedSmartFAQ: PropTypes.func
};


   