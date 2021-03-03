import { html, property, customElement, css, query } from 'lit-element'
import { BaseController, ControllerConstructor } from '../controller'

interface SelectChoice {
  label: string
  value: string
}

interface SelectConstructor extends ControllerConstructor {
  choices: Array<SelectChoice | string>
}

/**
 * ## How to use
 * ``` javascript
 * const target = { property: 1 }
 * group.add('property', target, {
 *   choices: [1, 2, { value: 3, label: "Default" }]
 * })
 * ```
 *
 * For more information about options or events see {@link BaseController}
 */
@customElement('gui-select-controller')
export class SelectController extends BaseController {
  /**
   * @ignore
   */
  @query('select') select: HTMLSelectElement
  choices: Array<SelectChoice> = []

  constructor(parameters: SelectConstructor) {
    super(parameters)
    if (parameters.choices) {
      this.choices = parameters.choices.map(c => {
        if (typeof c === 'object' && c.label && c.value) {
          return c as SelectChoice
        }
        return { label: c, value: c } as SelectChoice
      })
    }
  }

  /**
   * @ignore
   */
  static isCompatible(value: unknown, _: string, params: any): boolean {
    return params.choices instanceof Array || params.type == 'select'
  }

  /**
   * @override
   */
  protected onChange(event) {
    this.set(this.select.options[this.select.selectedIndex].value)
    super.onChange(event)
    super.onInput(event)
  }

  /**
   * @ignore
   */
  render() {
    return html`
      <div>
        <label>${this.name}</label>
        <div class="right">
          <select @change=${e => this.onChange(e)} .disabled=${this.disabled}>
            ${this.choices.map(option => {
              return html`
                <option value=${option.value}>${option.label}</option>
              `
            })}
          </select>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000000"
            strokewidth="5"
            strokelinecap="square"
            strokelinejoin="arcs"
          >
            <path d="M18 15l-6-6-6 6"></path>
          </svg>
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

    select {
      appearance: none;
      padding: 4px 1em 4px 0;
      width: 100%;
      cursor: inherit;
      grid-template-areas: 'select';
    }

    select::-ms-expand {
      display: none;
    }

    .right svg {
      position: absolute;
      right: 0;
      width: 15px;
      height: 20px;
      transform: rotate(180deg);
    }
  `
}
