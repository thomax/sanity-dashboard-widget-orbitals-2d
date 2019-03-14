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
const defaultAttractorColor = '#112248'
const defaultParticleColor = '#212248'

const orbitalDirection = -1
let globalRender = null
let attractiveBody

const initializeWorld = options => {
  const {elementId, attractorColor} = options
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

  // create attractor
  attractiveBody = Bodies.circle(
    globalRender.options.width / 2,
    globalRender.options.height / 2,
    35,
    {
      isStatic: true,
      render: {
        fillStyle: attractorColor || defaultAttractorColor
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
  )

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

const addBody = options => {
  const {mass, radius, render, percentDistanceFromCenter, solid, sides} = options
  const offsetFromLeftEdge = 50
  const positionX = ((attractiveBody.position.x - attractiveBody.circleRadius - radius - offsetFromLeftEdge) * percentDistanceFromCenter) / (100 + offsetFromLeftEdge)

  const positionY = globalRender.options.height / 2
  const distanceX = attractiveBody.position.x - positionX
  const velocity = velocityByDistance(distanceX, mass)

  const bodyOptions = {
    isSensor: !solid, // enable/disable collisions
    frictionAir: 0.0,
    mass: mass,
    render: render || {
      opacity: 1,
      fillStyle: defaultParticleColor
    }
  }
  const body = (sides && sides > 2)
    ? Bodies.polygon(positionX, positionY, sides, radius, bodyOptions)
    : Bodies.circle(positionX, positionY, radius, bodyOptions)

  World.add(world, body)
  Body.applyForce(body, body.position, {x: 0, y: velocity})
}

function velocityByDistance(distance, mass) {
  return orbitalDirection * 0.00006 * distance * Math.sqrt(mass)
}

module.exports = {
  initializeWorld,
  addBody
}
