import { html, property, customElement, css } from 'lit-element'
import { BaseField, FieldConstructor } from '../field'

interface TextFieldConstructor extends FieldConstructor {
  name?: string
  min?: number
  max?: number
}

@customElement('gui-text-field')
export class TextField extends BaseField {
  @property() name: string
  @property() min: number
  @property() max: number

  public static styles = css`
    ${BaseField.styles}
  `

  constructor(
    property: string,
    target: string,
    parameters: TextFieldConstructor,
  ) {
    super(property, target, parameters)
    const { min, max } = parameters
    this.min = min ? min : -Infinity
    this.max = max ? max : Infinity
  }

  protected validate(value: string) {
    return value
  }

  static isCompatible(value: unknown): boolean {
    return typeof value === 'string' || value instanceof String
  }

  protected onInput(event) {
    this.set(event.target.value)
    super.onInput(event)
  }

  protected onChange(event) {
    this.set(event.target.value)
  }

  render() {
    return html`
      <div>
        <label>${this.name}</label>
        <div class="right">
          <input
            type="text"
            .value=${this.value}
            .min=${String(this.min)}
            .max=${String(this.max)}
            @input=${event => {
              this.onInput(event)
            }}
            @change=${event => {
              this.onChange(event)
            }}
          />
        </div>
      </div>
    `
  }
}
