import { html, property, customElement, css, query } from 'lit-element'
import { BaseField, FieldConstructor } from '../field'

@customElement('gui-image-field')
export class ImageField extends BaseField {
  @property() name: string
  @query('input') input: HTMLInputElement

  public static styles = css`
    /*minify*/
    ${BaseField.styles}
    :host {
      min-height: 50px;
    }
    :host > div  {
      height: 100%;
    }
    .right {
      grid-template-areas: 'block';
      display: grid !important;
    }
    input {
      grid-area: block;
      min-height: 100%;
      opacity: 0;
    }
    img {
      grid-area: block;
      object-fit: cover;
      border-radius: 5px;
      height: 40px !important;
      margin: 5px 0;
    }
  `

  constructor(parameters: FieldConstructor) {
    super(parameters)
  }

  static isCompatible(value: unknown, property: string, params: any): boolean {
    return !!(
      params.type === 'image' ||
      (typeof value === 'string' && value.match(/.+?(png|jpe?g|webp|gif|bmp)$/))
    )
  }
  
  /**
   * @override
   */
  protected onChange(event) {
    const file = this.input.files && this.input.files[0]
    if (!file) return;
    if (!file.type.match('image')) return;
    const blob = URL.createObjectURL(file)
    this.set(blob)
    super.onChange(event)
    super.onInput(event)
  }

  render() {
    return html`
      <div>
        <label>${this.name}</label>
        <div class="right">
          <img src=${this.value}>
          <input type="file" @change=${(event) => this.onChange(event)} />
        </div>
      </div>
    `
  }
}
