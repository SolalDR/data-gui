import { LitElement, html, css, property, customElement } from 'lit-element'

@customElement('gui-input')
export class Input extends LitElement {
  @property() label = null
  @property({ reflect: true }) type = 'text'
  @property({ reflect: true, type: Number }) step = 1
  @property() value = ''

  static styles = css`
    /*minify*/
    p {
      height: var(--input-height, 20px);
      display: inline-block;
      overflow: hidden;
      margin: 0;
      border-radius: 5px;
      background-color: var(--input-bg);
      display: flex;
      box-sizing: border-box;
    }
    label {
      font-size: 0.85em;
      color: var(--color-text-primary);
      text-align: center;
      display: flex;
      flex-direction: column;
      font-weight: 100;
      justify-content: center;
      max-width: 15px;
      padding: 0px 3px 0px 0px;
    }

    input {
      border: 0;
      flex: 1;
      width: 100%;
      background-color: transparent;
      font-size: 0.85em;
      text-align: right;
      box-shadow: 0;
      outline: 0;
      color: var(--input-text, #000);
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  `

  onInput(event) {
    this.dispatchEvent(
      new CustomEvent('input', {
        detail: event.target.value,
      }),
    )
  }

  onChange(event) {
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: event.target.value,
      }),
    )
  }

  render() {
    const label = this.label
      ? html`
          <label>${this.label}</label>
        `
      : ''
    return html`
      <p>
        ${label}
        <input
          .type=${this.type}
          .value=${this.value}
          .step=${String(this.step)}
          @input=${event => {
            this.onInput(event)
          }}
          @change=${event => {
            this.onChange(event)
          }}
        />
      </p>
    `
  }
}
