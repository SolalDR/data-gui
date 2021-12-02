import { html, customElement, css, property, query } from 'lit-element'
import { BaseController, ControllerConstructor } from '../controller'
import { GUI } from '../components/gui';

interface CanvasControllerConstructor extends ControllerConstructor{
  width?: number
  height?: number
}

/**
 * CanvasController is a controller used in 3D
 * ## How to use
 * ``` javascript

 * ```
 * For more information about basic use see {@link BaseController}
 */
@customElement('gui-canvas-controller')
export class CanvasController extends BaseController {
  width: number = 512
  height: number = 512

  /**
   * Public access to generated canvas
   */
  @query('canvas') public canvas: HTMLCanvasElement

  /**
   * If not defined `step` will be calculated automatically based on initial value
   */
  @property({ type: Number }) step: number

  constructor(parameters: CanvasControllerConstructor) {
    super(parameters)
    if (parameters.width && !isNaN(parameters.width)) this.width = parameters.width;
    if (parameters.height && !isNaN(parameters.height)) this.height = parameters.height;

  }

  /**
   * @ignore
   */
  firstUpdated() {
    this.value = this.canvas;
    this.target[this.property] = this.canvas;
    setTimeout(() => {
      console.log(this.canvas)
    }, 1000)
    
    super.connectedCallback()
  }

  /**
   * @ignore
   */
  static isCompatible(value: unknown, _: string, params: any): boolean {
    return !!(params.type === 'canvas')
  }
    
  /**
   * @ignore
   */
  render() {
    return html`
      <div>
        <label>${this.name}</label>
        <canvas></canvas>
      </div>
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

    .input-channel {
      margin-left: 5px;
      min-width: 37px;
      max-width: 37px;
    }

    .input-container {
      justify-content: flex-end;
      flex-direction: row;
    }
  `
}

GUI.register(CanvasController)