import GUI from "./../../dist/index.esm.js";

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
  background: "#000",
}

/**
 * GUI
 */
const a = new GUI({ target });
a.add('width', target, { min: 10, max: 500 })
a.add('height', target, { min: 10, max: 500 })
a.add('count', target, { min: 10, max: 500, range: false })
a.color('color')
a.color('background')

const rotate = a.group({ name: 'Rotation', target: target.rotation })
rotate.add('factor', target.rotation, { range: true })
rotate.add('offset', target.rotation, { listen: true, disabled: true })
rotate.add('speedFactor', target.rotation, { range: true, min: 0, max: 0.01 })

const scale = a.group({ name: 'Scale' })
scale.add('factorX', target.scale, { range: true })
scale.add('factorY', target.scale, { range: true })

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