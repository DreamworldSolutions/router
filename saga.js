import { take, select } from 'redux-saga/effects';
import { isMatch } from 'lodash-es';
import { ROUTE_CHANGED } from './index.js';

/**
 * Waits until the current route matches the given criteria.
 * @param {Function|Object} routeCriteria - The criteria to match against the current route using lodash isMatch or a function that returns a boolean
 * @returns {Promise} Resolved when the route matches the criteria
 */
export function* waitWhile(routeCriteria) {
  let matched = false;
  let route = yield select(state => state.router);

  if (typeof routeCriteria === 'function') {
    matched = routeCriteria(route);
  } else {
    matched = isMatch(route, routeCriteria);
  }

  if(matched) {
    return route;
  }

  while(true) {
    const { page, dialog } = yield take(ROUTE_CHANGED);
    route = { page, dialog };
    if (typeof routeCriteria === 'function') {
      matched = routeCriteria(route);
    } else {
      matched = isMatch(route, routeCriteria);
    }

    if (matched) {
      return route;
    }
  }
}

/**
 * Waits until the current route does NOT match the given criteria.
 * @param {Function|Object} routeCriteria - The criteria to check against the current route using lodash isMatch or a function that returns a boolean
 * @returns {Promise} Resolved when the route no longer matches the criteria
 */
export function* waitUntil(routeCriteria) {
  let matched = true;
  let route = yield select(state => state.router);

  if (typeof routeCriteria === 'function') {
    matched = routeCriteria(route);
  } else {
    matched = isMatch(route, routeCriteria);
  }

  if(!matched) {
    return route;
  }

  while(true) {
    const { page, dialog } = yield take(ROUTE_CHANGED);
    route = { page, dialog} ;
    if (typeof routeCriteria === 'function') {
      matched = routeCriteria(route);
    } else {
      matched = isMatch(route, routeCriteria);
    }

    if (!matched) {
      return route;
    }
  }
}
