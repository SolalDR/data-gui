import { html, property, css, LitElement } from 'lit-element'
import { WebComponent } from '@/component'
import getControllerConstructor from '@/helpers/get-field-constructor'
import { BaseController } from './controller'

export interface GroupConstructor {
  name?: string
  children?: Array<BaseGroup | BaseController>
  parent?: BaseGroup
}

export class BaseGroup extends WebComponent {
  @property() name: string
  @property() childrenControllers: Array<BaseGroup | BaseController> = []
  parent?: BaseGroup = null

  public static styles = css`
    /*minify*/
    span {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-left: 20px;
      height: 30px;
      color: var(--color-text-primary);
      background-color: var(--color-bg-secondary);
      font-size: 1em;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
  `

  constructor({
    name = '',
    children = [],
    parent = null,
  }: GroupConstructor = {}) {
    super()
    this.name = name
    this.childrenControllers = children
    this.parent = parent
  }

  get(name) {
    if (!name) return null
    return this.childrenControllers.find(controller => {
      return controller.name === name
    })
  }

  private validateName(name: string) {
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

  add(property: string, target: Object = {}, params: any = {}): any {
    const constructor = getControllerConstructor(
      target[property],
      property,
      params,
    )
    const field = new constructor({
      ...params,
      name: this.validateName(params.name || property),
      property,
      target,
      parent: this,
    })
    this.childrenControllers.push(field)
    return field
  }

  action(callback: Function, parameters: Object) {
    if (typeof callback !== 'function')
      throw new Error('Argument "callback" is not a function')
    const target = { action: callback }
    this.add('action', target, {
      ...parameters,
    })
  }

  delete(field: BaseController | BaseGroup) {
    const i = this.childrenControllers.findIndex(child => {
      return child === field
    })
    this.childrenControllers.splice(i, 1)
    this.forceRender()
  }

  render() {
    return html`
      <div>
        <span>${this.name}</span>
        <div>${this.childrenControllers}</div>
      </div>
    `
  }
}
