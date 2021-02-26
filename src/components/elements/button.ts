import { LitElement, html, css, property, customElement } from 'lit-element'

@customElement('gui-button')
export class Button extends LitElement {
  static styles = css`
    /*minify*/
    button {
      color: var(--color-bg-primary);
      font-family: sans-serif;
      font-size: 0.9em;
      text-transform: uppercase;
      letter-spacing: 1px;
      background: white;
      display: inline-block;
      padding: var(--padding-xs) var(--padding-s);
      font-weight: bold;
      background-color: var(--color-primary);
      border: 0;
      border-radius: 3px;
      outline: none;
      box-shadow: none;
    }
    button:hover {
      color: var(--color-text-primary);
      cursor: pointer;
    }
  `

  render() {
    return html`
      <button><slot></slot></button>
    `
  }
}
