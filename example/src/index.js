import GUI from "./../../dist/esm/index.js";
import { VectorController } from '../../dist/esm/vector-controller.js'
import { CanvasController } from '../../dist/esm/canvas-controller.js'
import { ColorController } from '../../dist/esm/color-controller.js'

// console.log(VectorController)
/**
 * Target object 
 */
const target = {
  name: "data-gui",
  width: 200,
  height: 500,
  count: 400,
  rotation: {
    factor: 0.5,
    speedFactor: 0.001,
    offset: performance.now()
  },
  scale: {
    factorX: 1,
    factorY: 0.35
  },
  color: "rgba(20, 169, 159, 0.1)",
  backgroundTestLongText: "#000",
  image: "./base.jpg",
  function: (a, b) => {
    return alert(a + b)
  },
  testVector: { x: 0, y: 1 , z: 10},
  testArray: 'Test'
}

const blendOptions = {
  tool: 'brush',
  size: 10,
  color: "#FF0000",
  enabled: true,
}
const b = new GUI({ target, theme: "dark", position: 'top left' })
const antarctica = b.group({name: 'Antarctica'})
const blendMap = antarctica.group({ name: 'Blendmap' })
const textureGroup = blendMap.group({ name: 'Texture output' })
textureGroup.add('canvas', blendOptions, { type: 'canvas' })
textureGroup.action(() => {
  blendOptions.canvas.width = blendOptions.canvas.width
}, { name: 'Reset' })

blendMap.color('color', blendOptions)
blendMap.add('tool', blendOptions, { choices: ['Brush', 'Pencil'] })
blendMap.add('size', blendOptions, { min: 0, max: 100 })
blendMap.add('enabled', blendOptions)

const texturesGroup = antarctica.group({ name: 'Textures' })

function initTextureGroup(parent, name, data = {
  scaleUv: 1,
  orm: "./base.jpg",
  diffuse: "./base.jpg",
  normal: "./base.jpg"
}) {
  const g = parent.group({ name: `${name}` })
  const updateUniform = (name, blob) => {
    // new Texture(blob)
    // material.uniforms[name].value = 
  }
  g.add('scaleUv', data, { min: 1, max: 30 })
  g.add('orm', data, {type: 'image'}).on('update', (value) => updateUniform('orm', value))
  g.add('normal', data, {type: 'image'}).on('update', (value) => updateUniform('orm', value))
  g.add('diffuse', data, {type: 'image'}).on('update', (value) => updateUniform('orm', value))
}

initTextureGroup(texturesGroup, 'Rouge')
initTextureGroup(texturesGroup, 'Vert')
initTextureGroup(texturesGroup, 'Bleu')
initTextureGroup(texturesGroup, 'Default')

// blendMap.add('canvas', blendOptions, { type: 'canvas' })


/**
 * GUI
 */
const a = new GUI({ target, theme: "dark" })
a.add('canvas', target, { type: 'canvas' })
a.add('width', target, { min: 10, max: 500 })
a.add('height', target, { min: 10, max: 500 })
a.add('testVector', target, { step: 0.1 })
a.add('image', target, { type: 'image' }).on('update', (value) => {
  console.log(value, a.image)
})
a.add('count', target, { min: 10, max: 500, range: false })
a.add('function', target, { args: [{ name: 'a', value: 1 }, { name: 'b', value: 2 }] })
a.action(target.function, { args: [{ name: 'a', value: 1 }, { name: 'b', value: 2 }] })
a.add('testArray', target, { choices: ['Test', 'test2'] })
a.color('color')
a.color('backgroundTestLongText')
a.action(() => {
  a.theme = a.theme === 'dark' ? 'light' : 'dark'
}, { name: 'Switch theme'})






const rotate = a.group({ name: 'Rotation', target: target.rotation })
rotate.add('factor', target.rotation, { range: true })
rotate.add('offset', target.rotation, { listen: true, disabled: true })
rotate.add('speedFactor', target.rotation, { range: true, min: 0, max: 0.01 })

const scale = a.group({ name: 'Scale' })
scale.add('factorX', target.scale, { range: true })
// scale.add('factorY', target.scale, { range: true })

setTimeout(() => {
  console.log('hello')
  a.add('factorY', target.scale, { range: true })
}, 1000)


console.log(target)
/**
 * Initialize canvas
 */
const $canvas = document.querySelector('canvas');
const ctx = $canvas.getContext('2d');
$canvas.width = window.innerHeight * 0.7;
$canvas.height = window.innerHeight * 0.7;
window.addEventListener('resize',() => {
  $canvas.width = window.innerHeight * 0.7;
  $canvas.height = window.innerHeight * 0.7;
})

/**
 * Loop
 */
const loop = () => {
  $canvas.width = $canvas.width;
  const { width, height, count } = target;
  ctx.strokeStyle = target.color
  ctx.fillStyle = target.background
  ctx.fillRect(0, 0, $canvas.width, $canvas.height)
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2)/count * i
    ctx.save()
    ctx.translate($canvas.width/2, $canvas.height/2)
    ctx.scale(1 - (i / count) * target.scale.factorX, 1 - (i / count) * target.scale.factorY)
    ctx.rotate(angle / target.rotation.factor + (target.rotation.offset * target.rotation.speedFactor))
    ctx.strokeRect(
      - width / 2,
      - height / 2,
      width,
      height
    )
    ctx.restore()
  }
  requestAnimationFrame(loop)

  target.rotation.offset = performance.now()
}
loop()