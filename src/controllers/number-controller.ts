import { html, property, customElement, css, query } from 'lit-element'
import { BaseController, ControllerConstructor } from '../controller'
import { computeStep } from '@/helpers/compute-step'

interface NumberControllerConstructor extends ControllerConstructor {
  min?: number
  max?: number
  step?: number
  range?: boolean
}

/**
 * ## How to use
 * ``` javascript
 * const target = { property: 1 }
 *
 * // Display an `input[type='number']`
 * group.add('property', target)
 *
 * // Display an `input[type='range']`
 * group.add('property', target, { min: -1, max: 1, step: 0.1 })
 *
 * // Display an `input[type='range']`
 * group.add('property', target, { range: true })
 * ```
 *
 * For more information about options or events see {@link BaseController}
 */
@customElement('gui-number-controller')
export class NumberController extends BaseController {
  /**
   * If not defined `step` will be calculated automatically based on initial value
   */
  @property({ type: Number }) step: number
  /**
   * If not defined `min` will be calculated automatically based on initial value
   */
  @property({ type: Number }) min: number
  /**
   * If not defined `max` will be calculated automatically based on initial value
   */
  @property({ type: Number }) max: number
  /**
   * If `min` or `max` are defined, range will be equal to `true` by default
   */
  @property({ type: Boolean }) range: boolean
  /**
   * @ignore
   */
  @query('input[type="range"]') private rangeInput

  constructor(parameters: NumberControllerConstructor) {
    super(parameters)
    const { min, max, range, step } = parameters
    this.range = typeof range === 'boolean' ? range : !!(!isNaN(min) && !isNaN(max))
    this.min = !isNaN(min)
      ? min
      : this.range
      ? this.computeDefaultRange()[0]
      : -Infinity
    
    this.max = !isNaN(max) ? max : this.range ? this.computeDefaultRange()[1] : Infinity
    this.step = step ? step : computeStep(this.value, this.max)
  }

  protected computeDefaultRange(value = this.value) {
    let vAbs = Math.abs(value),
      r = 0,
      pow = 0
    while (vAbs > (r = 10 ** pow || r)) pow++
    return [value < 0 ? -r : 0, r]
  }

  /**
   * @ignore
   */
  static isCompatible(value: unknown, _: string, params: any): boolean {
    return (
      typeof value === 'number' ||
      (!isNaN(Number(value)) && params.type === 'number')
    )
  }

  /**
   * @override
   * Validate and format the value
   */
  protected validate(value: number): number {
    return Math.max(Math.min(value, this.max), this.min)
  }

  /**
   * @override
   */
  protected onInput(value) {
    this.set(Number(value))
    super.onInput(value)
  }

  /**
   * @override
   */
  protected onChange(value) {
    this.set(Number(value))
    super.onChange(value)
  }

  /**
   * @ignore
   */
  protected onSlide(event) {
    const delta = ~~(event.distance * 0.1) * this.step
    const newValue = Number(event.startValue) - delta
    this.set(newValue)
  }

  /**
   * @ignore
   */
  firstUpdated() {
    if (this.rangeInput) {
      this.rangeInput.value = this.value
    }
  }

  /**
   * @ignore
   */
  render() {
    const inputNumber = html`
      <gui-input
        class="input-channel"
        type="number"
        .value=${String(this.value)}
        .step=${this.step}
        @input=${event => this.onInput(event.detail)}
        @slide=${event => this.onSlide(event.detail)}
      ></gui-input>`

    const inputRange = this.range ? html`
      <input
        type='range'
        .value=${String(this.value)}
        .min=${String(this.min)}
        .max=${String(this.max)}
        .step=${String(this.step)}
        .disabled=${this.disabled}
        @input=${event => {
          this.onInput(event.target.value)
        }}
        @change=${event => {
          this.onChange(event.target.value)
        }}
      />
    ` : ''

    const containerClass = 'input-container right ' + (this.range ? 'input-container--withRange' : '')
    return html`
      <div>
        <label>${this.name}</label>
        <div class=${containerClass}>
          ${inputRange}
          ${inputNumber}
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

    gui-input {
      max-width: 30px;
      margin-left: 5px;
    }

    .input-container {
      flex-direction: row;
      justify-content: flex-end;
      padding-left: var(--padding-s);
    }

    .input-container--withRange {
      justify-content: space-between;
      max-width: 120px;
      min-width: 120px;
    }
    
    input {
      height: var(--item-height);
      max-height: none;
      text-align: right;
    }

    input[type='range'] ~ input[type='number'] {
      text-align: right;
      width: auto;
      flex: none;
      min-width: 30px;
      -webkit-appearance: none;
    }

    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Firefox */
    input[type='number'] {
      -moz-appearance: textfield;
    }

    input[type='range'] {
      -webkit-appearance: none;
    }
    input[type='range']::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      background-color: var(--color-text-primary);
      width: 6px;
      height: 6px;
      border-radius: 6px;
      transition: 0.15s;
      transform: translateY(calc(1px - 50%));
    }
    input[type='range']:active::-webkit-slider-thumb {
      background-color: var(--color-text-primary);
    }
    input[type='range']::-moz-slider-thumb {
      -moz-appearance: none;
      appearance: none;
      appearance: none;
      background-color: var(--color-text-primary);
      width: 6px;
      height: 6px;
      border-radius: 6px;
      transition: 0.15s;
      transform: translateY(calc(1px - 50%));
    }
    input[type='range']:active::-moz-slider-thumb {
      background-color: var(--color-text-primary);
    }
    input[type='range']::-ms-slider-thumb {
      -ms-appearance: none;
      appearance: none;
      appearance: none;
      background-color: var(--color-text-primary);
      width: 6px;
      height: 6px;
      border-radius: 6px;
      transition: 0.15s;
      transform: translateY(calc(1px - 50%));
    }
    input[type='range']:active::-ms-slider-thumb {
      background-color: var(--color-text-primary);
    }
    input[type='range']::-webkit-slider-runnable-track {
      background-color: var(--color-text-primary);
      height: 1px;
      border-radius: 2px;
    }
    input[type='range']::-moz-range-track {
      background-color: var(--color-text-primary);
      height: 1px;
      border-radius: 2px;
    }
    input[type='range']::-ms-track {
      background-color: var(--color-text-primary);
      height: 1px;
      border-radius: 2px;
    }
  `
}
