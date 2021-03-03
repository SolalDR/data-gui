import { html, property, customElement, css } from 'lit-element'
import { BaseController, ControllerConstructor } from '../controller'

interface TextControllerConstructor extends ControllerConstructor {
  min?: number
  max?: number
  pattern?: string
}

/**
 * ## How to use
 * ``` javascript
 * const target = { property: "Some text" }
 * group.add('property', target, {
 *   min: 1, // optional min length of string
 *   max: 140, // optional max length of string
 *   pattern: "[A-Za-z]{3}" // optional pattern
 * })
 * ```
 *
 * For more information about options or events see {@link BaseController}
 */
@customElement('gui-text-controller')
export class TextController extends BaseController {
  @property({ type: Number }) min: number
  @property({ type: Number }) max: number
  @property({ type: String }) pattern: string

  constructor(parameters: TextControllerConstructor) {
    super(parameters)
    const { min, max, pattern } = parameters
    this.min = min ? min : -Infinity
    this.max = max ? max : Infinity
    this.pattern = pattern ? pattern : null
  }

  /**
   * @ignore
   */
  static isCompatible(value: unknown, _: string, params: any): boolean {
    return (
      typeof value === 'string' ||
      value instanceof String ||
      (params.type === 'string' && typeof String(value) === 'string')
    )
  }

  protected onInput(event) {
    this.set(event.target.value)
    super.onInput(event)
  }

  protected onChange(event) {
    this.set(event.target.value)
  }

  /**
   * @ignore
   */
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
            .pattern=${this.pattern}
            .disabled=${this.disabled}
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

  /**
   * @ignore
   */
  public static styles = css`
    /*minify*/
    ${BaseController.styles}
  `
}
