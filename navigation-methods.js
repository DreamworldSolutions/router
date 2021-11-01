import { urls, currentDialog, currentPage } from './index';
import { compile, parse } from 'path-to-regexp';
import queryString from 'query-string-esm';

// lodash methods
import forEach from 'lodash-es/forEach';
import omit from 'lodash-es/omit';
import forIn from 'lodash-es/forIn';
import find from 'lodash-es/find';
import cloneDeep from 'lodash-es/cloneDeep';

let fallbackCallback;

/**
 * Navigate to given url
 * 
 * @param {String} url 
 * @param {Boolean} bReplace - if true then change url via replaceState otherwise via pushState
 */
export const navigate = (url, bReplace) => {
  if (!url) {
    console.warn('Router:navigate(): url is not provided');
    return;
  }

  let currentPageIndex = getCurrentPageIndex();

  if (bReplace) {
    window.history.replaceState({ index: currentPageIndex }, '', url);
  } else {
    let newPageIndex = (!!currentPageIndex) ? currentPageIndex + 1 : 1;

    window.history.pushState({ index: newPageIndex }, '', url);
  }

  window.dispatchEvent(new Event('location-changed'));
}

/**
 * Use to register fallback function for `back` action.
 * Fallback callback is called when back action is perform and there is no any previous page is available
 * 
 * @param {Function} fallback 
 */
export const registerFallbackCallback = (fallback) => {
  fallbackCallback = fallback;
}

/**
 * Used to navigate on previous page. 
 * If there is no any previous page is available then it will call fallback handler. otherwise it calls history API's `back` method.
 */
export const back = () => {
  let currentPageIndex = getCurrentPageIndex();

  if (!currentPageIndex && fallbackCallback) {
    fallbackCallback();
    return;
  }

  window.history.back();
}

/*------------------------- START: Page navigation methods ----------------------------*/

/**
 * Used to navigate on the given page name
 * 
 * @param {String} pageName name of the page to navigate on
 * @param {Object} pageParams key/value pair of the params. e.g. {companyId: 'd64bd8f3ef4463d048963790dcf53193'}
 * @param {Boolean} replace if true then change url via replaceState otherwise via pushState
 */
export const navigatePage = (pageName, pageParams, replace = false) => {
  let url = buildUrl(urls.pages, pageName, pageParams);
  navigate(url, replace);
}

/**
 * Used to update current URL's query params
 * 
 * @param {Object} pageParams key/value pair of the params.
 * @param {Boolean} replace if true then change url via replaceState otherwise via pushState
 */
export const setPageParams = (pageParams, replace) => {
  let page = cloneDeep(currentPage);
  page = {
    ...page,
    params: {
      ...page.params,
      ...pageParams
    }
  };

  navigatePage(page.name, page.params, replace);
}

/**
 * Used to get URl of the given pageName
 * 
 * @param {String} pageName name of the page name to get URL of
 * @param {Object} pageParams key/value pair of the params. e.g. {companyId: 'd64bd8f3ef4463d048963790dcf53193'}
 * @returns 
 */
export const buildPageURL = (pageName, pageParams) => {
  return buildUrl(urls.pages, pageName, pageParams);
}

/*------------------------- END: Page navigation methods ----------------------------*/

/*------------------------- START: Dialog navigation methods ----------------------------*/

/**
 * Used to navigate on the given page name
 * 
 * @param {String} dialogName name of the dialog to navigate on
 * @param {Object} dialogParams key/value pair of the params. e.g. {companyId: 'd64bd8f3ef4463d048963790dcf53193'}
 * @param {Boolean} replace if true then change url via replaceState otherwise via pushState
 */
export const navigateDialog = (dialogName, dialogParams, replace = false) => {
  let url = buildUrl(urls.dialogs, dialogName, dialogParams);
  navigate(`${window.location.pathname}${window.location.search}${url}`, replace);
}

/**
 * Used to update current URL's query params
 * 
 * @param {Object} dialogParams key/value pair of the params.
 * @param {Boolean} replace if true then change url via replaceState otherwise via pushState
 */
export const setDialogParams = (dialogParams, replace) => {
  let dialog = JSON.parse(JSON.stringify(currentDialog));
  dialog = {
    ...dialog,
    params: {
      ...dialog.params,
      ...dialogParams
    }
  };

  navigateDialog(dialog.name, dialog.params, replace);
}

/**
 * Used to get URl of the given pageName
 * 
 * @param {String} dialogName name of the dialog to get URL of
 * @param {Object} dialogParams key/value pair of the params. e.g. {companyId: 'd64bd8f3ef4463d048963790dcf53193'}
 * @returns 
 */
export const buildDialogURL = (dialogName, dialogParams) => {
  return buildUrl(urls.dialogs, dialogName, dialogParams);
}

/**------------------------- END: Dialog navigation methods ----------------------------*/

/**
 * Builds URL of the given page/dialog name
 * 
 * @param {Array} urls page/dialogs URLs
 * @param {String} name name of the page/dialog
 * @param {Object} params key/value pair of the params
 * @returns {String} Url of the given page. if given page is not found in urls, returns `not-found`
 */
const buildUrl = (urls, name, params) => {
  let matchedPattern = find(urls, (urlPattern) => {
    return urlPattern.name === name;
  });

  if (!matchedPattern) {
    return;
  }

  // Compute path URL
  let compileFn = compile(matchedPattern.pathPattern); // compile path
  let pathUrl = compileFn(params);

  // compute query string
  let pathParams = getPathParams(matchedPattern.pathPattern);
  let queryParams = omit(params, pathParams);

  return computeUrl(pathUrl, queryParams, matchedPattern.queryParams);
}

/**
 * Returns path params's object
 * @param {String} pathPattern 
 * @returns {Object} parsed pathParams
 */
const getPathParams = (pathPattern) => {
  let tokens = parse(pathPattern);
  let pathParams = [];

  forEach(tokens, (token) => {
    if (token && token.name) {
      pathParams.push(token.name);
    }
  });

  return pathParams;
}

/**
 * It computes URL using given path url and query params
 * 
 * @param {String} pathUrl 
 * @param {Object} queryParams 
 * @param {Object} queryParams 
 */
const computeUrl = (pathUrl, queryParams, queryConfig) => {
  if (queryParams && !Object.keys(queryParams).length) {
    return pathUrl;
  }

  // Rename query params based on config
  forIn(queryConfig, (value, key) => {
    if (queryParams[value.name]) {
      queryParams[key] = queryParams[value.name];
      delete queryParams[value.name];
    }
  });

  let query = queryString.stringify(queryParams);

  return `${pathUrl}?${query}`;
}

/**
 * @returns {Number} Current page index from history current `state`.
 */
const getCurrentPageIndex = () => {
  let currentState = window.history.state || {};

  return currentState.index || 0;
}
