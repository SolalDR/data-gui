import { html, property, customElement, css, query } from 'lit-element'
import { BaseController, ControllerConstructor } from '../controller'
import { Group } from '../components/group'
import '@/components/elements/button'

interface ActionControllerConstructor extends ControllerConstructor {
  args?: any[]
}

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
  arguments: any[]
  args: Array<ControllerConstructor> = []
  target: object = {}
  
  /**
   * @ignore
   */
  @property() private computedClass: string = ''

  /**
  * @ignore
  */
  @property() private computedStyle: string = ''

  /**
   * @ignore
   */
  @query('gui-group') argumentGroup: Group

  /**
   * @ignore
   */
  constructor(parameters: ActionControllerConstructor) {
    super(parameters)
    this.arguments = parameters.args || [];
  }

  /**
   * @ignore
   */
  static isCompatible(value: unknown, _: string, __: any): boolean {
    return typeof value === 'function'
  }


  /**
   * @ignore
   */
  firstUpdated() {
    this.arguments.forEach(arg => {
      this.target[arg.name] = arg.value;
      const params = {...arg}
      delete params.name
      delete params.value
      this.argumentGroup.add(arg.name, this.target, params)
    })
  }

  onCollapse() {
    // this.computedClass = this.argumentGroup.opened ? 'group group--open' : 'group'
    // const height = this.argumentGroup
    //   ? this.argumentGroup.offsetHeight + 40
    //   : 1000
    // this.computedStyle = `--group-height: ${height}px;`
    console.log('collapse')
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
  run(event) {
    event.stopPropagation()
    this.value(...(this.arguments.map(arg => this.target[arg.name])))
  }

  /**
   * @ignore
   */
  render() {
    return html`
      <gui-group
        @collapse=${() => this.onCollapse()}
        .name=${this.name}
      >
        <gui-button @click=${(event) => this.run(event)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        </gui-button>
      </gui-group>
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
    :host {
      height: auto;
    }
    svg {
      height: 1em;
    }
    gui-button {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-right: var(--padding-s);
    }
  `
}
