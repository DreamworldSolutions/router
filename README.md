# @dreamworld/router

A URL routing library for Redux-based web applications. It parses the current URL into structured page/dialog objects and stores them in Redux state, while providing imperative navigation methods built on the History API.

---

## 1. User Guide

### Installation & Setup

```bash
yarn add @dreamworld/router
```

The package is an ES module (`"type": "module"`). Your bundler must support ESM.

**Required peer dependencies** (not listed in `peerDependencies` but required at runtime):

| Package | Version Used in Dev |
|---|---|
| redux | ^4.1.1 |
| redux-saga | required for saga methods |

---

### Basic Usage

```js
import { init, registerFallbackCallback } from '@dreamworld/router';
// Re-export all router methods for the rest of your app
export * from '@dreamworld/router';

const URLs = {
  pages: [
    {
      name: 'contacts',
      pathPattern: '/:companyId/contact',
      pathParams: {
        companyId: Number
      },
      queryParams: {
        'doc-ids': {
          name: 'docIds',
          type: Number,
          array: true
        },
        'mobile': {
          name: 'mobileNo',
          type: Number
        },
        'email': {
          type: String,
          array: true
        }
      }
    },
    {
      name: 'bank',
      pathPattern: '/:companyId/bank',
      pathParams: { companyId: Number }
    }
  ],
  dialogs: [
    {
      name: 'contactView',
      pathPattern: '#contact-view-dialog'
    }
  ]
};

// Initialize once, typically in your root component's connectedCallback
init(URLs, store);

// Register a fallback for back() when no history entry exists
registerFallbackCallback(() => {
  navigatePage('contacts', { companyId: 123 }, true);
});
```

---

### URL Configuration Format

The `URLs` object passed to `init()` has two top-level keys: `pages` and `dialogs`. Each is an array of route definition objects.

#### Page Route Object

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | `string` | Yes | Unique route name used in navigation methods |
| `pathPattern` | `string` | Yes | `path-to-regexp` pattern (e.g. `'/:companyId/contacts'`). Use `?` suffix for optional params (e.g. `/:id/tab?`) |
| `pathParams` | `object` | No | Map of path param name → type constructor (e.g. `{ companyId: Number }`). Used to coerce parsed path param values |
| `queryParams` | `object` | No | Map of URL query key → query param config object (see table below) |
| `arrayFormat` | `string` | No | Overrides global `arrayFormat` for this route (e.g. `'separator'`). Passed to `query-string-esm` |
| `arrayFormatSeparator` | `string` | No | Overrides global `arrayFormatSeparator` for this route (e.g. `'\|'`) |
| *(any other key)* | `any` | No | Passed through as-is in the parsed page object (e.g. `module`) |

#### Query Param Config Object (`queryParams[key]`)

| Field | Type | Required | Description |
|---|---|---|---|
| `type` | `Function` | No | Type constructor applied to coerce the value (e.g. `Number`, `String`, `Boolean`). Default: `String` |
| `name` | `string` | No | Rename the key in the parsed params object (e.g. URL key `'doc-ids'` → parsed key `'docIds'`) |
| `array` | `boolean` | No | When `true`, the value is parsed as an array. Single values are wrapped in `Array(1)`. The `type` constructor is applied to each element |

#### Dialog Route Object

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | `string` | Yes | Unique dialog name |
| `pathPattern` | `string` | Yes | Hash-based pattern (e.g. `'#contact-view-dialog'`). The `#` prefix is treated as a path separator internally |
| `queryParams` | `object` | No | Same structure as page route query params |

**Notes:**
- All fields except `pathPattern`, `pathParams`, and `queryParams` are passed through to the parsed result object unchanged.
- Comma-separated query param values (e.g. `?ids=1,2,3`) are parsed as arrays when `array: true` is set and the default `arrayFormat` is `'comma'`.
- `query-string-esm` parses `parseNumbers: true` and `parseBooleans: true` by default before type coercion is applied.

---

### API Reference

#### Core Functions

| Function | Signature | Returns | Description |
|---|---|---|---|
| `init` | `(aUrls: object, oStore: object, url?: string) => void` | `void` | Initializes the routing flow. Registers `location-changed` and `popstate` event listeners and a `click` handler on `document.body`. `url` is only used for SSR — on the server, if `url` is not provided, `init` returns early without doing anything |
| `navigate` | `(url: string, bReplace?: boolean, resetIndex?: boolean) => void` | `void` | Navigates to a raw URL string using the History API. If `bReplace` is `true`, uses `replaceState`; otherwise `pushState`. If `resetIndex` is `true`, stores `index: 0` in history state; otherwise increments the current index. Dispatches a `location-changed` event after navigation |
| `back` | `() => void` | `void` | Navigates to the previous history entry. If the current history index is `0` or absent and a fallback callback is registered, calls the fallback instead of `history.back()` |
| `registerFallbackCallback` | `(fallback: Function) => void` | `void` | Registers a function to be called by `back()` when there is no previous history entry |

#### Page Navigation Functions

| Function | Signature | Returns | Description |
|---|---|---|---|
| `navigatePage` | `(pageName: string, pageParams?: object, replace?: boolean, resetIndex?: boolean) => void` | `void` | Navigates to the page with the given name, building the URL from `pageParams`. `replace` defaults to `false`. `resetIndex` defaults to `false` |
| `setPageParams` | `(pageParams: object, replace?: boolean) => void` | `void` | Merges `pageParams` into the current page's params and navigates to the resulting URL via `navigatePage` |
| `buildPageURL` | `(pageName: string, pageParams?: object) => string` | `string` | Returns the URL string for the given page name and params without navigating |

#### Dialog Navigation Functions

| Function | Signature | Returns | Description |
|---|---|---|---|
| `navigateDialog` | `(dialogName: string, dialogParams?: object, replace?: boolean) => void` | `void` | Navigates to the dialog with the given name. Appends the dialog hash to the current `pathname + search`. `replace` defaults to `false` |
| `setDialogParams` | `(dialogParams: object, replace?: boolean) => void` | `void` | Merges `dialogParams` into the current dialog's params and navigates via `navigateDialog` |
| `buildDialogURL` | `(dialogName: string, dialogParams?: object) => string` | `string` | Returns the URL fragment string for the given dialog name and params without navigating |

#### Global Config Functions

| Function | Signature | Returns | Description |
|---|---|---|---|
| `setDefaultArrayFormat` | `(format: string, separator: string) => void` | `void` | Sets the global default `arrayFormat` and `arrayFormatSeparator` used by `query-string-esm` when parsing and stringifying query params. Defaults: `format = 'comma'`, `separator = ','` |

---

### Redux State

The router registers itself under the `router` key in the Redux store via `store.addReducers({ router })`.

**State path:** `state.router`

| Path | Type | Description |
|---|---|---|
| `state.router.page` | `object \| null` | The currently matched page object, or `null` if no page pattern matches |
| `state.router.page.name` | `string` | The `name` field from the matched page route definition |
| `state.router.page.params` | `object` | Merged path and query params after type coercion and key renaming |
| `state.router.dialog` | `object \| null` | The currently matched dialog object, or `null` if the URL has no hash or no dialog pattern matches |
| `state.router.dialog.name` | `string` | The `name` field from the matched dialog route definition |
| `state.router.dialog.params` | `object` | Merged path and query params from the dialog hash |

**Redux action dispatched on every route change:**

```js
{
  type: 'ROUTER_ROUTE_CHANGED',
  page: { name, params, ...otherRouteFields },
  dialog: { name, params, ...otherRouteFields } | null
}
```

---

### Exported Constants & Variables

| Export | Type | Description |
|---|---|---|
| `ROUTE_CHANGED` | `string` (`'ROUTER_ROUTE_CHANGED'`) | Action type dispatched to the Redux store on every URL change |
| `urls` | `object` | The URLs config object passed to `init()`. Mutable reference — updated on `init()` |
| `currentPage` | `object \| null` | The most recently parsed page object. Updated synchronously on every route change |
| `currentDialog` | `object \| null` | The most recently parsed dialog object. Updated synchronously on every route change |

---

### Configuration Options

#### Global Array Format

Set before calling `init()` to affect all routes (unless a route overrides it):

```js
import { setDefaultArrayFormat } from '@dreamworld/router';

// Default is already 'comma' / ','
setDefaultArrayFormat('separator', '|');
```

| Option | Default | Description |
|---|---|---|
| `arrayFormat` | `'comma'` | `query-string-esm` array format strategy |
| `arrayFormatSeparator` | `','` | Separator character used when `arrayFormat` is `'separator'` |

Per-route overrides are set directly on the route definition object via `arrayFormat` and `arrayFormatSeparator` fields.

---

### Advanced Usage

#### Anchor Tag Interception

The router automatically intercepts same-origin `<a>` tag clicks on `document.body`. Navigation is intercepted when all of the following are true:

- The click is a primary button click (`button === 0`)
- No modifier keys are held (`metaKey`, `ctrlKey`, `shiftKey`)
- The event has not been `preventDefault()`-ed
- The anchor does not have a `target`, `download` attribute, or `rel="external"`
- The `href` is not a `mailto:` link
- The `href` shares the same origin as `window.location`

When intercepted, the router calls `history.pushState` and dispatches `location-changed`.

#### Server-Side Rendering (SSR)

Pass the current URL as the third argument to `init()`:

```js
import { init } from '@dreamworld/router';

// On the server, window is unavailable — pass the URL explicitly
init(URLs, store, 'https://example.com/123/contacts?ids=1,2');
```

If running on the server and `url` is not provided, `init()` returns immediately without registering any listeners.

---

## 2. Developer Guide / Architecture

### Architecture Overview

| Layer | File | Pattern | Responsibility |
|---|---|---|---|
| Entry / Orchestration | `index.js` | Facade | Initializes event listeners, wires together parser + reducer + store, exports public API |
| URL Parsing | `page-parser.js` | Strategy + Pipeline | Matches URL path via `path-to-regexp` `match()`, parses query string via `query-string-esm`, applies type coercion and key renaming |
| State Management | `reducer.js` | Redux Reducer | Immutably updates `state.router.{page,dialog}` in response to `ROUTER_ROUTE_CHANGED` actions using `ReduxUtils.replace` from `@dreamworld/pwa-helpers` |
| Navigation | `navigation-methods.js` | Command | Builds URLs from named route definitions via `path-to-regexp` `compile()`, delegates to History API (`pushState` / `replaceState`) |
| Global Config | `global-config.js` | Singleton Config | Holds module-level mutable variables for default array format; exported as getter/setter functions |
| Saga Utilities | `saga.js` | Redux-Saga Effect | Generator functions that block until route criteria are met or unmet, using `take(ROUTE_CHANGED)` and `select` effects |

### Design Patterns

- **Event-driven routing:** Route changes are driven by three browser events: `popstate`, `location-changed` (custom), and `click` (intercepted anchor tags). All three converge on a single `handleRoute()` handler.
- **History index tracking:** `navigate()` stores an incrementing `index` in `window.history.state`. `back()` reads this index to determine whether a previous in-app page exists, enabling a custom fallback when the index is `0`.
- **Parse-then-dispatch:** Every URL change triggers a full re-parse of `window.location.href` into plain objects before dispatching to Redux — no incremental diff.
- **Non-destructive pass-through:** Route definition fields beyond `pathPattern`, `pathParams`, and `queryParams` (e.g. `name`, `module`, or any custom field) are deep-cloned and spread into the parsed result, allowing arbitrary metadata to flow through to Redux state.
