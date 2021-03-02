import { html, property, customElement, css } from 'lit-element'
import { BaseController, ControllerConstructor } from '../controller'

interface TextControllerConstructor extends ControllerConstructor {
  min?: number
  max?: number
}

@customElement('gui-text-controller')
export class TextController extends BaseController {
  @property() name: string
  @property() min: number
  @property() max: number

  public static styles = css`
    /*minify*/
    ${BaseController.styles}
  `

  constructor(parameters: TextControllerConstructor) {
    super(parameters)
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
