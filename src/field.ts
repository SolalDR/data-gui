import { property, css } from 'lit-element'
import { WebComponent } from '@/component'
import raf from '@solaldr/raf'
import { BaseGroup } from './group'

// TODO remove
;(window as any).raf = raf

export interface FieldConstructor {
  name?: string
  listen?: boolean
  target?: Object
  property?: string
  parent?: BaseGroup
}

export class BaseField extends WebComponent {
  @property() name: string
  @property() property: string
  @property() target: Object
  @property() value: any
  listen: boolean = false
  listenCallback: Function
  parent: BaseGroup

  // public on(eventName: string, callback: Function) {}
  // public off(eventName: string, callback: Function) {}
  // public once(eventName: string, callback: Function) {}
  // public emit(eventName: string, datas: any) {}

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
      max-width: 30%;
      line-height: var(--item-height);
      text-align: left;
      flex: 1;
      padding-right: 15px;
      font-size: 1em;
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

    input, select {
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
  public constructor(parameters: FieldConstructor)
  constructor({
    name = null,
    listen = false,
    property = null,
    target = null,
    parent = null,
  }: FieldConstructor = {}) {
    super()
    this.parent = parent
    this.property = property
    this.target = target
    this.name = name ? name : this.property
    this.value = this.target[this.property]
    this.listen = listen
  }

  connectedCallback() {
    super.connectedCallback()
    this.listenCallback = () => {
      if (this.target[this.property] !== this.value) {
        this.value = this.target[this.property]
      }
    }
    if (this.listen) {
      console.log('addTick', this.name)
      raf.addTick(this.listenCallback)
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    if (this.listen) {
      console.log('removeTick', this.name)
      raf.removeTick(this.listenCallback)
    }
  }

  destroy() {
    this.parent.delete(this)
  }

  protected set(value: any) {
    this.value = this.validate(value)
    this.target[this.property] = this.value
    this.emit('update', this.value)
    this.dispatchEvent(new CustomEvent('update', { detail: this.value }))
  }

  protected onInput(event) {
    this.emit('input', this.value)
    this.dispatchEvent(new CustomEvent('input', { detail: this.value }))
  }

  protected onChange(event) {
    this.emit('change', this.value)
    this.dispatchEvent(new CustomEvent('change', { detail: this.value }))
  }

  protected validate(value: any): any {
    return value
  }

  static isCompatible(value: any, property: string = undefined, params: any = undefined): boolean {
    return true
  }

  valueOf() {
    return this.value
  }
}
