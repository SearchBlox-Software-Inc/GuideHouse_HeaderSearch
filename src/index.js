import React from "react";
import ReactDOM from "react-dom";
import { Router, Route } from 'react-router-dom';
import { history } from './sb/low_level_components/custom_history';

import "./index.css";
import 'babel-polyfill';
import "./fw/css/font-awesome.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import App from "./App";

ReactDOM.render(
    <Router history={history}>
      <Route path="*" component={App}/>
    </Router>, document.getElementById("header_root"));
