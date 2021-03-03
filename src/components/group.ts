import { html, property, customElement, css, query } from 'lit-element'
import { BaseGroup, GroupConstructor as BaseGroupConstructor } from '@/group'

interface GroupConstructor extends BaseGroupConstructor {
  opened?: boolean
}
@customElement('gui-group')
export class Group extends BaseGroup {
  /**
   * @ignore
   */
  @property() private computedClass: string = ''
  /**
   * @ignore
   */
  @property() private computedStyle: string = ''

  /**
   * @ignore
   */
  @query('.group-body') private groupElement: HTMLElement

  constructor({ name = null, opened = true }: GroupConstructor = {}) {
    super({ name })
    this.opened = opened
  }

  private onClick() {
    this.opened = !this.opened
  }

  /**
   * Create a new child group
   */
  group(descriptor: GroupConstructor) {
    const group = new Group(descriptor)
    group.addEventListener('collapse', event => {
      this.updateComputed()
    })
    this.childrenControllers.push(group)
    return group
  }

  private updateComputed() {
    this.computedClass = this.opened ? 'group group--open' : 'group'
    const height = this.groupElement
      ? this.groupElement.offsetHeight + 40
      : 1000
    this.computedStyle = `--group-height: ${height}px;`
  }

  /**
   * @ignore
   */
  render() {
    this.updateComputed()
    return html`
      <div class=${this.computedClass} style=${this.computedStyle}>
        <p class="group-header" @click=${this.onClick}>
          <span>${this.name}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000000"
            strokeWidth="5"
            strokeLinecap="square"
            strokeLinejoin="arcs"
          >
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </p>
        <div class="group-body">
          ${this.childrenControllers}
        </div>
      </div>
    `
  }

  /**
   * @ignore
   */
  public static styles = css`
    /*minify*/
    ${BaseGroup.styles} :host {
      margin-top: 20px;
      --group-height: 1000px;
      --duration: 0.5s;
    }
    .group-header {
      position: relative;
      margin: auto;
    }
    .group-header svg {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%) rotate(180deg);
      width: 20px;
      transition: transform 0.4s ease;
    }

    .group {
      max-height: var(--item-height);
      overflow: hidden;
    }

    .group .group-body {
      opacity: 0;
      transform: translateX(-5px);
      transition-duration: 0.6s;
      transition-property: transform, opacity;
      transition-delay: 0s;
      transition-timing-function: cubic-bezier(0, 0, 0, 1.03);
      border-left: 2px solid var(--color-primary);
    }

    .group--open {
      overflow: visible;
      max-height: none;
    }

    .group--open .group-body {
      opacity: 1;
      transform: translateX(0px);
      transition-delay: 100ms;
    }
    .group--open svg {
      transform: translateY(-50%) rotate(0deg);
    }
  `
}
