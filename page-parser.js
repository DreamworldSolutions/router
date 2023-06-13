import queryString from 'query-string-esm';
import { match } from 'path-to-regexp';

import { defaultArrayFormatConfig } from "./global-config.js";

// lodash methods
import find from 'lodash-es/find.js';
import forIn from 'lodash-es/forIn.js';
import cloneDeep from 'lodash-es/cloneDeep.js';
import get from 'lodash-es/get.js';

/**
 * It parses given URL and creates page object from it.
 * 
 * @param {Array} pages application's pages URLs
 * @param {String} url url to be parsed
 * @returns {Object} parsed page object
 */
export const parsePage = function (pages, url) {
  return parseUrl(pages, url);
}

/**
 * It parses given URL and creates dialog object from it.
 * 
 * @param {Array} dialogs application's dialog URLs
 * @param {String} url url to be parsed
 * @returns {Object} parsed dialog object
 */
export const parseDialog = function (dialogs, url) {
  url = new URL(url);

  if (!url.hash) {
    return null;
  }

  return parseUrl(dialogs, `${url.origin}/${url.hash.substring(1)}`);
}

/**
 * Returns null if `url` is not matched with any url from `urls`. Otherwise returns parsed object.
 * @param {Array} urls
 * @param {String} url 
 * @returns {Object}
 */
const parseUrl = function (urls, url) {
  url = new URL(url);
  let params;

  let matchedPattern = find(urls, (urlPattern) => {
    params = isPatternMatched(urlPattern, url.pathname, url.search);
    return params ? true : false;
  });

  if (!matchedPattern) {
    return null;
  }

  matchedPattern = cloneDeep(matchedPattern);

  delete matchedPattern.pathPattern;
  delete matchedPattern.queryParams;
  delete matchedPattern.pathParams;

  return {
    ...matchedPattern,
    params: params
  };
}

/**
 * Returns null if path is not matched with the given urlPattern. otherwise returns parsed object
 * @param {String} urlPattern 
 * @param {String} path 
 * @param {String} query 
 * @returns {Object}
 */
const isPatternMatched = function (urlPattern, path, query) {

  // match path
  let parsePathFn = match(urlPattern.pathPattern.replace('#', '/'));
  let parsedPath = parsePathFn(path);

  if (!parsedPath) {
    return;
  }

  let config = defaultArrayFormatConfig();

  // parse query params
  let parsedQuery = queryString.parse(query, {
    ignoreQueryPrefix: true,
    arrayFormat: config.arrayFormat,
    arrayFormatSeparator: config.arrayFormatSeparator,
    parseNumbers: true,
    parseBooleans: true
  });

  return formatParams(parsedPath.params, parsedQuery, urlPattern);
}

const trimStr = (str) => {
  return str.trim ? str.trim() : str;
}

/**
 * It converts param's value in given data type and rename params based on given config
 * 
 * @param {Object} pathParams 
 * @param {Object} queryParams 
 * @param {Object} config 
 * @returns 
 */
const formatParams = function (pathParams, queryParams, config) {
  queryParams = { ...queryParams };
  pathParams = { ...pathParams };

  //Convert queryParam's data type based on given config
  forIn(queryParams, (value, key) => {
    const valueFn = get(config, `queryParams.${key}.type`, String);
    const isArray = get(config, `queryParams.${key}.array`);

    if (isArray) {
      if (!Array.isArray(value)) {
        queryParams[key] = Array(1).fill(value);
      }

      try {
        queryParams[key] = queryParams[key].map((param) => trimStr(valueFn(param)));
      } catch(e) {
        console.error(`router: formatParams: parsing failed. queryParam=${key}, value=`, queryParams[key]);
      }
      return;
    }

    try {
      queryParams[key] = trimStr(valueFn(queryParams[key]));
    } catch(e) {
      console.error(`router: formatParams: parsing failed. queryParam=${key}, value=`, queryParams[key]);
    }
  });

  // Rename query param keys based on given config
  forIn(config.queryParams, (value, key) => {
    if (queryParams[key] !== undefined && value.name && value.name !== key) {
      queryParams[value.name] = queryParams[key];
      delete queryParams[key];
    }
  });

  // convert path params into given data types
  forIn(config.pathParams, (value, key) => {
    if (pathParams[key]) {
      pathParams[key] = value(pathParams[key]);
    }
  });

  return {
    ...pathParams,
    ...queryParams
  }
}
