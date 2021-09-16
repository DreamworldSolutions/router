# Router

## Behaviors

- Parses the current URL to the redux state.
- Provides public methods for the page/dialog navigation.
- Handles Anchor Tag navigation.

## Usage pattern

```js
import { init, registerFallbackCallback } from '../router.js';

// init routing flow
init(URLs, store);

// Register fallback callback
registerFallbackCallback(callback)

// Exports all the methods provides by the router module
export * from '../router.js'; 
```

### URLs: format of the URLs

This array contains all page/dialog Urls of the application. format is as below:

```
[{
  pages: [{
    module: 'contacts',
    name: 'contact-list',
    pathPattern: '/:companyId/contacts',
    pathParams: {
      companyId: Number
    },
    queryParams: {
      s: {
        name: "size",
      }
    }
  }],

  dialogs: [{
    name: 'contact-view',
    pathPattern: '#contact-view',
    queryParams: {}
  }]
}]
```

**To make path parameter optional use `?`.  e.g. `/:companyId/contact/:tab?`.**
**All the keys Except `pathPattern`, `pathParams`, `queryParams` will be provided as it is in the parsed object.**

**It will parse query params in related type. e.g If any query params value is comma separated then it will give `Array` in parsed object. e.g. URL params is `?action=edit&ids=d64bd8f3ef4463d048963790dcf53193,8b0397b832e9d654e67fa3a5e6935d16&archived=true&count=2`. parsed object of this params is `{action: 'edit', ids: ['d64bd8f3ef4463d048963790dcf53193', '8b0397b832e9d654e67fa3a5e6935d16'], archived: true, count: 2}`**

## State
Path: `/router`


| Name               | Type | description |
|--------------------|-----------|-------------|
| page.name          | String    | Name of the internal Page of module to be used in the module's logic/routing. | 
| page.params        | Object     | Parameters of the page. This is dynamic object constructed from the path params and query params. Exact parameters are dependent on the page. |
| page.module          | String    | Name of the app module to be used in the app's logic/routing | 
| dialog.name          | String    | Name of the dialog to be used in the application's logic/routing. | 
| dialog.params        | Object     | Parameters of the page. This is dynamic object constructed from the path params and query params. Exact parameters are dependent on the dialog.

## Methods

- init (urls, store) // Used to intialize routing flow
- navigate (url, bReplace) // Use to navigate on given URL
- back() // Use to navigate on previous page
- registerFallbackCallback (callback) // Use to register fallback function for `back` action. 
- For page
  - navigatePage (pageName, pageParams, replace = false) // Used to navigate on given page name
  - setPageParams (pageParams, replace) // Used to update current URL's params
  - buildPageURL (pageName, pageParams) // Used to get given page URL
- For dialog
  - navigateDialog (dialogName, dialogParams, replace = false) // Used to navigate on the given dialog name
  - setDialogParams (dialogParams, replace) // Used to set params in the current hash
  - buildDialogURL (dialogName, dialogParams) // Used to get dialog URL