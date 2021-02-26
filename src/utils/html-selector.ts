export default (selector: HTMLElement | string): HTMLElement | null => {
  if (selector instanceof HTMLElement) {
    return selector
  }

  if (typeof selector === 'string') return document.querySelector(selector)

  return null
}
