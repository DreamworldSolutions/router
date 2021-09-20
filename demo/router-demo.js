import { LitElement } from '@dreamworld/pwa-helpers/lit-element';
import { html, css } from 'lit-element';
// import { init, registerFallbackCallback} from '../index.js';
import * as router from '../index.js';

import { store } from './redux/store.js';
import { connect } from 'pwa-helpers/connect-mixin.js';

import "@material/mwc-tab-bar";
import "@dreamworld/dw-button";
import "@dreamworld/dw-dialog";
import "./demo-page-1.js";
import "./demo-page-2.js";
import "./demo-page-3.js";
import "./demo-page-4.js";

const URLs = {
  pages: [
    {
      name: 'page1',
      pathPattern: '/demo/:companyId/page1',
      pathParams: {
        companyId: Number
      }
    },
    {
      name: 'page2',
      pathPattern: '/demo/:companyId/page2',
      pathParams: {
        companyId: Number
      }
    },
    {
      name: 'page3',
      pathPattern: '/demo/:companyId/page3',
      pathParams: {
        companyId: Number
      }
    },
    {
      name: 'page4',
      pathPattern: '/demo/:companyId/page4',
      pathParams: {
        companyId: Number
      }
    }
  ],
  dialogs: [
    {
      name: 'dialog1',
      pathPattern: '#dialog1',
    },
    {
      name: 'dialog2',
      pathPattern: '#dialog2',
    }
  ]
}

class routerDemo extends connect(store)(LitElement) {
  static get styles() {
    return [
      css`
        dw-button {
          margin-top: 24px;
          margin-bottom: 24px;
        }

        dw-dialog dw-button {
          margin-bottom: unset;
          margin-top: unset;
        }

        .curent-url {
          display: none;
        }
      `
    ];
  }

  static get properties() {
    return {
      /**
      * Represents the currently opened page.
      */
      _page: String,

      _dialog: String

    };
  }

  render() {
    return html`
      <mwc-tab-bar>
        <mwc-tab label="page 1" id="page1" @MDCTab:interacted="${this._OnTabChang}"></mwc-tab>
        <mwc-tab label="page 2" id="page2" @MDCTab:interacted="${this._OnTabChang}"></mwc-tab>
        <mwc-tab label="page 3" id="page3" @MDCTab:interacted="${this._OnTabChang}"></mwc-tab>
        <mwc-tab label="page 4" id="page4" @MDCTab:interacted="${this._OnTabChang}"></mwc-tab>
      </mwc-tab-bar>
      
      <dw-button label="Open demo dialog 1" id="dialog1" outlined @click=${this._openDialog1}></dw-button>
      <dw-button label="Open demo dialog 2" id="dialog2" outlined @click=${this._openDialog2}></dw-button>

      ${this._getcurentPage}

      <dw-dialog  ?opened=${this._dialog === "dialog1" ? true : false} noCancelOnEscKey noCancelOnOutsideClick >
        <span slot="header">Demo dialog 1</span>
        <div>
          this dilaog open when url is set to "#dialog1"
        </div>
        <span slot="footer">
          <dw-button label="Cancel" @click="${router.back}" ></dw-button>
        </span>
      </dw-dialog>

      <dw-dialog  ?opened=${this._dialog === "dialog2" ? true : false} noCancelOnEscKey noCancelOnOutsideClick >
        <span slot="header">Demo dialog 2</span>
        <div>
          this dilaog open when url is set to "#dialog2"
        </div>
        <span slot="footer">
          <dw-button label="Cancel" @click="${router.back}"></dw-button>
        </span>
      </dw-dialog>

      <a href="${this._getUrl()}">Go to page2</a>
    `
  }

  get _getcurentPage() {
    if (this._page === "page1") {
      return html`<demo-page-1></demo-page-1>`;
    }

    if (this._page === "page2") {
      return html`<demo-page-2></demo-page-2>`;
    }

    if (this._page === "page3") {
      return html`<demo-page-3></demo-page-3>`;
    }

    if (this._page === "page4") {
      return html`<demo-page-4></demo-page-4>`;
    }

    return html`<demo-page-1></demo-page-1>`;
  }

  _OnTabChang(env) {
    router.navigatePage(env.detail.tabId, { companyId: 354634 }, true);
  }

  connectedCallback() {
    super.connectedCallback()
    router.init(URLs, store);
    router.registerFallbackCallback(this._callback);
  }

  _callback() {
    if(!router.currentDialog && router.currentPage && router.currentPage.name !== "page1") {
      router.navigatePage("page1", { companyId: 354634 }, true);
      return;
    }

    if(router.currentDialog && router.currentPage) {
      router.navigatePage( router.currentPage.name, { companyId: 354634 }, true);
      return;
    }

    router.navigatePage("page1", { companyId: 354634 }, true);
    return;
  }

  _openDialog1() {
    router.navigateDialog("dialog1", "", true);
  }

  _openDialog2() {
    router.navigateDialog("dialog2", "", true);
  }

  _getUrl() {
    let url = router.buildPageURL("page2", { companyId: 354634 });
    return url;
  }

  stateChanged(state) {
    this._page = router.currentPage ? router.currentPage.name : "";
    this._dialog = router.currentDialog ? router.currentDialog.name : "";
  }
}

window.customElements.define('router-demo', routerDemo);
