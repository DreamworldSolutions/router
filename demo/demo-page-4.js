import { LitElement } from '@dreamworld/pwa-helpers/lit-element';
import { html, css } from 'lit-element';
import * as router from '../index.js';

import '@dreamworld/dw-button';

class demoPage4 extends LitElement {
  static get styles() {
    return [
      css`
        dw-button {
          margin-top: 24px;
          margin-bottom: 24px
        }
      `
    ];
  }

  static get properties(){
    return {
      
    };
  }

  render() {
    return html`
      <dw-button label="back" outlined @click=${router.back}></dw-button>
      <h1>demo page 4</h1>
    `;
  }
}

window.customElements.define('demo-page-4', demoPage4);
