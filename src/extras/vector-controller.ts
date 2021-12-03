import { html, customElement, css, property } from 'lit-element'
import { BaseController, ControllerConstructor } from '../controller'
import { GUI } from '../components/gui';
import { computeStep } from '@/helpers/compute-step'

// import { Group } from '../components/group'
// import '@/components/elements/button'

interface VectorControllerConstructor extends ControllerConstructor{
  step?: number
}

interface Vector {
  x: number
  y: number
  z?: number
  w?: number
}

/**
 * VectorController is a controller used in 3D
 * ## How to use
 * ``` javascript

 * ```
 * For more information about basic use see {@link BaseController}
 */
@customElement('gui-vector-controller')
export class VectorController extends BaseController {
  declare value: Vector
  keys: string[]

  /**
   * @ignore
   */
  @property({ type: Object }) _value: Vector

  /**
   * If not defined `step` will be calculated automatically based on initial value
   */
  @property({ type: Number }) step: number

  constructor(parameters: VectorControllerConstructor) {
    super(parameters)
    this.step = parameters.step ? parameters.step : computeStep(this.value.x)
  }

  /**
   * @ignore
   */
  static isCompatible(value: Vector, _: string, __: any): boolean {
    return !!(value && value.x !== undefined && value.y !== undefined && !isNaN(value.x) && !isNaN(value.y))
  }

  /**
   * @ignore
   */
  protected onInputChannel(channel: string, value) {
    this.value[channel] = value;
    this.renderValue();
  }

  /**
   * @ignore
   */
  protected onChangeChannel(channel: string, value) {
    this.value[channel] = value;
    this.renderValue();
  }

  /**
   * @ignore
   */
  protected onSlideChannel(channel: string, event) {
    const delta = ~~(event.distance * 0.1) * this.step
    const newValue = Number(event.startValue) - delta
    this.onChangeChannel(channel, newValue)
  }

  /**
   * @ignore
   * Recreate _value to force rendering
   */
  renderValue() {
    this._value = this.keys.reduce((acc, key) => {
      acc[key] = this.value[key]
      return acc;
    }, {}) as Vector
  }

  /**
   * @ignore
   * Initialize value and define allowed keys
   */
  connectedCallback() {
    this.keys = Object.keys(this.value).filter(k => {
      return ['x', 'y', 'z', 'w'].includes(k)
    })

    this.renderValue()
    super.connectedCallback()
  }
    
  /**
   * @ignore
   */
  render() {
    const inputs = this.keys.map(k => {
      return html`<gui-input
        class="input-channel"
        type="number"
        .value=${String(this._value[k])}
        .step=${this.step}
        label=${k.toUpperCase()}
        @change=${event => this.onChangeChannel(k, event.detail)}
        @input=${event => this.onInputChannel(k, event.detail)}
        @slide=${event => this.onSlideChannel(k, event.detail)}
      ></gui-input>`
    })

    return html`
      <div>
        <label>${this.name}</label>
        <div class="input-container right">
          ${inputs}
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
    :host {
      height: auto;
    }
    svg {
      height: 1em;
    }

    .input-channel:not(:first-child) {
      margin-left: 5px;
    }

    .input-container {
      justify-content: flex-end;
      flex-direction: row;
    }
  `
}

GUI.register(VectorController)