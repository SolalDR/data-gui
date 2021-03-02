import { html, property, customElement, css, query } from 'lit-element'
import { BaseController, ControllerConstructor } from '../controller'
import { Color, isColor } from '@/helpers/color-helper'
import '@/components/elements/input'

interface ColorControllerConstructor extends ControllerConstructor {
  name?: string
}

@customElement('gui-color-controller')
export class ColorController extends BaseController {
  color: Color
  inputValue: string
  labelValue: string
  @property() name: string
  @query('input') input: HTMLElement

  public static styles = css`
    /*minify*/
    ${BaseController.styles}
    .input-color {
      max-width: 20px;
      height: 100%;
    }

    .input-color span {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      background-color: var(--value);
      display: block;
      border-radius: 10px;
      box-shadow: var(--shadow);
    }

    .input-color input {
      --value-attr: attr('value');
      width: 100%;
      /* width: 20px; */
      border: 0;
      border-radius: 10px;
      padding: 0;
      opacity: 0;
    }

    .input-channel {
      min-width: 32px;
      max-width: 32px;
    }

    .input-channel[label='A'] {
      min-width: 40px;
      max-width: 40px;
    }

    .right {
      justify-content: flex-start;
      flex-direction: row;
    }

    gui-input {
      max-width: 50px;
      margin-left: 5px;
    }
  `

  constructor(parameters: ColorControllerConstructor) {
    super(parameters)
  }

  firstUpdated() {
    this.input.setAttribute('value', this.color.getHexString())
  }

  connectedCallback() {
    this.color = new Color(this.value)
    this.updateInputValue()
    super.connectedCallback()
  }

  protected validate(value: string) {
    return value
  }

  static isCompatible(value: unknown): boolean {
    return isColor(value)
  }

  protected updateInputValue() {
    const hexValue = this.color.getHexString()
    this.labelValue = this.color.getRgbString()
    if (hexValue.length === 9) {
      this.inputValue = hexValue.substring(0, 7)
    } else {
      this.inputValue = hexValue
    }
  }

  protected onInput(event) {
    this.color.setStyle(event.target.value)
    this.set(this.color.format())
    this.updateInputValue()
    super.onInput(event)
  }

  protected onChange(event) {
    this.color.setStyle(event.target.value)
    this.set(this.color.format())
    this.updateInputValue()
    super.onChange(event)
  }

  protected onInputChannel(channel, value) {
    if (channel === 'a') {
      this.color.setAlpha(Number(value))
    } else {
      this.color[channel] = Number(value) / 255
    }
  }

  protected onChangeChannel(channel, value) {
    if (channel === 'a') {
      this.color.setAlpha(Number(value))
    } else {
      this.color[channel] = Number(value) / 255
    }
    this.set(this.color.format())
    this.updateInputValue()
  }

  render() {
    const alpha = this.color.alphaEnabled
      ? html`
          <gui-input
            class="input-channel"
            .value=${String(this.color.a)}
            label="A"
            type="number"
            @change=${event => this.onChangeChannel('a', event.detail)}
            @input=${event => this.onInputChannel('a', event.detail)}
          ></gui-input>
        `
      : ''

    return html`
      <div>
        <label>${this.name}</label>
        <div class="right" .style=${`--value: ${this.labelValue}`}>
          <div class="input-color">
            <span></span>
            <input
              type="color"
              .value=${this.inputValue}
              @input=${event => {
                this.onInput(event)
              }}
              @change=${event => {
                this.onChange(event)
              }}
            />
          </div>

          <gui-input
            class="input-channel"
            type="number"
            .value=${String(~~(this.color.r * 255))}
            label="R"
            @change=${event => this.onChangeChannel('r', event.detail)}
            @input=${event => this.onInputChannel('r', event.detail)}
          ></gui-input>
          <gui-input
            class="input-channel"
            type="number"
            .value=${String(~~(this.color.g * 255))}
            label="G"
            @change=${event => this.onChangeChannel('g', event.detail)}
            @input=${event => this.onInputChannel('g', event.detail)}
          ></gui-input>
          <gui-input
            class="input-channel"
            type="number"
            .value=${String(~~(this.color.b * 255))}
            label="B"
            @change=${event => this.onChangeChannel('b', event.detail)}
            @input=${event => this.onInputChannel('b', event.detail)}
          ></gui-input>
          ${alpha}
          <!-- <input
            type="text"
            .value=${this.value}
            @input=${event => {
            this.onInput(event)
          }}
            @change=${event => {
            this.onChange(event)
          }}
          /> -->
        </div>
      </div>
    `
  }
}
