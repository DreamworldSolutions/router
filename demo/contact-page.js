import { LitElement, html, css } from '@dreamworld/pwa-helpers/lit.js';
import * as router from '../index.js';

class ContactPage extends LitElement {
  static get styles() {
    return [
      css`
        .tital-bar {
          display: flex;
          height: 64px;
          background-color: #6200ee;
          color: #fff;
          text-align: center;
          margin-top: 20px;
          align-items: center;
        }

        .tital-bar h2{
          margin-left: 24px;
        }

        a {
          display: block;
          width: max-content;
          text-decoration: none;
          color: var(--mdc-theme-primary, #6200ee);
          margin-top: 24px;
          padding: 8px 15px;
          font-size: 16px;
          font-family: var(--mdc-typography-button-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));
          font-weight: 300;
          border: 1px solid rgba(0, 0, 0, 0.12);
          border-radius: 4px;
          text-transform: uppercase;
        }

        dw-button {
          margin-top: 24px;
          margin-bottom: 24px;
        }
      `
    ];
  }

  render() {
    return html`
      <div class="tital-bar"> <h2>Contacts</h2></div>

      <a href=${this._getInnerPageUrl()}>Go to connect inner page</a>
      <dw-button label="Contect view" id="contactViewDialog" outlined @click=${this._openContectViewDialog}></dw-button>

      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
        aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
        aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
        aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
        aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
        aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    `;
  }

  _getInnerPageUrl() {
    return router.buildPageURL("contactInnerPage", { companyId: 354634 });
  }

  _openContectViewDialog() {
    router.navigateDialog("contactView", { id: "view?153"}, true);
  }
}

window.customElements.define('contact-page', ContactPage);
