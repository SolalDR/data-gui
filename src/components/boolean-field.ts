import { html, property, customElement, css, query } from 'lit-element'
import { BaseField, FieldConstructor } from '../field'

@customElement('gui-boolean-field')
export class BooleanField extends BaseField {
  @property() name: string
  @query('input') input: HTMLInputElement

  public static styles = css`
    /*minify*/
    ${BaseField.styles}
    .right input[type="checkbox"] {
      width: 15px !important;
      height: 15px !important;
      opacity: 0;
    }
    .customCheckbox {
      position: absolute;
      background: white;
      width: 15px;
      height: 15px;
      border: 1px solid var(--color-primary);
      pointer-events: none;
      border-radius: 5px;
      transition-duration: 0.3s;
      transition-property: background-color;
    }
    input[value="true"] + .customCheckbox {
      background: var(--color-primary);
    }
  `

  constructor(parameters: FieldConstructor) {
    super(parameters)
  }

  static isCompatible(value: unknown): boolean {
    return typeof value === 'number' || typeof value === 'boolean'
  }

  /**
   * @override
   * Validate and format the value
   */
  protected validate(value: boolean): boolean {
    return !!value
  }

  /**
   * @override
   */
  protected onChange(event) {
    this.set(Boolean(event.target.checked))
    super.onChange(event)
    super.onInput(event)
    this.input.checked = this.value
  }

  render() {
    return html`
      <div>
        <label>${this.name}</label>
        <div class="right">
          <input
            .value=${this.value}
            .checked=${this.value}
            type="checkbox"
            @change=${event => {
              this.onChange(event)
            }}
          />
          <span .data-checked=${this.value ? "1" : "2"} class="customCheckbox"></span>
        </div>
      </div>
    `
  }
}
