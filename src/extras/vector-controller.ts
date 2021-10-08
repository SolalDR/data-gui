import { html, customElement, css, query } from 'lit-element'
import { BaseController } from '../controller'
import { GUI } from '../components/gui';
import { Group } from '../components/group'
import '@/components/elements/button'

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
 * const action = group.action(callback, { args: [{ value: 1, name: 'a'}, { value: 1, name: 'b'}] })
 *
 * // Method 2
 * action = group.add('action', target, { args: [{ value: 1, name: 'a'}, { value: 1, name: 'b'}] })
 *
 * // Manually trigger action
 * action.run()
 * ```
 *
 * For more information about basic use see {@link BaseController}
 */
@customElement('gui-vector-controller')
export class VectorController extends BaseController {

  /**
   * @ignore
   */
  @query('gui-group') private argumentGroup: Group

  /**
   * @ignore
   */
  static isCompatible(value: unknown, _: string, __: any): boolean {
    return value === 5
  }

  /**
   * @ignore
   */
  firstUpdated() {
    // this.arguments.forEach(arg => {
    //   this.argumentsTarget[arg.name] = arg.value;
    //   const params = {...arg}
    //   delete params.name
    //   delete params.value
    //   this.argumentGroup.add(arg.name, this.argumentsTarget, params)
    // })
  }

  /**
   * @ignore
   */
  render() {
    return html`
      <p>Salut</p>
    `
  }

  /**
   * @ignore
   */
  public static styles = css`
    /*minify*/
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

GUI.register(VectorController)