import { LitElement, html, css } from 'lit-element';
import * as router from '../index.js';

import { store } from './redux/store.js';
import { connect } from 'pwa-helpers/connect-mixin.js';

import "@material/mwc-tab-bar";
import "@dreamworld/dw-button";
import "@dreamworld/dw-dialog";
import "./bank-page.js";
import "./contact-page.js";
import "./contact-inner-page.js";

const URLs = {
  pages: [
    {
      name: 'contacts',
      pathPattern: '/:companyId/contact',
      pathParams: {
        companyId: Number
      }
    },
    {
      name: 'bank',
      pathPattern: '/:companyId/bank',
      pathParams: {
        companyId: Number
      }
    },
    {
      name: 'contactInnerPage',
      pathPattern: '/:companyId/contact/contact-inner-page',
      pathParams: {
        companyId: Number
      }
    }
  ],
  dialogs: [
    {
      name: 'contactView',
      pathPattern: '#contact-view-dialog',
    }
  ]
}

class RouterDemo extends connect(store)(LitElement) {
  static get styles() {
    return [
      css`
        .note {
          font-size: 16px;
          font-weight: bold;
        }

        dw-dialog {
          --dw-dialog-content-padding: 20px 30px;
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
        <mwc-tab label="contacts" id="contacts" @MDCTab:interacted="${this._onTabChange}"></mwc-tab>
        <mwc-tab label="bank" id="bank" @MDCTab:interacted="${this._onTabChange}"></mwc-tab>
      </mwc-tab-bar>
      
      ${this._getPageTemplate}
      ${this._getDialogTemplate}

      <div class="note">Notes: Open console to see Page and Dialog object</div>
    `
  }

  get _getPageTemplate() {
    console.log(router.currentPage);
    if (this._page === "contacts") {
      return html`<contact-page></contact-page>`;
    }

    if (this._page === "bank") {
      return html`<bank-page></bank-page>`;
    }

    if (this._page === "contactInnerPage") {
      return html`<contact-inner-page></contact-inner-page>`;
    }

    return html`<contact-page></contact-page>`;
  }

  get _getDialogTemplate() {
    console.log(router.currentDialog);
    return html`
      <dw-dialog  ?opened=${this._dialog === "contactView" ? true : false} noCancelOnEscKey noCancelOnOutsideClick >
        <span slot="header">Contact view dialog</span>
        <div>
          This dilaog open when url is set to "#contact-view-dialog"
        </div>
        <span slot="footer">
          <dw-button label="Cancel" @click="${router.back}" ></dw-button>
        </span>
      </dw-dialog>
    `;
  }

  _onTabChange(event) {
    router.navigatePage(event.detail.tabId, { companyId: 354634 }, true);
  }

  connectedCallback() {
    super.connectedCallback()
    router.init(URLs, store);
    router.registerFallbackCallback(this._fallbackCallback);
  }

  _fallbackCallback() {
    if(!router.currentDialog && router.currentPage && router.currentPage.name !== "contacts") {
      router.navigatePage("contacts", { companyId: 354634 }, true);
      return;
    }

    if(router.currentDialog && router.currentPage) {
      router.navigatePage( router.currentPage.name, { companyId: 354634 }, true);
      return;
    }

    router.navigatePage("contacts", { companyId: 354634 }, true);
  }

  stateChanged(state) {
    this._page = router.currentPage?.name||"";
    this._dialog = router.currentDialog?.name||"";
  }
}

window.customElements.define('router-demo', RouterDemo);
