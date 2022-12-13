import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { callSmartFAQAction } from '../Common/SbCore';

const FAQItem = ({ index, faq, active, toggleActive }) => {
    const [voted, setVoted] = useState(0);
    
    const handleVoting = action => {
       if(action === 'upvote') {
          setVoted(voted === 1 ? 0 : 1);
       } else {
          setVoted(voted === -1 ? 0 : -1);
       }
    };
 
    const handleClick = action => {
       const actionParameter = { uid: faq.uid, action };
 
       if(action !== '')
          callSmartFAQAction(actionParameter);
 
       if(action === 'open' || action === '') {
          toggleActive();
       } else if(action === 'upvote' || action === 'downvote') {
          handleVoting(action);
       }
    };
 
    faq.description = new DOMParser().parseFromString(faq.description, 'text/html').body.textContent;
 
    return (
       <div className={`faq ${active ? 'open' : ''}`}>
          <button className="faq__header"
             onClick={() => active ? handleClick('') : handleClick('open')}
             aria-expanded={active}
             aria-controls={`faq${index}`}
          >
             <span className="faq__title" dangerouslySetInnerHTML={{ __html: faq.question }} />
          </button>
         {
            active &&
               <div id={`faq${index}`}>
                  <div className="faq__body">
                     <p className="faq__answer" dangerouslySetInnerHTML={{ __html: faq.answer }} />
                     <a className="faq__url" href={faq.url} target="_blank" onClick={() => handleClick('click')}>{faq.url}</a>
                  </div>

                  <div className="faq__feedback">
                     <div className="button-wrapper">
                        <button className={`upvote-btn ${voted === 1 ? 'active' : ''}`} onClick={() => handleClick('upvote')}>
                           <i className="fa fa-thumbs-up" title="Upvote" />
                           <span className="sr-only">Upvote</span>
                        </button>
                        <span className="vote-count">{faq.upvote}</span>
                     </div>
                     <div className="button-wrapper">
                        <button className={`downvote-btn ${voted === -1 ? 'active' : ''}`} onClick={() => handleClick('downvote')}>
                           <i className="fa fa-thumbs-down" title="Downvote" />
                           <span className="sr-only">Downvote</span>
                        </button>
                        <span className="vote-count">{faq.downvote}</span>
                     </div>
                  </div>
               </div>
         }
       </div>
    );
 };

 export default FAQItem;

 FAQItem.propTypes = {
    index: PropTypes.number,
    faq: PropTypes.object,
    active: PropTypes.bool,
    toggleActive: PropTypes.func
 };