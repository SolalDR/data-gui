import { html, property, customElement, css, query } from 'lit-element'
import { BaseField, FieldConstructor } from '../field'

interface SelectChoice {
  label: string
  value: string
}

interface SelectConstructor extends FieldConstructor {
  choices: Array<SelectChoice | string>
}

@customElement('gui-select-field')
export class SelectField extends BaseField {
  @property() name: string
  @query('select') select: HTMLSelectElement
  choices: Array<SelectChoice>

  public static styles = css`
    /*minify*/
    ${BaseField.styles}

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

  constructor(parameters: SelectConstructor) {
    super(parameters)
    this.choices = parameters.choices.map(c => {
      if (typeof c === 'object' && c.label && c.value) {
        return c as SelectChoice
      }
      return { label: c, value: c } as SelectChoice
    })
  }

  static isCompatible(value: unknown, property: string, params: any): boolean {
    return params.choices instanceof Array
  }

  /**
   * @override
   */
  protected onChange(event) {
    const v = this.select.options[this.select.selectedIndex].value
    this.set(v)

    console.log(v)
    super.onChange(event)
    super.onInput(event)
  }

  render() {
    return html`
      <div>
        <label>${this.name}</label>
        <div class="right">
          <select @change=${e => this.onChange(e)}>
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
}
