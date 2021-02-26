const MathUtils = {
  clamp: function(value, min, max) {
    return Math.max(min, Math.min(max, value))
  },

  euclideanModulo: function(n, m) {
    return ((n % m) + m) % m
  },

  lerp: function(x, y, t) {
    return (1 - t) * x + t * y
  },
}

function hue2rgb(p, q, t) {
  if (t < 0) t += 1
  if (t > 1) t -= 1
  if (t < 1 / 6) return p + (q - p) * 6 * t
  if (t < 1 / 2) return q
  if (t < 2 / 3) return p + (q - p) * 6 * (2 / 3 - t)
  return p
}

const isRGBObject = value => {
  return (
    typeof value === 'object' &&
    value.r &&
    value.g &&
    value.b &&
    !isNaN(value.r) &&
    !isNaN(value.g) &&
    !isNaN(value.b)
  )
}

const isHSLObject = value => {
  return (
    typeof value === 'object' &&
    value.h &&
    value.s &&
    value.l &&
    !isNaN(value.h) &&
    !isNaN(value.s) &&
    !isNaN(value.l)
  )
}

enum ColorOrigin {
  STRING_RGB = 1,
  STRING_HSL = 2,
  STRING_HEX = 3,
  HEX = 4,
  RGB = 5,
  HSL = 6,
  COLOR = 7,
}

class Color {
  r: number = 1
  g: number = 1
  b: number = 1
  a: number = 1

  alphaEnabled = false
  _origin: ColorOrigin = null

  constructor(
    r: Color | string | number,
    g: undefined | number = undefined,
    b: undefined | number = undefined,
  ) {
    if (g === undefined && b === undefined) {
      // r is THREE.Color, hex or string
      return this.set(r)
    }
    return this.setRGB(r, g, b)
  }

  set origin(value) {
    if (this._origin === null) {
      this._origin = value
    }
  }

  get origin() {
    return this._origin
  }

  set(value) {
    if (value && isRGBObject(value)) {
      this.copy(value)
    } else if (typeof value === 'number') {
      this.setHex(value)
    } else if (typeof value === 'string') {
      this.setStyle(value)
    } else if (value && isHSLObject(value)) {
      this.setHSL(value.h, value.s, value.l, value.a)
    }

    return this
  }

  setHex(hex) {
    this.origin = ColorOrigin.HEX
    hex = Math.floor(hex)

    if (hex < 0x10000000) {
      this.r = ((hex >> 16) & 255) / 255
      this.g = ((hex >> 8) & 255) / 255
      this.b = (hex & 255) / 255
    } else {
      this.r = ((hex >> 24) & 255) / 255
      this.g = ((hex >> 16) & 255) / 255
      this.b = ((hex >> 8) & 255) / 255
      this.setAlpha((hex & 255) / 255)
    }

    return this
  }

  setRGB(r, g, b, a = undefined) {
    this.origin = ColorOrigin.RGB
    this.r = r
    this.g = g
    this.b = b
    this.setAlpha(a)

    return this
  }

  setHSL(h, s, l, a = undefined) {
    // h,s,l ranges are in 0.0 - 1.0
    this.origin = ColorOrigin.HSL
    h = MathUtils.euclideanModulo(h, 1)
    s = MathUtils.clamp(s, 0, 1)
    l = MathUtils.clamp(l, 0, 1)

    if (s === 0) {
      this.r = this.g = this.b = l
    } else {
      const p = l <= 0.5 ? l * (1 + s) : l + s - l * s
      const q = 2 * l - p

      this.r = hue2rgb(q, p, h + 1 / 3)
      this.g = hue2rgb(q, p, h)
      this.b = hue2rgb(q, p, h - 1 / 3)
    }

    this.setAlpha(a)

    return this
  }

  setAlpha(value: number | undefined) {
    if (value !== undefined) {
      this.a = value
      this.alphaEnabled = true
    }
  }

  setStyle(style) {
    function handleAlpha(string) {
      if (string === undefined) return

      if (parseFloat(string) < 1) {
        console.warn(
          'THREE.Color: Alpha component of ' + style + ' will be ignored.',
        )
      }
    }

    let m

    if ((m = /^((?:rgb|hsl)a?)\(([^\)]*)\)/.exec(style))) {
      // rgb / hsl

      let color
      const name = m[1]
      const components = m[2]

      switch (name) {
        case 'rgb':
        case 'rgba':
          if (
            (color = /^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(
              components,
            ))
          ) {
            // rgb(255,0,0) rgba(255,0,0,0.5)
            this.origin = ColorOrigin.STRING_RGB
            this.r = Math.min(255, parseInt(color[1], 10)) / 255
            this.g = Math.min(255, parseInt(color[2], 10)) / 255
            this.b = Math.min(255, parseInt(color[3], 10)) / 255
            if (color[4]) {
              this.setAlpha(parseInt(color[4]))
            }

            return this
          }

          if (
            (color = /^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(
              components,
            ))
          ) {
            // rgb(100%,0%,0%) rgba(100%,0%,0%,0.5)
            this.origin = ColorOrigin.STRING_RGB
            this.r = Math.min(100, parseInt(color[1], 10)) / 100
            this.g = Math.min(100, parseInt(color[2], 10)) / 100
            this.b = Math.min(100, parseInt(color[3], 10)) / 100

            if (color[4]) {
              this.setAlpha(parseInt(color[4]))
            }

            return this
          }

          break

        case 'hsl':
        case 'hsla':
          if (
            (color = /^\s*(\d*\.?\d+)\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(
              components,
            ))
          ) {
            // hsl(120,50%,50%) hsla(120,50%,50%,0.5)
            this.origin = ColorOrigin.STRING_HSL
            const h = parseFloat(color[1]) / 360
            const s = parseInt(color[2], 10) / 100
            const l = parseInt(color[3], 10) / 100

            this.setHSL(h, s, l)

            if (color[4]) {
              this.setAlpha(parseInt(color[4]))
            }

            return this
          }

          break
      }
    } else if ((m = /^\#([A-Fa-f\d]+)$/.exec(style))) {
      // hex color

      const hex = m[1]
      const size = hex.length

      this.origin = ColorOrigin.STRING_HEX
      if (size === 3) {
        // #ff0
        this.r = parseInt(hex.charAt(0) + hex.charAt(0), 16) / 255
        this.g = parseInt(hex.charAt(1) + hex.charAt(1), 16) / 255
        this.b = parseInt(hex.charAt(2) + hex.charAt(2), 16) / 255

        return this
      } else if (size === 4) {
        // #ff0000
        this.r = parseInt(hex.charAt(0) + hex.charAt(0), 16) / 255
        this.g = parseInt(hex.charAt(1) + hex.charAt(1), 16) / 255
        this.b = parseInt(hex.charAt(2) + hex.charAt(2), 16) / 255
        this.setAlpha(parseInt(hex.charAt(3) + hex.charAt(3), 16) / 255)

        return this
      } else if (size === 6) {
        // #ff0000
        this.r = parseInt(hex.charAt(0) + hex.charAt(1), 16) / 255
        this.g = parseInt(hex.charAt(2) + hex.charAt(3), 16) / 255
        this.b = parseInt(hex.charAt(4) + hex.charAt(5), 16) / 255

        return this
      } else if (size === 8) {
        // #ff0000
        this.r = parseInt(hex.charAt(0) + hex.charAt(1), 16) / 255
        this.g = parseInt(hex.charAt(2) + hex.charAt(3), 16) / 255
        this.b = parseInt(hex.charAt(4) + hex.charAt(5), 16) / 255
        this.setAlpha(parseInt(hex.charAt(6) + hex.charAt(7), 16) / 255)
        return this
      }
    }

    return this
  }

  clone() {
    return new Color(this.r, this.g, this.b)
  }

  copy(color) {
    this.r = color.r
    this.g = color.g
    this.b = color.b
  }

  getHex() {
    if (this.alphaEnabled) {
      return (
        ((this.r * 255) << 24) ^
        ((this.g * 255) << 16) ^
        ((this.b * 255) << 8) ^
        ((this.a * 255) << 0)
      )
    }
    return (
      ((this.r * 255) << 16) ^ ((this.g * 255) << 8) ^ ((this.b * 255) << 0)
    )
  }

  getHexString() {
    if (this.alphaEnabled) {
      return '#' + ('00000000' + this.getHex().toString(16)).slice(-8)
    }
    return '#' + ('000000' + this.getHex().toString(16)).slice(-6)
  }

  getHSL(target = undefined) {
    // h,s,l ranges are in 0.0 - 1.0

    if (target === undefined) {
      console.warn('THREE.Color: .getHSL() target is now required')
      target = { h: 0, s: 0, l: 0 }
    }

    const r = this.r,
      g = this.g,
      b = this.b

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)

    let hue, saturation
    const lightness = (min + max) / 2.0

    if (min === max) {
      hue = 0
      saturation = 0
    } else {
      const delta = max - min

      saturation =
        lightness <= 0.5 ? delta / (max + min) : delta / (2 - max - min)

      switch (max) {
        case r:
          hue = (g - b) / delta + (g < b ? 6 : 0)
          break
        case g:
          hue = (b - r) / delta + 2
          break
        case b:
          hue = (r - g) / delta + 4
          break
      }

      hue /= 6
    }

    target.h = hue
    target.s = saturation
    target.l = lightness

    return target
  }

  getRgbString() {
    return `rgb${this.alphaEnabled ? 'a' : ''}(${this.r * 255}, ${this.g *
      255}, ${this.b * 255}${this.alphaEnabled ? `, ${this.a}` : ''})`
  }

  getHslString() {
    const hsl = this.getHSL()
    return `hsl${this.alphaEnabled ? 'a' : ''}(${hsl.h}, ${hsl.g}, ${hsl.b}${
      this.alphaEnabled ? `, ${this.a}` : ''
    })`
  }

  getStyle() {
    return (
      'rgb(' +
      ((this.r * 255) | 0) +
      ',' +
      ((this.g * 255) | 0) +
      ',' +
      ((this.b * 255) | 0) +
      ')'
    )
  }

  format(): any {
    switch (this.origin) {
      case ColorOrigin.RGB:
        return this
      case ColorOrigin.HSL:
        return this.getHSL()
      case ColorOrigin.HEX:
        return this.getHex()
      case ColorOrigin.STRING_HEX:
        return this.getHexString()
      case ColorOrigin.STRING_HSL:
        return this.getHslString()
      case ColorOrigin.STRING_RGB:
        return this.getRgbString()
    }
  }
}

export { Color }

export const isColor = string => {
  const c = new Color(string)
  return c.origin !== null
}
