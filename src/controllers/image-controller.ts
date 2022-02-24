import { html, customElement, css, query } from 'lit-element'
import { BaseController, ControllerConstructor } from '@/core/controller'

/**
 * @category Constructor
 */
export interface ImageControllerConstructor extends ControllerConstructor {}

/**
 * ## How to use
 * ``` javascript
 * const target = {
 *   image1: "https://path/to/image.png",
 *   image2: "https://path/to/image"
 * }
 *
 * // Automatically detect extension
 * group.add('image1', target) // Automatically detect extension
 *
 * // Force image type
 * group.add('image2', target, { type: 'image' })
 * ```
 *
 * For more information about options or events see {@link BaseController}
 * 
 * @category Controller
 */
@customElement('gui-image-controller')
export class ImageController extends BaseController {
  /**
   * @ignore
   */
  @query('input') input: HTMLInputElement

  constructor(parameters: ImageControllerConstructor) {
    super(parameters)
  }

  /**
   * @ignore
   */
  static isCompatible(value: unknown, _: string, params: any): boolean {
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
    if (!file) return
    if (!file.type.match('image')) return
    const blob = URL.createObjectURL(file)
    this.set(blob)
    super.onChange(event)
    super.onInput(event)
  }

  /**
   * @ignore
   */
  render() {
    return html`
      <div>
        <label>${this.name}</label>
        <div class="right">
          <img src=${this.value} />
          <input
            type="file"
            @change=${event => this.onChange(event)}
            .disabled=${this.disabled}
          />
        </div>
      </div>
    `
  }

  /**
   * @ignore
   */
  public static styles = css`
    /*minify*/
    ${BaseController.styles} :host {
      min-height: 50px;
    }
    :host > div {
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
}
