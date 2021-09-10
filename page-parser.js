import find from 'lodash-es/find';
import forIn from 'lodash-es/forIn';
import cloneDeep from 'lodash-es/cloneDeep';
import { match } from 'path-to-regexp';
import { parse as parseQuery } from './query-string.js';

/**
 * It parses given URL and creates page object from it.
 * 
 * @param {Array} pages application's pages URLs
 * @param {String} url url to be parsed
 * @returns {Object} parsed page object
 */
export const parsePage = function(pages, url){
  return parseUrl(pages, url); 
}

/**
 * It parses given URL and creates dialog object from it.
 * 
 * @param {Array} dialogs application's dialog URLs
 * @param {String} url url to be parsed
 * @returns {Object} parsed dialog object
 */
export const parseDialog = function(dialogs, url){
  url = new URL(url);

  if(!url.hash){
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
const parseUrl = function(urls, url){
  url = new URL(url);
  let params;

  let matchedPattern = find(urls, (urlPattern) => {
    params = isPatternMatched(urlPattern, url.pathname, url.search);
    return params ? true : false;
  });

  if(!matchedPattern){
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
const isPatternMatched = function(urlPattern, path, query){

  // match path
  let parsePathFn = match(urlPattern.pathPattern.replace('#', '/'));
  let parsedPath = parsePathFn(path);

  if(!parsedPath){
    return;
  }

  // parse query params
  let parsedQuery = parseQuery(query, {
    ignoreQueryPrefix: true,
    arrayFormat: 'comma',
    parseNumbers: true,
    parseBooleans: true
  });

  // Rename query param keys based on given config
  forIn(urlPattern.queryParams, (value, key) => {
    if(parsedQuery[key] && value.name){
      parsedQuery[value.name] = parsedQuery[key];
      delete parsedQuery[key];
    }
  })

  return {
    ...parsedPath.params,
    ...parsedQuery
  }
}
