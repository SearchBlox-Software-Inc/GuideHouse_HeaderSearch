import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { getTrendingData, getSuggestClickCount } from '../Common/SbCore';


// ------------------------------

const TrendingQueries = ({ query, triggerSearch, resetSelectedSmartFAQ }) => {
   const [trendingQueries, setTrendingQueries] = useState([]);

   useEffect(() => {
      getTrendingData()
         .then(response => {
            if(response.constructor !== Error) {
                if(response.constructor !== Object || response.data.constructor !== Object) {
                  throw new Error("Trending data error");
                } else {
                  const trendingResults = response.data.result;
                  let suggestions = [];

                  if(trendingResults.length) {
                    suggestions = trendingResults.map(result => result.title);
                  }
                  
                  setTrendingQueries([ ...suggestions ]);
                }
              }
              else{
                throw new Error("Trending data error");
              } 
         })
         .catch(error => error);
   }, []);

   const handleClick = trendingQuery => {
      resetSelectedSmartFAQ();
      triggerSearch(trendingQuery);
      getSuggestClickCount({suggest: trendingQuery, query: '' });
   };

   return (
        <>
            {
              Boolean(trendingQueries.length) &&<>
              <h3>Trending Search</h3>
                    <ul className="trending-container">
                        {
                            trendingQueries.map((trendingQuery, i) => (
                            <li key={`trending-${i}`}>
                                <button className="suggested-query" onClick={() => handleClick(trendingQuery)}>
                                    {trendingQuery}
                                </button>
                            </li>
                        ))
                        }
                    </ul>
                    </>
            }
        </>
   );
};
   
export default TrendingQueries;

TrendingQueries.propTypes = {
   query: PropTypes.string,
   triggerSearch: PropTypes.func,
   resetSelectedSmartFAQ: PropTypes.func
};


   