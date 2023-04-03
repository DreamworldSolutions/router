import { parsePage, parseDialog } from './page-parser.js';
import reducer from './reducer.js';
import { isServer } from '@dreamworld/pwa-helpers/lit.js'

export * from './navigation-methods.js';
export * from './global-config.js';
export const ROUTE_CHANGED = 'ROUTER_ROUTE_CHANGED';

export let urls = [];
export let currentPage = {};
export let currentDialog = {};

let store;

/**
 * initializes routing flow
 * 
 * @param {Array} aUrls application URLs. format: [{module: $moduleName, subPage: $pageName, pattern: '/:companyId/modulName/subPageName\\?date=:date}]
 * @param {Object} oStore redux store object
 * @param {String} url Current URL. Its used only for SSR.
 */
export const init = (aUrls, oStore, url) => {
  if(isServer && !url) {
    return;
  }

  store = oStore;
  urls = aUrls;
  addReducer();

  if(!isServer){
    // Bind events to handler URL changes
    window.addEventListener('location-changed', handleRoute);
    window.addEventListener('popstate', handleRoute);
    document.body.addEventListener('click', clickHandler);
  }
  

  handleRoute(url);
}

/**
 * Whenever url is changed, this function is invokes.
 * It's parses current URL and stores page/dialog object in the redux store
 * @param {String} url - current url
 */
const handleRoute = (url) => {
  url = isServer ? url : window.location.href;
  currentPage = parsePage(urls.pages, url);
  currentDialog = parseDialog(urls.dialogs, url);

  dispatch(currentPage, currentDialog);
}

/**
 * 
 * @param {Object} page 
 * @param {Object} dialog 
 */
const dispatch = function (page, dialog) {
  page = page || {};
  dialog = dialog || {};

  store.dispatch({
    type: ROUTE_CHANGED,
    page,
    dialog
  });
}

const addReducer = function () {
  if (!store) {
    console.error('router: addReducer(): Store is not provided');
    return;
  }

  store.addReducers({
    router: reducer
  });
}

/**
 * Handles Anchor Tag navigation
 */
const clickHandler = (e) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) {
    return;
  }

  const anchor = e.composedPath().filter(el => el.tagName === 'A')[0];

  if (!anchor || anchor.target || anchor.hasAttribute('download') || anchor.getAttribute('rel') === 'external') {
    return;
  }

  const href = anchor.href;

  if (!href || href.indexOf('mailto:') !== -1) {
    return;
  }

  const location = window.location;
  const origin = location.origin || location.protocol + '//' + location.host;

  if (href.indexOf(origin) !== 0) {
    return;
  }

  e.preventDefault();

  if (href !== location.href) {
    window.history.pushState({}, '', href);
    window.dispatchEvent(new Event('location-changed'));
  }
};