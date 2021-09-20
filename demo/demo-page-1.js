import { LitElement } from '@dreamworld/pwa-helpers/lit-element';
import { html, css } from 'lit-element';

class demoPage1 extends LitElement {
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
      <h1>demo page 1</h1>
    `;
  }

}

window.customElements.define('demo-page-1', demoPage1);
