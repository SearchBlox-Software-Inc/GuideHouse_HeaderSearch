import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import { topQueryFields, pluginDomain, topQuery } from '../Common/Defaults';

import '../css/topquery_component.css';

// ------------------------------

const TopQuerySuggestions = ({ triggerSearch, resetSelectedSmartFAQ }) => {
   const [topQueries, setTopQueries] = useState([]);

   // get top queries
    useEffect(() => {
        axios({
            method: 'post',
            url: pluginDomain + '/rest/v2/api/query/topquery',
            data: {
                'apikey': topQueryFields.apikey,
                'col': topQueryFields.col,
                'limit': topQueryFields.limit
            },
            headers: {'Content-Type': 'application/json'}
        })
        .then(response => {
            if(response.data && Object.keys(response.data).length) {
                setTopQueries(Object.keys(response.data));
            }
        })
        .catch(error => error);
    }, []);

    const searchForTopQuery = topQuery => {
        resetSelectedSmartFAQ();
        triggerSearch(topQuery);
    };

    // const handleKeyDown = (e, topQuery) => {
    //     if(e.keyCode === 13) {
    //         searchForTopQuery(topQuery);
    //     }
    // };

   return (
      <>  
         {
            topQueries && Boolean(topQueries.length) &&
                <div className="popular-searches">
                    <h3>Popular Searches</h3>
                    <ul>
                        {
                            topQueries.map((topQuery, i) => (
                                <li key={`top-query-${i}`}>
                                    <button className="top-query" onClick={() => searchForTopQuery(topQuery)}>
                                        <i className="fa-solid fa-arrow-trend-up" />
                                        {topQuery}
                                    </button>
                                </li>
                            )
                        )
                        }
                    </ul>
                </div>      
         }
      </>
   );
};
   
export default TopQuerySuggestions;

TopQuerySuggestions.propTypes = {
   triggerSearch: PropTypes.func,
   resetSelectedSmartFAQ: PropTypes.func,
};


   