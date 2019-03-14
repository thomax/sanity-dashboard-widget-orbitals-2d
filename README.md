# Orbitals 2D

A widget for the Sanity Content Studio Dashboard

## Params

### `query`
A string which is a GROQ query

### `attractorColor`
CSS color of the attractor body in the middle

### `transformDocument`
A function which transforms a Sanity document into an object shaped like this:

```
{
    radius: 10, // size in pixels of orbital body
    mass: 1, // mass of orbital body
    percentDistanceFromCenter: 50, // % (integer 0-100) distance from center
    solid: true,
    sides: 5,
    render: {
      fillStyle: 'red', // CSS color of body
      opacity: 0.7 // opacity of body
    }
  }
```

....