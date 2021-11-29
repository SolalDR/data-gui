import { html, property, customElement, css } from 'lit-element'
import { BaseGroup, GroupConstructor } from '@/group'
import { BaseController } from '@/controller'
import { Group } from '@/components/group'

interface GUIConstructor {
  position?: string
  parent?: HTMLElement
  name?: string
  theme?: string
  target?: Object
  children?: Array<BaseGroup | BaseController>
}

@customElement('gui-root')
export class GUI extends Group {
  @property() name: string = ''
  @property({ type: String, reflect: true }) theme: string
  @property({ type: String, reflect: true }) public position?: string
  static controllers: (typeof BaseController)[] = []

  constructor({
    position = 'top right',
    theme = 'light',
    parent = document.body,
    name = '',
    target = {},
    children = [],
  }: GUIConstructor = {}) {
    super({ name, children, target })
    this.position = position
    this.theme = theme
    this.target = target
    this.name = name;

    if (parent) {
      parent.appendChild(this)
    }
  }

  static register(controller: typeof BaseController) {
    if (!controller) throw new Error('Controller cannot be registered');
    if (GUI.controllers.indexOf(controller) === -1) {
      GUI.controllers.unshift(controller)
    }
  }

  group(descriptor: GroupConstructor) {
    const group = new Group(descriptor)
    this.childrenControllers.push(group)
    this.requestUpdateInternal()
    return group
  }

  /**
   * @ignore
   */
  render() {
    const title =
      this.name === ''
        ? ''
        : html`
            <span class="gui-name">${this.name}</span>
          `
    return html`
      <div class="${this.position}">
        ${title}
        <div>${this.childrenControllers}</div>
        <!-- <button class="close">
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="square" stroke-linejoin="arcs"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button> -->
      </div>
    `
  }

  /**
   * @ignore
   */
  public static styles = css`
    /*minify*/
    :host {
      --item-height: 25px;
      --input-height: 20px;
      --color-bg-primary: #fff;
      --color-bg-secondary: #efefef;
      --color-text-primary: #000;
      --color-text-secondary: #4e4e4e;
      --color-primary: #00cd9c;
      --shadow: 2px 2px 15px rgba(0, 0, 0, 0.1);
      --radius: 5px;
      --padding-xs: 5px;
      --padding-s: 10px;
      --padding-m: 20px;
      --controller-max-width: 170px;
      --offset: var(--padding-xs);
      --input-text: var(--color-text-secondary);
      --input-bg: var(--color-bg-primary);

      font-size: 64%;
      font-family: sans-serif;
      width: var(--width, 250px);
      position: absolute;
      display: block;
      background-color: var(--color-bg-primary, #ffffff);
      color: var(--color-text-primary, #000);
      box-shadow: var(--shadow);
      border: 1px solid var(--color-bg-secondary);
    }
    .gui-name {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: var(--item-height);
      font-size: 1em;
      letter-spacing: 1px;
      color: var(--color-primary);
      padding-left: 9px;
    }
    :host([theme='dark']) {
      --color-bg-primary: #000;
      --color-bg-secondary: #222;
      --color-text-primary: #fff;
      --color-text-secondary: #8c8c8c;
      --color-primary: #00cd9c;
    }

    :host([position~='top']) {
      top: var(--offset);
    }
    :host([position~='right']) {
      right: var(--offset);
    }
    :host([position~='bottom']) {
      bottom: var(--offset);
    }
    :host([position~='left']) {
      left: var(--offset);
    }
  `
}
