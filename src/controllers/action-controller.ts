import { html, property, customElement, css } from 'lit-element'
import { BaseController, ControllerConstructor } from '../controller'
import '@/components/elements/button'

interface ActionControllerConstructor extends ControllerConstructor {}

@customElement('gui-action-controller')
export class ActionController extends BaseController {
  @property() name: string
  @property() args: Array<ControllerConstructor> = []

  public static styles = css`
    /*minify*/
    ${BaseController.styles}
    .right > gui-button {
      flex: none;
      display: inline-block;
    }
  `

  constructor(parameters: ActionControllerConstructor) {
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
    //   return getControllerConstructor()
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
