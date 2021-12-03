import { property, css } from 'lit-element'
import { WebComponent } from '@/component'
import raf from '@solaldr/raf'
import { BaseGroup } from './group'

// TODO remove
;(window as any).raf = raf

export interface ControllerConstructor {
  name?: string
  listen?: boolean
  target?: Object
  property?: string
  parent?: BaseGroup
  disabled?: boolean
}

/**
 * `BaseController` is the common class used by all others controllers.
 *
 * ## How to use
 * ```javascript
 * const target = { property: 1 }
 * const controller = group.add('property', target, {
 *   // Displayed name
 *   name: "My Custom Name",
 *   // If target change, the controller will be updated (default is false)
 *   listen: true
 *   // Disabled the input, usefull for read only variable
 *   disabled: true
 * })
 * ```
 *
 * ## Deal with events
 *
 * Three kinds of events are emitted by all the controllers
 * - `input` : Trigger when an `input` event is trigger by an `HTMLInputElement`
 * - `change` : Trigger when an `change` event is trigger by an `HTMLInputElement`
 * - `update` : Trigger when a modification is made on the target property. It's the most common way to use `data-gui`
 *
 * ### Listen to event
 *
 * #### Method one
 * ``` javascript
 * myController.on('update', (newValue) => console.log(newValue))
 * ```
 *
 * #### Method two (using `web-component` and `CustomEvent`)
 * ``` javascript
 * myController.addEventListener('update', ({ detail }) => console.log(detail))
 * ```
 *
 * ### Remove listener
 * You can use either `off` or `removeEventListener` to do so.
 */
export class BaseController extends WebComponent {
  /**
   * If true, the controller value will be updated automatically if `target` object is modified.
   * *Carefull: heavy use may reduce performance*
   * ``` javascript
   * group.add('someProperty', target, { listen: true })
   * ```
   */
  listen: boolean = false

  /**
   * If true, the controller will not be editable
   */
  disabled: boolean = false

  /**
   * Display name of a controller, defaultly equal to `property`.
   * ``` javascript
   * group.add('someProperty', target, { name: 'Custom display name' })
   * ```
   */
  @property() name: string

  /**
   * property controlled in the target object
   */
  @property() property: string

  /**
   * source object in which the property key is defined
   */
  @property() target: Object

  /**
   * @ignore
   */
  @property() protected value: any

  parent: BaseGroup
  private listenCallback: Function

  public constructor(parameters: ControllerConstructor)
  constructor({
    name = null,
    listen = false,
    property = null,
    target = null,
    parent = null,
    disabled = false,
  }: ControllerConstructor = {}) {
    super()
    this.parent = parent
    this.property = property
    this.target = target
    this.name = name ? name : this.property
    this.value = this.target[this.property]
    this.listen = listen
    this.disabled = disabled
  }

  /**
   * @ignore
   */
  connectedCallback() {
    super.connectedCallback()
    this.listenCallback = () => this.forceUpdate()
    if (this.listen) {
      raf.addTick(this.listenCallback)
    }
  }

  /**
   * @ignore
   */
  disconnectedCallback() {
    super.disconnectedCallback()
    if (this.listen) {
      console.log('removeTick', this.name)
      raf.removeTick(this.listenCallback)
    }
  }

  /**
   * Manually update controller value in the form if `target` has changed
   */
  forceUpdate() {
    if (this.target[this.property] !== this.value) {
      this.value = this.target[this.property]
    }
  }

  /**
   * Delete the controller
   */
  destroy() {
    this.parent.delete(this)
  }

  /**
   * Add a controller in the same `Group` of current controller
   */
  add(property: string, target: Object = undefined, params: any = undefined) {
    this.parent.add(property, target, params)
  }

  /**
   * Update the target value
   */
  protected set(value: any) {
    this.value = this.validate(value)
    this.target[this.property] = this.value
    this.emit('update', this.value, this)
    this.dispatchEvent(new CustomEvent('update', { detail: this.value }))
  }

  protected onInput(event) {
    this.emit('input', this.value, this)
    this.dispatchEvent(new CustomEvent('input', { detail: this.value }))
  }

  protected onChange(event) {
    this.emit('change', this.value, this)
    this.dispatchEvent(new CustomEvent('change', { detail: this.value }))
  }

  protected validate(value: any): any {
    return value
  }

  /**
   * @ignore
   */
  static isCompatible(
    value: any,
    property: string = undefined,
    params: any = undefined,
  ): boolean {
    return true
  }

  valueOf() {
    return this.value
  }

  /**
   * @ignore
   */
  public static styles = css`
    /*minify*/
    :host {
      height: var(--item-height, 30px);
      font-size: 1em;
      width: 100%;
      display: block;
      border-bottom: 1px solid var(--color-bg-secondary);
    }

    :host > div {
      display: flex;
      justify-content: space-between;
      padding: 0 var(--padding-s);
    }

    :host > div > *:first-child {
      max-width: 40%;
      line-height: var(--item-height);
      text-align: left;
      flex: 1;
      padding-right: 5px;
      font-size: 1em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .right {
      flex: 1;
      display: flex;
      justify-content: center;
      flex-direction: column;
      position: relative;
      max-width: 70%;
    }

    .right > * {
      flex: 1;
      display: flex;
      justify-content: center;
      flex-direction: column;
      width: 100%;
    }

    input,
    select {
      font-size: 1em;
      margin: 0;
      padding: 0;
      border: 0;
      max-height: var(--input-height);
      color: var(--input-text);
      background-color: transparent;
      outline: none;
      box-shadow: none;
      font-family: inherit;
      font-size: inherit;
      line-height: inherit;
    }
  `
}
