import React,{ useEffect, useState } from 'react';

import useSpeechToText from '../Hooks';

import micIcon from '../../images/mic.svg';
let microphoneOff = require("../../images/mic-off.png");
let microphoneOn = require("../../images/mic-on.png");
import * as defaults from '../../sb/Common/Defaults';
import PropTypes from 'prop-types';
import { UncontrolledTooltip } from 'reactstrap';

// import './App.css';

export default function VoiceSearch(props) {
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText
  } = useSpeechToText({
    continuous: false,
    crossBrowser: true,
    speechRecognitionProperties: { interimResults: true },
    timeout: 5000
  });
  const [MicSvg]=useState({
    micOn:(<svg width="19" height="27" viewBox="0 0 19 27" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="9.5" y1="21" x2="9.5" y2="26.7273" stroke="white"/>
    <line x1="4.06055" y1="26.499" x2="15.106" y2="26.499" stroke="white"/>
    <path d="M1.00833 9.51367C1.00833 9.51367 0.394692 21.0705 9.70151 21.0705C19.0083 21.0705 18.1901 9.51367 18.1901 9.51367" stroke="white"/>
    <rect x="4.56055" y="0.5" width="10.0455" height="17" rx="5.02273" stroke="white"/>
    </svg>),
    micOff:(<svg width="22" height="28" viewBox="0 0 22 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="10.5" y1="22" x2="10.5" y2="27.7273" stroke="white"/>
    <line x1="5.06055" y1="27.4989" x2="16.106" y2="27.4989" stroke="white"/>
    <path d="M2.00833 10.5137C2.00833 10.5137 1.39469 22.0705 10.7015 22.0705C20.0083 22.0705 19.1901 10.5137 19.1901 10.5137" stroke="white"/>
    <rect x="5.56055" y="1.5" width="10.0455" height="17" rx="5.02273" stroke="white"/>
    <line x1="0.394676" y1="0.69303" x2="21.3947" y2="27.693" stroke="white"/>
    </svg>    
    )
  })


  useEffect(() => {
    // console.log(results,error,interimResult,startSpeechToText,stopSpeechToText,"results");
    props.voiceSearch(results);
    },
  [results]);

  useEffect(() => {
    props.isRecording(isRecording);
  },[isRecording]);

  if (error) return <>
  {/*<p id="voiceError"><img src={microphoneOff} width="20px" height="20px"/>‍</p>
  <UncontrolledTooltip placement="bottom" target="voiceError">
        {error}
  </UncontrolledTooltip>*/}
  </>;

  return (
    <React.Fragment>
      <button className="VoiceSearch_Button"  aria-label="voicesearch button" onClick={isRecording ? stopSpeechToText : startSpeechToText}>
        {/* <img src={(isRecording) ? microphoneOn : microphoneOff} width="20px" height="20px" alt="microphone"/> */}
        {/* {/* {MicSvg.map((el,i)=>(<>{el.micOn}</>))} */}
        {isRecording ? MicSvg.micOn : MicSvg.micOff}
      </button> 

    </React.Fragment>
  );
}

VoiceSearch.propTypes = {
  isRecording:PropTypes.func,
  voiceSearch:PropTypes.func
};
