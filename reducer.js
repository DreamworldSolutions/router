import { ReduxUtils } from '@dreamworld/pwa-helpers/redux-utils.js';
import { ROUTE_CHANGED } from './index.js';

const INITIAL_STATE = {
  page: undefined, //Example: { name: "home", params: {} }
  dialog: undefined, //Example: {name: '', params: {}}
};

const router = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ROUTE_CHANGED:
      state = ReduxUtils.replace(state, 'page', action.page);
      return ReduxUtils.replace(state, 'dialog', action.dialog);

    default:
      return state;
  }
};

export default router;
