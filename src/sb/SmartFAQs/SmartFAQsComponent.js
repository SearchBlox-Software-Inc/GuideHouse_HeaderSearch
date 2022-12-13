import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as qs from 'query-string';

import { smartFAQSettings, suggestSmartFAQs } from '../Common/Defaults';
import { getSmartFAQS, callSmartFAQAction, smartFaqDisplayCount } from '../Common/SbCore';
import FAQItem from './FAQItem';

import './../css/smartFAQs.css';

// ------------------------------

const SmartFAQsComponent = ({ query, selectedSmartFAQ, noResults }) => {
   const [availableFAQs, setFAQs] = useState([]);
   const [fAQsCount, setFAQsCount] = useState(smartFAQSettings.count);
   const [currentActive, setCurrentActive] = useState(undefined);

   // ------------------------------

   useEffect(()=>{
      if(smartFAQSettings.enabled) {
         const parameters = Object.assign({}, qs.parse(window.location.search));

         getSmartFAQS(parameters.query, smartFAQSettings.limit).then(response => {
            if(response.data && response.data.smartFaq) {
               const receivedFAQs  = response.data.smartFaq;
               if(Object.keys(selectedSmartFAQ).length > 0) {
                  const uid = selectedSmartFAQ.uid;
                  let matchingIndex = '';

                  const checkUID = obj => {
                     if(obj.uid === uid)
                     matchingIndex = receivedFAQs.indexOf(obj);

                     return obj.uid === uid;
                  };

                  if(receivedFAQs.some(checkUID)) {
                     const faqsList = [...receivedFAQs];
                     faqsList.splice(matchingIndex, 1);
                     setFAQs(faqsList);
                  }

               } else {
                  setFAQs(receivedFAQs);
               }
            }
         });
      }
   }, [query]);

   // ------------------------------

   const toggleActive = index => {
      if(index === currentActive) {
         setCurrentActive(undefined);
         return;
      }

      setCurrentActive(index);

      if(index  === fAQsCount - 1 && fAQsCount < availableFAQs.length) {
         setFAQsCount(fAQsCount + smartFAQSettings.loadMoreCount);
         const newlyLoadedFAQs = [];
         const maxIndex = fAQsCount + smartFAQSettings.loadMoreCount <= availableFAQs.length ? fAQsCount + smartFAQSettings.loadMoreCount : availableFAQs.length;
         for(let i = index + 1; i < maxIndex; i++) {
            newlyLoadedFAQs.push({uid:availableFAQs[i].uid,collection:availableFAQs[i].collections});
         }
         smartFaqDisplayCount(newlyLoadedFAQs);
      }
   };

   useEffect(() => {
     if(availableFAQs && availableFAQs.length > 0) {
       let faqArr = [];
       availableFAQs.map((faq,i) => {
         if(i+1 <= smartFAQSettings.count) {
           faqArr.push({uid:faq.uid,collection:faq.collections});
         }
       });
       smartFaqDisplayCount(faqArr);
     }
   },[availableFAQs]);

   // ------------------------------

   return (
      <div className={`faqs-wrapper ${noResults ? 'no-results' : ''}`}>
         {
            (Object.keys(selectedSmartFAQ).length > 0 || availableFAQs.length > 0) &&
               <h3 className="smartFAQs__heading">SmartFAQs</h3>
         }

         {/* Selected FAQ suggestion*/}
         {
            suggestSmartFAQs.enabled && Object.keys(selectedSmartFAQ).length > 0 &&
               <SelectedSmartFAQ faq={selectedSmartFAQ} />
         }

         {/* Other FAQs */}
         {
            smartFAQSettings.enabled && availableFAQs.length > 0 &&
               <ul className="faqs-list" aria-label="SmartFAQs">
                  {
                     availableFAQs.map((faq, i) => {
                        if(i + 1 <= fAQsCount) {
                           return (
                              <li key={`faq-${i}`}>
                                 <FAQItem index={i} faq={faq} active={i === currentActive} toggleActive={() => toggleActive(i)} />
                              </li>
                           );
                        }
                     })
                  }
               </ul>
         }
      </div>
   );
};

// ------------------------------
function SelectedSmartFAQ({faq}) {
   const [voted, setVoted] = useState(0);

   const handleVoting = (action) => {
      if(action === 'upvote')
         setVoted(voted === 1 ? 0 : 1);
      else
         setVoted(voted === -1 ? 0 : -1);

      callSmartFAQAction({ uid: faq.uid, action });
   };

   useEffect(() => {
     callSmartFAQAction({ uid: faq.uid, action:"open" });
     let faqArr = [{uid:faq.uid, collection:faq.collections}];
     smartFaqDisplayCount(faqArr);
   },[]);

   // ------------------------------

   return (
      <div className="selected-faq">
         <p className="faq__title">
            {faq.question}
         </p>

         <p className="faq__answer">
            {faq.answer}
         </p>

         <a className="faq__url"
            href={faq.url}
            target="_blank"
            onClick={() => callSmartFAQAction({ uid: faq.uid, action: 'click' })}
         >
            {faq.url}
         </a>

         <div className="faq__feedback">
            <div className="button-wrapper">
               <button className={`upvote-btn ${voted === 1 ? 'active' : ''}`} onClick={() => handleVoting('upvote')}>
                  <i className="fa fa-thumbs-up" title="Upvote" />
                  <span className="sr-only">Upvote</span>
               </button>
               <span className="vote-count">{faq.upvote}</span>
            </div>
            <div className="button-wrapper">
               <button className={`downvote-btn ${voted === -1 ? 'active' : ''}`} onClick={() => handleVoting('downvote')}>
                  <i className="fa fa-thumbs-down" title="Downvote" />
                  <span className="sr-only">Downvote</span>
               </button>
               <span className="vote-count">{faq.downvote}</span>
            </div>
         </div>
      </div>
   );
}

export default SmartFAQsComponent;

SmartFAQsComponent.propTypes = {
   query: PropTypes.string,
   selectedSmartFAQ: PropTypes.object,
   noResults: PropTypes.bool
};

SelectedSmartFAQ.propTypes = {
   faq: PropTypes.object,
};
