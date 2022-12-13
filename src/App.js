import React, { Component, Fragment } from 'react';
import * as qs from 'query-string';
import * as defaults from './sb/Common/Defaults';
import axios from 'axios';
import { history } from './sb/low_level_components/custom_history';
import SearchComponent from './sb/SearchInput/SearchInputComponent';
window.smartSuggest = {};

class App extends Component {
  constructor(){
    super();
     this.state = {
       response: {},
       isLoading: false,
       actualQuery: "",
       settingsResponse:{},
       selectedSmartFAQ: {},
     };
     this.resetActualQuery = this.resetActualQuery.bind(this);
     this.saveSelectedSmartFAQ = this.saveSelectedSmartFAQ.bind(this);
   }

   componentWillMount() {
     axios.get(defaults.pluginDomain+"/ui/v1/search/settings" )
      .then((response)=>{
        window.smartSuggest = response.data;
        this.setState({
          settingsResponse : response.data
        });
      })
      .catch(err=>err);
   }

   componentDidUpdate() {
    window.onpopstate = e => {
      this.saveSelectedSmartFAQ({});
    };
  }

  resetActualQuery(){
     this.setState({
       actualQuery:""
     });
   }

   saveSelectedSmartFAQ(faqObj) {
    this.setState({ selectedSmartFAQ: { ...faqObj } });
  }

  render(){
    let {response,selectedSmartFAQ} = this.state;
    return(
      <Fragment>
          <SearchComponent isLoading={false} resetActualQuery={this.resetActualQuery} query="" 
          value={this.state.settingsResponse}
          selectedSmartFAQ={selectedSmartFAQ}
          saveSelectedSmartFAQ={this.saveSelectedSmartFAQ}/>
        </Fragment>
    );
  }
}

export default App;
