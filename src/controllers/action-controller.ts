import { html, customElement, css, query } from 'lit-element'
import { BaseController, ControllerConstructor } from '@/core/controller'
import { Group } from '@/components/group'
import '@/components/elements/button'

export interface ActionControllerArgument {
  name: string
  value: unknown
}

/**
 * @category Constructor
 */
export interface ActionControllerConstructor extends ControllerConstructor {
  args?: ActionControllerArgument[]
}

/**
 * ActionController is a controller used to trigger JS functions
 * 
 * ## How to use
 * ``` javascript
 * 
 * const callback = (a, b) => {
 *   return a + b
 * }
 * const target = { action: callback }
 *
 * // Method 1
 * const action = group.action(callback, { args: [{ value: 1, name: 'a'}, { value: 1, name: 'b'}] })
 *
 * // Method 2
 * action = group.add('action', target, { args: [{ value: 1, name: 'a'}, { value: 1, name: 'b'}] })
 *
 * // Manually trigger action
 * action.run()
 * ```
 *
 * More information
 * {@link ActionControllerConstructor}
 * {@link BaseController}
 * 
 * @category Controller
 */
@customElement('gui-action-controller')
export class ActionController extends BaseController {
  private arguments: ActionControllerArgument[]
  private argumentsTarget: object = {}

  /**
   * @ignore
   */
  @query('gui-group') private argumentGroup: Group

  /**
   * @ignore
   * @todo Check args validity
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
      this.argumentsTarget[arg.name] = arg.value;
      const params = {...arg}
      delete params.name
      delete params.value
      this.argumentGroup.add(arg.name, this.argumentsTarget, params)
    })
  }

  /**
   * Execute the action
   */
  run(event) {
    event.stopPropagation()
    this.value(...(this.arguments.map(arg => this.argumentsTarget[arg.name])))
  }

  /**
   * @ignore
   */
  render() {
    return html`
      <gui-group .name=${this.name}>
        <gui-button class="play-button" @click=${(event) => this.run(event)}>
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
    :host {
      height: auto;
    }
    svg {
      height: 1em;
    }
    .play-button {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-right: var(--padding-s);
    }
  `
}
