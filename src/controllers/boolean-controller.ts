import { html, customElement, css, query } from 'lit-element'
import { BaseController, ControllerConstructor } from '@/core/controller'

/**
 * @category Constructor
 */
export interface BooleanControllerConstructor extends ControllerConstructor {}

/**
 * ## How to use
 * ``` javascript
 * const target = { property: false }
 * group.add('property', target)
 * ```
 *
 * For more information about options or events see {@link BaseController}
 * 
 * @category Controller
 */
@customElement('gui-boolean-controller')
export class BooleanController extends BaseController {
  /**
   * @ignore
   */
  @query('input') input: HTMLInputElement

  /**
   * @ignore
   */
  constructor(parameters: BooleanControllerConstructor) {
    super(parameters)
  }

  /**
   * @ignore
   */
  static isCompatible(value: unknown, _: string, __: any): boolean {
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

  /**
   * @ignore
   */
  render() {
    return html`
      <div>
        <label>${this.name}</label>
        <div class="right">
          <input
            .disabled=${this.disabled}
            .value=${this.value}
            .checked=${this.value}
            type="checkbox"
            @change=${event => {
              this.onChange(event)
            }}
          />
          <span
            .data-checked=${this.value ? '1' : '2'}
            class="customCheckbox"
          ></span>
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
    input[type="checkbox"] {
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
    input[value='true'] + .customCheckbox {
      background: var(--color-primary);
    }
  `
}
