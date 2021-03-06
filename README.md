# Orbitals 2D

A widget for the Sanity Content Studio Dashboard

## Params

### `query`
A GROQ query string

### `attractorColor`
CSS color of the attractor body in the middle

### `attractorRadius`
Radius in pixels of the attractor body

### `attractorOpacity`
Opacity (a value between 0 and 1) of the attractor body

### `attractorSides`
Number of sides of the attractor body polygon (6 -> hexagon)

### `transformDocument`
A function which transforms a Sanity document into an object shaped like this:

```
{
  radius: 10, // size in pixels of orbital body
  mass: 1, // mass of orbital body
  percentDistanceFromCenter: 50, // % (integer 0-100) distance from center
  solid: true, // will it collide with other orbitals?
  sides: 5, // sides < 3 gives you a circle
  render: {
    fillStyle: 'red', // CSS color of body
    opacity: 0.7 // opacity of body
  }
}
```

....