import randomColor from 'randomcolor'
const defaults = {nonTextBehavior: 'remove'}

const colors = {}

// min and max included
function randomIntFromInterval(min, max) {
  return Math.floor((Math.random() * (max - min + 1)) + min)
}

function getColor(key) {
  if (!colors[key]) {
    colors[key] = randomColor()
  }
  return colors[key]
}

function textSizeToMass(text) {
  return text.length / 400 // text is usually between 80 and 160
}

function massToRadius(mass) {
  return mass * 30
}

function blocksToText(blocks, opts = {}) {
  const options = Object.assign({}, defaults, opts)
  return blocks
    .map(block => {
      if (block._type !== 'block' || !block.children) {
        return options.nonTextBehavior === 'remove' ? '' : `[${block._type} block]`
      }

      return block.children.map(child => child.text).join('')
    })
    .join('\n\n')
}

const transformDocument = doc => {
  const {_createdAt, greetingTypeLabel, body} = doc
  const plainText = blocksToText(body)
  const mass = textSizeToMass(blocksToText(body))
  const radius = massToRadius(mass)
  const diam = radius * 2

  return {
    radius: radius,
    mass: mass,
    canCollide: false,
    percentDistanceFromCenter: randomIntFromInterval(0, 100),
    render: {
      fillStyle: getColor(greetingTypeLabel),
      opacity: 0.7
    }
  }
}

module.exports = {
  transformDocument
}
