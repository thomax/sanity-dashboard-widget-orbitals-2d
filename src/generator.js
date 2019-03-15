import Matter from 'matter-js'
import MatterAttractors from 'matter-attractors'
const {Engine, Runner, Render, World, Body, Mouse, MouseConstraint, Bodies} = Matter

Matter.use(MatterAttractors)

const engine = Engine.create()
const runner = Runner.create()
const world = engine.world
world.bodies = []
world.gravity.scale = 0
Runner.run(runner, engine)
const defaultParticleColor = '#212248'
const defaultAttractorColor = '#112248'
const defaultAttractorOpacity = 1
const defaultAttractorRadius = 20
const defaultAttractorSides = 1

const orbitalDirection = -1
let globalRender = null
let attractiveBody

const initializeWorld = options => {
  const {elementId, attractorColor, attractorOpacity, attractorRadius, attractorSides} = options
  const sides = attractorSides || defaultAttractorSides
  const radius = attractorRadius || defaultAttractorRadius

  globalRender = Render.create({
    element: document.getElementById(elementId),
    engine: engine,
    options: {
      width: Math.min(document.documentElement.clientWidth, 940),
      height: Math.min(document.documentElement.clientHeight, 600),
      wireframes: false,
      hasBounds: true
    }
  })

  Render.run(globalRender)

  const attractorBodyOptions = {
    isStatic: true,
    render: {
      fillStyle: attractorColor || defaultAttractorColor,
      opacity: attractorOpacity || defaultAttractorOpacity
    },
    plugin: {
      attractors: [
        function (bodyA, bodyB) {
          return {
            x: (bodyA.position.x - bodyB.position.x) * 1e-6,
            y: (bodyA.position.y - bodyB.position.y) * 1e-6
          }
        }
      ]
    }
  }

  // create attractor
  attractiveBody = (sides && sides > 2)
    ? Bodies.polygon(globalRender.options.width / 2, globalRender.options.height / 2, sides, radius, attractorBodyOptions)
    : Bodies.circle(globalRender.options.width / 2, globalRender.options.height / 2, radius, attractorBodyOptions)


  World.add(world, attractiveBody)

  // add mouse control
  const mouse = Mouse.create(globalRender.canvas)
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false
      }
    }
  })
  World.add(world, mouseConstraint)
  globalRender.mouse = mouse
}

const removeBody = body => {
  World.remove(world, body)
}

const addBody = options => {
  const {mass, radius, render, percentDistanceFromCenter, solid, sides, frictionAir} = options

  const offsetFromLeftEdge = 50
  const positionX = ((attractiveBody.position.x - attractiveBody.circleRadius - radius - offsetFromLeftEdge) * percentDistanceFromCenter) / (100 + offsetFromLeftEdge)

  const positionY = globalRender.options.height / 2
  const distanceX = attractiveBody.position.x - positionX
  const velocity = velocityByDistance(distanceX, mass)

  const bodyOptions = {
    isSensor: !solid, // enable/disable collisions
    frictionAir: frictionAir || 0.0,
    mass: mass,
    render: render || {
      opacity: 0.7,
      fillStyle: defaultParticleColor
    }
  }
  const body = (sides && sides > 2)
    ? Bodies.polygon(positionX, positionY, sides, radius, bodyOptions)
    : Bodies.circle(positionX, positionY, radius, bodyOptions)

  World.add(world, body)
  Body.applyForce(body, body.position, {x: 0, y: velocity})
  return body
}

function velocityByDistance(distance, mass) {
  return orbitalDirection * 0.00006 * distance * Math.sqrt(mass)
}

module.exports = {
  initializeWorld,
  removeBody,
  addBody
}
