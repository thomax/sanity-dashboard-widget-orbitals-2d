import randomColor from 'randomcolor'

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

// the bigger, the larger
function massToRadius(mass) {
  return mass * 30
}

const defaultTransformDocument = doc => {
  const {_type} = doc
  const mass = randomIntFromInterval(0.2, 2)
  const radius = massToRadius(mass)

  return {
    radius: radius,
    mass: mass,
    solid: false,
    percentDistanceFromCenter: randomIntFromInterval(20, 90),
    sides: randomIntFromInterval(0, 7),
    render: {
      fillStyle: getColor(_type),
      opacity: 0.7
    }
  }
}

module.exports = {
  defaultTransformDocument
}
