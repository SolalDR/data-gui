import { LitElement, html, css, property, customElement } from 'lit-element'

@customElement('gui-button')
export class Button extends LitElement {
  static styles = css`
    /*minify*/
    button {
      color: var(--color-bg-primary);
      font-family: sans-serif;
      font-size: 0.85em;
      letter-spacing: 0.5px;
      background: white;
      display: inline-block;
      padding: var(--padding-xs) var(--padding-s);
      background-color: var(--color-primary);
      border: 0;
      border-radius: 3px;
      outline: none;
      box-shadow: none;
    }
    button:hover {
      background-color: #16e0b0;
      cursor: pointer;
    }
  `

  render() {
    return html`
      <button><slot></slot></button>
    `
  }
}
