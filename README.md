# Router

## Behaviors

- Parses the current URL to the redux state.
- Provides public methods for the page/dialog navigation.
- Handles Anchor Tag navigation.

## Usage pattern

```js
import { init, registerFallbackCallback } from '@dreamworld/router';

// init routing flow
init(URLs, store);

// Register fallback callback
registerFallbackCallback(callback)

// Exports all the methods provides by the router module
export * from '@dreamworld/router'; 
```

### URLs: format of the URLs

This Object contains all page/dialog Urls of the application. format is as below:

```js
URLs = {
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
        type: String //Boolean, Number
      },
      ids: {
        name:: "docIds",
        type: String,
        array: true
      }
    },
    arrayFormat: "separator" //It will override default global config
    arrayFormatSeparator: "|"
  }],

  dialogs: [{
    name: 'contact-view',
    pathPattern: '#contact-view',
    queryParams: {}
  }]
}
```

**Notes**
- When `array=true`, `type` specified type of an array element.
- As default value of `type` is `String`, when `type` isn't defined for `queryParams`, then it always parse as `String`. If `array: true` isn't specified and queryParam's value is comma separated then it would be parsed as `String`. 

- To make path parameter optional use `?`.  e.g. `/:companyId/contact/:tab?`.

- All the keys except `pathPattern`, `pathParams`, `queryParams` will be provided as it is in the parsed object.

- Provide comma separated value in query params to parse it as `Array`. e.g `ids=1,2,3,4`

- It will parse query params in related data type.
    - e.g. URL params is `?action=edit&ids=d64bd8f3ef4463d048963790dcf53193,8b0397b832e9d654e67fa3a5e6935d16&archived=true&count=2`.
      - parsed object of above params is as below:
        ```json
        {
          "action":"edit",
          "ids":["d64bd8f3ef4463d048963790dcf53193","8b0397b832e9d654e67fa3a5e6935d16"],
          "archived":true,
          "count":2
        }
        ```

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

- `init (urls, store)` // Used to intialize routing flow
- `navigate (url, bReplace)` // Use to navigate on given URL
- `back()` // Use to navigate on previous page
- `registerFallbackCallback (callback)` // Use to register fallback function for `back` action.
- `setDefaultArrayFormat (format, separator)` // Use to set default arrayFormat config. Default: `arrayFormat: comma`
- For page
  - `navigatePage (pageName, pageParams, replace = false)` // Used to navigate on given page name
  - `setPageParams (pageParams, replace)` // Used to update current URL's params
  - `buildPageURL (pageName, pageParams)` // Used to get given page URL
- For dialog
  - `navigateDialog (dialogName, dialogParams, replace = false)` // Used to navigate on the given dialog name
  - `setDialogParams (dialogParams, replace)` // Used to set params in the current hash
  - `buildDialogURL (dialogName, dialogParams)` // Used to get dialog URL