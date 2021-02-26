import { html, property, css, LitElement } from 'lit-element'
import { WebComponent } from '@/component'
import getFieldConstructor from '@/helpers/get-field-constructor'
import { BaseField } from './field'

export interface GroupConstructor {
  name?: string
  children?: Array<LitElement>
}

export class BaseGroup extends WebComponent {
  @property() name: string
  @property() childrenControllers: Array<LitElement> = []

  public static styles = css`
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

  constructor({ name = '', children = [] }: GroupConstructor = {}) {
    super()
    this.name = name
    this.childrenControllers = children
  }

  add(property: string, target: any, params: any): any {
    const constructor = getFieldConstructor(target[property])
    const field = new constructor(property, target, params)
    this.childrenControllers.push(field)
    return field
  }

  delete(field: BaseField | BaseGroup) {
    const i = this.childrenControllers.findIndex(child => {
      return child === field
    })
    if (field instanceof BaseGroup) {
      field.destroy()
    }
    this.childrenControllers.splice(i, 1)
    this.forceRender()
  }

  destroy() {
    this.childrenControllers.forEach(controller => {
      this.delete(controller as BaseField | BaseGroup)
    })
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
