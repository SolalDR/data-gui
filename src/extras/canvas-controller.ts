import { html, customElement, css, property, queryAsync } from 'lit-element'
import { BaseController, ControllerConstructor } from '../controller'
import { GUI } from '../components/gui';

interface CanvasControllerConstructor extends ControllerConstructor{
  width?: number
  height?: number
}

/**
 * CanvasController is a controller used to display a simple blank canvas. It can be used for debuging texture
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
  @queryAsync('canvas') public canvas: Promise<HTMLCanvasElement>

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
  connectedCallback() {

    super.connectedCallback();

    this.canvas.then((canvas) => {
      this.value = canvas;
      this.target[this.property] = canvas;
    })
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
        <div class="right">
          <canvas
            .width=${this.width}
            .height=${this.height}
          ></canvas>
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
    div {
      flex-wrap: wrap;
    }
    :host {
      height: auto;
    }
    canvas {
      width: 100%;
      margin: 5px 0; 
      object-fit: contain;
      flex: 1;
      border: 1px solid var(--color-primary); 
      border-radius: var(--radius);
    }
  `
}

GUI.register(CanvasController)