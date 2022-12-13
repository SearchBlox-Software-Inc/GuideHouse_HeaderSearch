import * as defaults from './Defaults';
import * as qs from 'query-string';
import axios from 'axios';
import * as moment from 'moment';
import { history } from '../low_level_components/custom_history';
import _ from 'lodash';


// export var urlParameters = {};
/*
| getSBResponse function checks the url parameters and
- use same paarmaeters to send request to searchblox server
| and returns the 'PROMISE'
- 'AXIOS' library is used for AJAX requests
*/

export const getAutoSuggest = (query) => {
  let autosuggestId = "";
  let urlParameters = Object.assign({}, qs.parse(window.location.search));
  let colArray = [];
  let colString = "";
  if(defaults.defaultCollections.length > 0){
    colArray = defaults.defaultCollections.slice();
  }
  else if(urlParameters.col && urlParameters.col.constructor === Array) {
    colArray = urlParameters.col.slice();
  }
  else if(urlParameters.col && urlParameters.col.constructor === String) {
    colArray.push(urlParameters.col);
  }
  if(colArray !== null && colArray !== undefined && colArray !== "" && colArray.length > 0) {
    colArray.map((value,key) => {
      colString = colString + "&col=" + value;
    });
  }

  if(window.smartSuggest.SmartSuggest.length > 0) {
    let smartArray = [];
    for(let i=0;i<window.smartSuggest.SmartSuggest.length;i++) {
      if(window.smartSuggest.SmartSuggest[i].collectionID === parseInt(urlParameters.col)) {
        return axios.get(window.smartSuggest.SmartSuggest[i].endpoint+query)
        .then((response)=>{
          return response;
        })
        .catch((error)=>{
          return error;
        });
      }
      else if(window.smartSuggest.SmartSuggest[i].collection === urlParameters.cname) {
        return axios.get(window.smartSuggest.SmartSuggest[i].endpoint+query)
        .then((response)=>{
          return response;
        })
        .catch((error)=>{
          return error;
        });
      }
    }
  }
  if(defaults.smartAutoSuggestSettings.enable !== "" && defaults.smartAutoSuggestSettings.enable && window.smartSuggest.SmartSuggest.length === 0){
    return axios.get(defaults.smartAutoSuggestSettings.pluginDomain+"/SmartSuggest?q=" + query+"&cname="+defaults.smartAutoSuggestSettings.cnameAutoSuggest+"&limit="+defaults.smartAutoSuggestSettings.limit+"&lang="+defaults.smartAutoSuggestSettings.langForSuggest)
    .then((response)=>{
      return response;
    })
    .catch((error)=>{
      return error;
    });
  }
  else {
    return axios.get(defaults.pluginDomain + "/rest/v2/api/autocomplete?limit="+defaults.autoSuggestLimit+"&query=" + query+colString)
    .then((response)=>{
      return response;
    })
    .catch((error)=>{
      return error;
    });
  }
};

export const getTrendingData = () => {
  const cname = defaults.trendingSearch.cname;

  let pluginDomain = defaults.pluginDomain;
  const pd = document.getElementById("sb_plugin_domain");
  if (pd !== undefined && pd !== null && pd !== "") {
    pluginDomain = pd.value;
  }
  return axios.get(pluginDomain + "/rest/v2/api/search?query=*&xsl=json&sort=alpha&sortdir=asc&pagesize=" + defaults.trendingSearch.limit + "&cname=" + cname, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("searchToken")
      }
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      if (error.response && error.response.data) {
        return error.response.data;
      } else {
        return error;
      }
    });
};

export const getSuggestClickCount = (parameters) => {
  let urlParameters = Object.assign({}, qs.parse(window.location.search));
  if(Object.keys(parameters).length !== 0){
    if(parameters.query.indexOf('"') >= 0) {
      parameters.query = parameters.query.replace(/['"]+/g, '');
    }
    let clickObj = {
        query: decodeURIComponent(parameters.query),
        suggestion:parameters.suggest
    };

    return axios.post(defaults.pluginDomain + "/ui/v1/analytics/suggest",clickObj)
    .then((response)=>{
      return response;
    })
    .catch((error)=>{
      return error;
    });
  }
};

export const getFeaturedResultClickCount = (parameters) => {
  let urlParameters = Object.assign({}, qs.parse(window.location.search));
  if(Object.keys(parameters).length !== 0){
    parameters.query = urlParameters.query;

    let clickObj = {
        uid: parameters.uid,
        query: parameters.query,
    };
      return axios.post(defaults.pluginDomain + "/ui/v1/analytics/fr",clickObj)
      .then((response)=>{
        return response;
      })
      .catch((error)=>{
        return error;
      });
    }
};

export const smartFaqDisplayCount = (faqArr) => {
  if(faqArr.length > 0){
    let urlParameters = Object.assign({}, qs.parse(window.location.search));
    let clickObj = {
        smartfaq: faqArr,
        query: urlParameters.query,
        pcode:localStorage.getItem("pcode"),
        action:"show"
    };
     return axios.post(defaults.pluginDomain + "/rest/v2/api/smart-faq/impression",clickObj)
       .then(response => response)
       .catch(error => error);
    }
};

export const getInitialUrlParameters = (query) => {
  let urlParameters = Object.assign({}, qs.parse(window.location.search));
  let col = document.getElementById("sb_col");
  let cname = document.getElementById("sb_cname");
  let filter = document.getElementById("sb_filter");
  let sb_query = document.getElementById("sb_query");
  let sb_page = document.getElementById("sb_page");
  let sb_sort = document.getElementById("sb_sort");
  let sb_default = document.getElementById("sb_default");
  let sb_tunetemplate = document.getElementById("sb_tunetemplate");
  let sb_autosuggest = document.getElementById("sb_autosuggest");
  // let sb_security = document.getElementById("sb_security");

  // Function to parse the facets in facet.json
  let parseFacetsForSearch = ()=>{ // ----------parseFacetsForSearch start ----------------------
    let facets = defaults.facets;
    let advancedFilters = (defaults.advancedFilters)?defaults.advancedFilters:{};
    if(facets.length >= 1){
      urlParameters['facet.field'] = [];
      for(let i in facets){
        urlParameters['facet.field'].push(facets[i].field);
        if(facets[i].dateRange === undefined){
          urlParameters[`f.${facets[i].field}.size`] = facets[i].size;
        }else{
          urlParameters[`f.${facets[i].field}.range`] = [];
          urlParameters[`f.${facets[i].field}.range`] = facets[i].dateRange.map((range)=>{
            return "[" + moment().subtract(range.value, range.calendar).format('YYYY-MM-DDTHH:mm:ss') + "TO*]";
          });
        }
      }
    }
    if(advancedFilters.select){
      for(let i in advancedFilters.select){
        if(urlParameters['facet.field'].indexOf(advancedFilters.select[i].field) === -1){
          urlParameters['facet.field'].push(advancedFilters.select[i].field);
          urlParameters[`f.${advancedFilters.select[i].field}.size`] = advancedFilters.select[i].size;
        }
      }
    }
    if(advancedFilters.input){
      for(let i in advancedFilters.input){
        if(urlParameters['facet.field'].indexOf(advancedFilters.input[i].field) === -1){
          urlParameters['facet.field'].push(advancedFilters.input[i].field);
          urlParameters[`f.${advancedFilters.input[i].field}.size`] = advancedFilters.input[i].size;
        }
      }
    }
    if(advancedFilters.date){
      for(let i in advancedFilters.date){
        if(urlParameters['facet.field'].indexOf(advancedFilters.date[i].field) === -1){
          urlParameters['facet.field'].push(advancedFilters.date[i].field);
        }
      }
    }
  }; //------------------------parseFacetsForSearch end --------------------

  // if(urlParameters.mlt_id)urlParameters = {};
  if(Object.keys(urlParameters).length === 0){
    // CONDITION FOR DEFAULT FACETS ON INITIAL PAGE LOAD
    parseFacetsForSearch();
    (query === undefined || query === '' || query === null)?(urlParameters.query = '*'):(urlParameters.query = query);
    urlParameters.page = 1;
    // urlParameters.pagesize = defaults.pageSize;
    if(defaults.defaultCname !== "") {
      urlParameters.cname = defaults.defaultCname;
    }
    urlParameters.adsDisplay = defaults.adsDisplay;
    // urlParameters.adsCount = defaults.featuredResultsCount;
    defaults.sortButtons.map((sortVal,key) => {
      if(sortVal.sort) {
        urlParameters.sort = sortVal.field;
        urlParameters.sortdir = sortVal.sortDir ? sortVal.sortDir : "desc";
      }
      if(sortVal.sort1) {
        urlParameters.sort1 = sortVal.field;
        urlParameters.sortdir1 = sortVal.sortDir ? sortVal.sortDir : "desc";
      }
    });
    urlParameters.relatedQuery = defaults.relatedQuery;
    // urlParameters.security = defaults.security;
    urlParameters.topQuery = defaults.topQuery;
    urlParameters.tunetemplate = defaults.tuneTemplate;
    urlParameters.autoSuggestDisplay = defaults.showAutoSuggest;
    urlParameters.col = defaults.defaultCollections.slice();
    if(defaults.defaultType !== ""){
      urlParameters.default = defaults.defaultType;
    }
    if(localStorage.getItem("searchToken")===null || localStorage.getItem("searchToken")===undefined || localStorage.getItem("searchToken")===""){
      urlParameters.public = true;
    }
    else if(localStorage.getItem("searchToken")!==null && localStorage.getItem("searchToken")!==undefined && localStorage.getItem("searchToken")!==""){
      if(urlParameters.public){
        delete urlParameters.public;
      }
    }
  }else{
    if(sb_query !== undefined && sb_query !== null && sb_query !== ""){
      urlParameters.query = sb_query.value;
    }
    else {
      urlParameters.query = query;

    }
  }
  urlParameters.pagesize = defaults.pageSize;
  urlParameters.query = encodeURIComponent(urlParameters.query);
  if(cname !== undefined && cname !== null && cname !== "" && cname.value !== ""){
    urlParameters.cname = [];
    let cnames = cname.value.split(",");
    for(let i = 0, len = cnames.length; i< len; i++){
      urlParameters.cname.push(cnames[i].trim());
    }
  }
  if(col !== undefined && col !== null && col !== "" && col.value !== ""){
    urlParameters.col = [];
    let cols = col.value.split(",");
    for(let i = 0, len = cols.length; i< len; i++){
      urlParameters.col.push(cols[i].trim());
    }
  }
  if(filter !== undefined && filter !== null && filter !== ""){
    urlParameters.filter = filter.value;
  }
  if(sb_page !== undefined && sb_page !== null && sb_page !== ""){
    let pageValues = sb_page.value.split("|");
    urlParameters.page = pageValues[0];
    urlParameters.pagesize = pageValues[1];
  }
  if(sb_default !== undefined && sb_default !== null && sb_default !== ""){
    urlParameters.default = sb_default.value;
  }
  if(sb_tunetemplate !== undefined && sb_tunetemplate !== null && sb_tunetemplate !== ""){
    if(sb_tunetemplate.value.trim()!==""){
      urlParameters.tunetemplate = sb_tunetemplate.value;
    }
  }
  if(sb_autosuggest  !== undefined && sb_autosuggest !== null && sb_autosuggest !== ""){
    urlParameters.autoSuggestDisplay = sb_autosuggest.value;
  }
  // if(sb_security  !== undefined && sb_security !== null && sb_security !== ""){
  //   urlParameters.autoSuggestDisplay = sb_security.value;
  // }
  if(sb_sort !== undefined && sb_sort !== null && sb_sort !== ""){
    let sortValues = sb_sort.value.split("|");
    urlParameters.sort1 = sortValues[0];
    urlParameters.sortdir1 = sortValues[1];
  }
  return urlParameters;
};

export const clearAllFilters = (urlParameters) => {
    let facetFields = [];
    facetFields = Object.assign([], defaults.facets);
    let customDateField = "";
    customDateField = defaults.customDateSettings.customDateField;
    delete urlParameters['facet.field'];
    urlParameters['facet.field'] = [];
    for(let i=0, len = facetFields.length; i<len; i++){
      urlParameters['facet.field'].push(facetFields[i].field);
      if(`${facetFields[i]['field']}` !== "Lang" && `${facetFields[i]['field']}` !== "language") {
        delete urlParameters[`f.${facetFields[i]['field']}.filter`];
      }
      if(urlParameters[`f.${customDateField}.filter`]){
        delete urlParameters[`f.${customDateField}.filter`];
        delete urlParameters[`f.${customDateField}.range`];
      }
      if(facetFields[i].dateRange){
        urlParameters[`f.${facetFields[i].field}.range`] = [];
        urlParameters[`f.${facetFields[i].field}.range`] = facetFields[i].dateRange.map((range)=>{
          return "[" + moment().subtract(range.value, range.calendar).format('YYYY-MM-DDTHH:mm:ss') + "TO*]";
        });
      }
    }

    if(urlParameters.customDate){
      delete urlParameters.customDate;
    }
    urlParameters.page=1;
    return urlParameters;
};

export const getDocumentClickCount = (parameters) => {
  let urlParameters = Object.assign({}, qs.parse(window.location.search));
  if(Object.keys(parameters).length !== 0){
    parameters.query = urlParameters.query;
    parameters.title = new DOMParser().parseFromString(parameters.title, 'text/html').body.textContent;
    if(localStorage.getItem("pcode") !== null && localStorage.getItem("pcode") !== "" && localStorage.getItem("pcode") !== undefined) {
      parameters.pcode = localStorage.getItem("pcode");
    }
    if(urlParameters.pagesize){
      parameters.pagesize = urlParameters.pagesize;
    }
    else{
      parameters.pagesize = 10;
    }
    let clickObj = {
        collection: parameters.col,
        query: parameters.query,
        title:parameters.title,
        uid:parameters.uid,
        url:parameters.url,
        pcode:parameters.pcode,
        pos:parameters.no,
        page:urlParameters.page,
        pageSize:parameters.pagesize
    };
    return axios.post(defaults.pluginDomain + "/ui/v1/analytics/click",clickObj)
    .then((response)=>{
      return response;
    })
    .catch((error)=>{
      return error;
    });
  }
};

export const getEmailViewer = (parameters) => {
  if(Object.keys(parameters).length !== 0){
    return axios.get(defaults.pluginDomain+"/ui/v1/email/view?url="+parameters.url+"&col="+parameters.col)
    .then((response)=>{
      return response;
    })
    .catch((error)=>{
      return error;
    });
  }
};

export const getResults = (urlParameters) => {
  if(urlParameters.query !== "") {
  let keyRegex = /^f\.[A-z]+\.filter$/g;
  let dateRegex = /^\[[0-9]{4}/g;
  Object.keys(urlParameters).map(key => {
    if(keyRegex.test(key) && !dateRegex.test(urlParameters[key])){
      if(urlParameters[key].constructor === Array){
          urlParameters[key] = urlParameters[key].map(val => {
            return encodeURIComponent(decodeURIComponent(decodeURIComponent(val)));
          });
        }else{
          urlParameters[key] = encodeURIComponent(decodeURIComponent(decodeURIComponent(urlParameters[key])));
        }
    }
  });
  let paramsOrder = ['query', 'page', 'pagesize', 'sort', 'sortdir','language'];
  let firstString = {}, secondString = {};
  for(let param in urlParameters){
    (paramsOrder.indexOf(param) > -1)?(firstString[param] = urlParameters[param]):(secondString[param] = urlParameters[param]);
  }
  let params = qs.stringify(firstString, {sort: (m, n)=>paramsOrder.indexOf(m) >= paramsOrder.indexOf(n)}) + '&' + qs.stringify(secondString);
  let decodedPramsString = decodeURIComponent(params);
   history.push(`?${decodedPramsString}`);
 }
};

export const callSmartFAQAction = payload => {
  const urlParameters = Object.assign({}, qs.parse(window.location.search));

  if(Object.keys(payload).length !== 0) {
    payload.query = urlParameters.query;

    const pcode = localStorage.getItem('pcode');

    if(pcode) {
      payload.pcode = pcode;
    }

    return axios.post(`${defaults.pluginDomain}/rest/v2/api/smart-faq/action`, payload)
      .then(response => response)
      .catch(error => error);
  }
};

export const getSmartFAQS = (query, limit) => {
  const { pluginDomain, defaultCollections } = defaults;
  const collectionParameter = defaultCollections.length ? `&col=${[...defaultCollections]}` : '';

  return axios.get(`${pluginDomain}/rest/v2/api/smart-faq/list?status=active&query=${query}${collectionParameter}&size=${limit}`)
    .then(response => response)
    .catch(error => error);
};

export const getSelectedSmartFAQ = uid => {
  return axios.get(`${defaults.pluginDomain}/rest/v2/api/smart-faq/get/${uid}`)
    .then(response => response)
    .catch(error => error);
};
