let facetSettings = document.getElementById("sb_facet_settings");
window.autoSuggestObject = {};
let autoSuggestSettings = document.getElementById("sb_autosuggest");
if(autoSuggestSettings){
  window.autoSuggestObject.showAutoSuggest = autoSuggestSettings.value;
}
window.inputFacets = [];
if (facetSettings) {
    let requiredFacetsFields = Object.keys(facetSettings.dataset);
    let facetFilters = [];
    let filterDisplay = {};
    for (let i = 0, len = requiredFacetsFields.length; i < len; i++) {
        let facetFilter = {};
        let fieldValue = facetSettings.dataset[requiredFacetsFields[i]];
        let field = requiredFacetsFields[i];
        let fieldValuesArray = fieldValue.split("|");
        facetFilter["field"] = field;
        if (fieldValuesArray[0]) {
            facetFilter["display"] = fieldValuesArray[0];
            filterDisplay[field] = fieldValuesArray[0];
        } else {
            facetFilter["display"] = "";
            filterDisplay[field] = "";
        }
        if (fieldValuesArray[1]) {
            if (parseInt(fieldValuesArray[1]) > 0) {
                facetFilter["size"] = fieldValuesArray[1];
            } else {
                facetFilter["dateRange"] = [{
                        "name": "Last 24 hours",
                        "calendar": "days",
                        "value": "1"
                    },
                    {
                        "name": "Past Week",
                        "calendar": "days",
                        "value": "7"
                    },
                    {
                        "name": "Past Month",
                        "calendar": "months",
                        "value": "1"
                    },
                    {
                        "name": "Past Year",
                        "calendar": "years",
                        "value": "1"
                    }
                ];
            }
        }
        facetFilters.push(facetFilter);
    }
    window.inputFacets = facetFilters;
}

window.facets = {
    "facets": [{
            "field": "colname",
            "display": "Collection Name",
            "size": "100"
        },
        {
            "field": "contenttype",
            "display": "File Type",
            "size": "100"
        },
        {
            "field": "keywords",
            "display": "keywords",
            "size": "100"
        },
        {
            "field": "lastmodified",
            "display": "Last Modified",
            "dateRange": [{
                    "name": "Last 24 hours",
                    "calendar": "days",
                    "value": "1"
                },
                {
                    "name": "Past Week",
                    "calendar": "days",
                    "value": "7"
                },
                {
                    "name": "Past Month",
                    "calendar": "months",
                    "value": "1"
                },
                {
                    "name": "Past Year",
                    "calendar": "years",
                    "value": "1"
                }
            ]
        }
    ],
    "customDateSettings": {
        "customDateField": "lastmodified",
        "customDateEnable": true,
        "customDateDisplayText": "Filter By Date"
    },
    "collection": [],
    "sortBtns": [{
            "field": "date",
            "display": "Sort By Date",
            "sort":false,
            "sort1": false,
            "sortDir":"desc"
        },
        {
            "field": "relevance",
            "display": "Sort By Relevance",
            "sort":false,
            "sort1": true,
            "sortDir":"desc"
        },
        {
            "field": "mrank",
            "display": "Sort By Relevance with MRank",
            "sort":true,
            "sort1": false,
            "sortDir":"desc"
        },
    ],
    "facetFiltersOrder": [
        "colname", "contenttype", "keywords"
    ],
    "facetsFiltersDisplay": true,
    "facetFiltersType": "AND",
    "matchAny": "off",
    "pageSize": "20",
    "showAutoSuggest": true,
    "autoSuggestLimit": "5",
    "suggestSearch": true,
    "smartAutoSuggestSettings": {
        "enable": true,
        "pluginDomain": "https://smartsuggest.searchblox.com",
        "cnameAutoSuggest": "guidehouse",
        "limit": "5",
        "langForSuggest": "en"
    },
    "defaultCname": "",
    "adsDisplay": true,
    "featuredResultsCount": "3",
    "urlDisplay": false,
    "relatedQuery": false,
    "relatedQueryFields": {
        "apikey": "",
        "field": "content",
        "operator": "and",
        "limit": "5",
        "terms": "10",
        "type": "phrase",
        "col": "",
    },
    "smartFAQSettings": {
      "enabled": false,
      "count": 5,
      "loadMoreCount": 2,
      "limit": 10
    },
    "suggestSmartFAQs": {
        "enabled": false,
        "limit": 3
    },
    "trendingSearch": {
        "enabled": true,
        "cname":"trending_guidehouse",
        // "cname":"abc_trending",
		"limit": "5"
    },
    "topQuery": true,
    "topQueryFields": {
        "apikey": "",
        "col": "",
        "limit": "5",
    },
    "dataToBeDisplayed": {
        "1": {
            "title": "Title",
            "description": "Description"
        },
        "other": {
            "description": "Description"
        },
        "displayAll": true
    },
    "tuneTemplate": "WEB",
    "voiceSearch": false,
    "voiceSearchAPI": "",
    "debug": false,
    "defaultType": "AND",
    "apikey": "",
    "autologout": true,
    // "pluginDomain": "https://abc-search-alb-v00-183445380.ca-central-1.elb.amazonaws.com",
    "pluginDomain": "https://smartfaqs.searchblox.com",
    "searchUrlRedirect":"/search.html"
};
