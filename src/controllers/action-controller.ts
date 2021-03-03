import { html, property, customElement, css } from 'lit-element'
import { BaseController, ControllerConstructor } from '../controller'
import '@/components/elements/button'

interface ActionControllerConstructor extends ControllerConstructor {}

/**
 * ActionController is a controller used to trigger JS functions
 * ## How to use
 * ``` javascript
 * const callback = (a, b) => {
 *   return a + b
 * }
 * const target = { action: callback }
 *
 * // Method 1
 * const action = group.action(callback, { args: [1, 2] })
 *
 * // Method 2
 * action = group.add('action', target, { args: [1, 2] })
 *
 * // Manually trigger action
 * action.run()
 * ```
 *
 * For more information about basic use see {@link BaseController}
 */
@customElement('gui-action-controller')
export class ActionController extends BaseController {
  args: Array<ControllerConstructor> = []

  /**
   * @ignore
   */
  constructor(parameters: ActionControllerConstructor) {
    super(parameters)
  }

  /**
   * @ignore
   */
  static isCompatible(value: unknown, _: string, __: any): boolean {
    return typeof value === 'function'
  }

  protected onInput(event) {
    this.set(event.target.value)
    super.onInput(event)
  }

  protected onChange(event) {
    this.set(event.target.value)
  }

  /**
   * Execute the action
   */
  run() {
    this.value(...this.args)
  }

  /**
   * @ignore
   */
  render() {
    return html`
      <div>
        <label>${this.name}</label>
        <div class="right">
          <gui-button @click=${() => this.run()}>Execute</gui-button>
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
    .right > gui-button {
      flex: none;
      display: inline-block;
    }
  `
}
