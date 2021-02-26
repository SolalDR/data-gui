import { html, property, customElement, css } from 'lit-element'
import { BaseField, FieldConstructor } from '../field'
import './elements/button'
// import { getFieldConstructor } from '../helpers/get-field-constructor'

interface FunctionFieldConstructor extends FieldConstructor {}

interface ArgumentObjectFunction extends FieldConstructor {
  value: unknown
}

type ArgumentFunction = ArgumentObjectFunction | unknown

@customElement('gui-function-field')
export class FunctionField extends BaseField {
  @property() name: string
  @property() args: Array<FieldConstructor> = []

  public static styles = css`
    /*minify*/
    ${BaseField.styles}
    .right > gui-button {
      flex: none;
      display: inline-block;
    }
  `

  constructor(parameters: FunctionFieldConstructor) {
    super(parameters)
  }

  protected validate(value: string) {
    return value
  }

  static isCompatible(value: unknown): boolean {
    return typeof value === 'function'
  }

  protected onInput(event) {
    this.set(event.target.value)
    super.onInput(event)
  }

  protected onChange(event) {
    this.set(event.target.value)
  }

  run() {
    this.value(...this.args)
  }

  render() {
    // const arguments = this.args.map(argument => {
    //   return getFieldConstructor()
    // })
    return html`
      <div>
        <label>${this.name}</label>
        <div class="right">
          <gui-button @click=${() => this.run()}>Execute</gui-button>
        </div>
      </div>
    `
  }
}
