import {parsePage, parseDialog} from './page-parser.js';
import reducer from './reducer.js';
export * from './navigation-methods.js';

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
 */
export const init = (aUrls, oStore) => { 
  store = oStore;
  urls = aUrls;
  addReducer();

  // Bind events to handler URL changes
  window.addEventListener('location-changed', handleRoute);
  window.addEventListener('popstate', handleRoute);
  document.body.addEventListener('click', clickHandler);
  
  handleRoute();
}

/**
 * Whenever url is changed, this function is invokes.
 * It's parses current URL and stores page/dialog object in the redux store
 * @param {String} url - current url
 */
const handleRoute = () => { 
  let url = window.location.href;
  currentPage = parsePage(urls.pages, url);
  currentDialog = parseDialog(urls.dialogs, url);

  console.log('page..', currentPage);
  console.log('dialog..', currentDialog)
  dispatch(currentPage, currentDialog);
}

const dispatch = function(page, dialog){
  page = page || {};
  dialog = dialog || {};
  
  store.dispatch({
    type: ROUTE_CHANGED,
    page,
    dialog
  });
}

const addReducer = function(){
  store.addReducers({
    router: reducer
  });
}

/**
 * Handles Anchor Tag navigation
 */
const clickHandler = (e) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey){
    return;
  }

  const anchor = e.composedPath().filter(el => el.tagName === 'A')[0];

  if (!anchor || anchor.target || anchor.hasAttribute('download') || anchor.getAttribute('rel') === 'external'){
    return;
  }

  const href = anchor.href;

  if (!href || href.indexOf('mailto:') !== -1){
    return;
  }
  
  const location = window.location;
  const origin = location.origin || location.protocol + '//' + location.host;

  if (href.indexOf(origin) !== 0){
    return;
  }

  e.preventDefault();

  if (href !== location.href) {
      window.history.pushState({}, '', href);
      window.dispatchEvent( new Event('location-changed'));
  }
};