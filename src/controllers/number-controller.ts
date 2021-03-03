import { html, property, customElement, css, query } from 'lit-element'
import { BaseController, ControllerConstructor } from '../controller'

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
    this.range = typeof range === 'boolean' ? range : !!(min && max)
    this.min = min
      ? min
      : this.range
      ? this.computeDefaultRange()[0]
      : -Infinity
    this.max = max ? max : this.range ? this.computeDefaultRange()[1] : Infinity
    this.step = step ? step : this.computeDefaultStep()
  }

  protected computeDefaultRange(value = this.value) {
    let vAbs = Math.abs(value),
      r = 0,
      pow = 0
    while (vAbs > (r = 10 ** pow || r)) pow++
    return [value < 0 ? -r : 0, r]
  }

  protected computeDefaultStep(value: number = this.value): number {
    if (this.max) return this.max / 100
    if (Math.abs(value) < 1 && value !== 0) return 0.001
    if (Math.abs(value) < 10 || value === 0) return 0.1
    return 1
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
  protected onInput(event) {
    this.set(Number(event.target.value))
    super.onInput(event)
  }

  /**
   * @override
   */
  protected onChange(event) {
    this.set(Number(event.target.value))
    super.onChange(event)
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
    const rangeInputNumber = this.range
      ? html`
          <input
            type="number"
            .value=${this.value}
            .min=${String(this.min)}
            .max=${String(this.max)}
            .step=${String(this.step)}
            @input=${event => {
              this.onInput(event)
            }}
            @change=${event => {
              this.onChange(event)
            }}
          />
        `
      : ''

    return html`
      <div>
        <label>${this.name}</label>
        <div class="right">
          <input
            .type=${this.range ? 'range' : 'number'}
            .value=${String(this.value)}
            .min=${String(this.min)}
            .max=${String(this.max)}
            .step=${String(this.step)}
            .disabled=${this.disabled}
            @input=${event => {
              this.onInput(event)
            }}
            @change=${event => {
              this.onChange(event)
            }}
          />
          ${rangeInputNumber}
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

    .right {
      flex-direction: row;
      justify-content: space-between;
    }
    input {
      height: var(--item-height);
      max-height: none;
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
      width: 10px;
      height: 10px;
      border-radius: 10px;
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
      width: 10px;
      height: 10px;
      border-radius: 10px;
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
      width: 10px;
      height: 10px;
      border-radius: 10px;
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
