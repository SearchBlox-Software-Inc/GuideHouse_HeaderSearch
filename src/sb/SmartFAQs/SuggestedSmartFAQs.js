import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { suggestSmartFAQs } from '../Common/Defaults';
import { getSmartFAQS, getSelectedSmartFAQ } from '../Common/SbCore';

// ------------------------------

const SuggestedSmartFAQs = ({query, saveSelectedSmartFAQ,  triggerSearch}) => {
   const [faqs, setFAQs] = useState([]);

   useEffect(() => {
      getSmartFAQS(query, suggestSmartFAQs.limit)
         .then(response => setFAQs(response.data.smartFaq));
   }, [query]);

   const highlightFunc = (text, search) => {
      const regex = new RegExp("(" + RegExp.escape(search) + ")", "gi");
      return "<span>" + text.replace(regex, "<strong>$1</strong>") + "</span>";
   };

   const getFAQDetails = faq => {
      getSelectedSmartFAQ(faq.uid)
         .then(response => {
            if(response.status === 200 && response.data) {
               saveSelectedSmartFAQ(response.data);
            }
         });

         triggerSearch(faq.question, 'OR');
   };

   if(!faqs.length)
      return null;

   return (
      <div className="suggested-FAQs-wrapper">
         <h3>Suggested SmartFAQs</h3>

         <ul className="suggested-FAQs">
            {
               faqs.map((faq, i) => (
                  <li key={`suggested-faq-${i}`}>
                     <button dangerouslySetInnerHTML={{__html: highlightFunc(faq.question.replace(/\\/g, ''), query)}}
                        onClick={() => getFAQDetails(faq)}
                        // onKeyDown={(e) => handleKeyDown(e, faq)}
                     />
                  </li>
               ))
            }
         </ul>
      </div>
   );
};

SuggestedSmartFAQs.propTypes = {
    query: PropTypes.string,
    saveSelectedSmartFAQ: PropTypes.func,
    triggerSearch: PropTypes.func
};

export default SuggestedSmartFAQs;
