import { html, property } from 'lit-element'
import { WebComponent } from '@/core/component'
import { getControllerConstructor } from '@/core/controllers'
import { BaseController } from '@/core/controller'
import { ActionController } from '@/controllers/action-controller'
import { ColorController } from '@/extras/color-controller'

/**
 * @category Constructor
 */
export interface BaseGroupConstructor {
  name?: string
  children?: Array<BaseGroup | BaseController>
  parent?: BaseGroup
  target?: Object
}

type Child = BaseGroup|BaseController

/**
 * `BaseGroup` is the mother class of {@link Group} and {@link GUI}.
 * 
 * @category Core
 */
export class BaseGroup extends WebComponent {
  /**
   * Display name of the group
   */
  @property() name: string

  /**
   * Array containing controllers and groups
   */
  @property({
    type: Array, 
    hasChanged: (newer: Array<Child>, older: Array<Child>) => {
      return newer !== older || newer.length !== older.length
    } 
  }) protected childrenControllers: Array<Child> = []
  
  /**
   * Does group is open
   */
  @property({
    reflect: true,
    type: Boolean,
    attribute: 'opened' 
  })
  private _opened: boolean = false

  /**
   * The default target object of the group (used when `target` parameter is not defined in `group.add` method)
   */
  target: Object = {}

  /**
   * Parent group
   */
  private parent?: BaseGroup = null

  constructor({
    name = '',
    children = [],
    parent = null,
    target = {},
  }: BaseGroupConstructor = {}) {
    super()
    this.name = name
    this.childrenControllers = children
    this.parent = parent
    this.target = target
  }

  get opened() {
    return this._opened
  }

  set opened(value) {
    this._opened = !!value
    this.dispatchEvent(
      new CustomEvent('collapse', {
        detail: this._opened,
      }),
    )
  }

  /**
   * Open the group
   */
  open() {
    this.opened = true
  }

  /**
   * Close the group
   */
  close() {
    this.opened = false
  }

  /**
   * Get a group or a controller by his name
   * ``` javascript
   * const controller1 = group.add('someProperty', someTarget)
   * const controller2 = group.get('someProperty')
   * controller1 === controller2 // true
   * ```
   */
  get(name: string) {
    if (!name) return null
    return this.childrenControllers.find(controller => {
      return controller.name === name
    })
  }

  /**
   * Add a new controller, see documentation of each controller for more information
   * ``` javascript
   * const target = { property: 1 }
   * group.add('property', target)
   * ```
   */
  add<Base extends BaseController>(property: string, target: Object = this.target, params: any = {}): Base {
    const constructor = getControllerConstructor(
      target[property],
      property,
      params,
    )
    if (!constructor) return
    const controller = new constructor({
      ...params,
      name: this.validateName(params.name || property),
      property,
      target,
      parent: this,
    })
    this.childrenControllers.push(controller)
    this.requestUpdateInternal()
    return controller as unknown as Base
  }

  /**
   * Create a new {@link ActionController}
   */
  action(callback: Function, parameters: Object): ActionController {
    if (typeof callback !== 'function')
      throw new Error('Argument "callback" is not a function')
    const target = { action: callback }
    return this.add<ActionController>('action', target, {
      ...parameters,
    })
  }

  /**
   * Create a new {@link ColorController}
   */
  color(property: string, target = this.target, parameters: Object = {}): ColorController {
    return this.add<ColorController>(property, target, {
      type: 'color',
      ...parameters,
    })
  }

  /**
   * Delete a child controller
   * ``` javascript
   * const controller = group.add('someValue', target)
   * group.delete(controller) // delete by
   * group.delete('someValue') // or
   * ```
   */
  delete(controller: BaseController | BaseGroup | string) {
    if (typeof controller === 'string') controller = this.get('controller')
    const i = this.childrenControllers.findIndex(child => {
      return child === controller
    })
    this.childrenControllers.splice(i, 1)
    this.requestUpdateInternal()
  }

  private validateName(name: string): string {
    let checkValid = name =>
      this.childrenControllers.filter(c => c.name === name).length === 0
    let count = 1
    let isValid = checkValid(name)
    if (isValid) return name
    while (!isValid) {
      count++
      isValid = checkValid(name + String(count))
    }
    return name + String(count)
  }

  protected render() {
    return html`
      <div>
        <span class="property">${this.name}</span>
        <div>${this.childrenControllers}</div>
      </div>
    `
  }
}
