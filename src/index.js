import React from 'react'
import PropTypes from 'prop-types'
import {getFeed} from './sanityConnector'
import styles from './Orbitals2d.css'
import {initializeWorld, addBody, removeBody} from './generator'
import {defaultTransformDocument} from './transformer'
const elementId = 'orbitals2dWorld'

const orbitals = {}

class Orbitals2d extends React.Component {

  static propTypes = {
    query: PropTypes.string,
    transformDocument: PropTypes.func,
    attractorColor: PropTypes.string
  }

  static defaultProps = {
    query: '*[]|order(_createdAt desc)[0..5]',
    attractorColor: '#606060',
    transformDocument: defaultTransformDocument
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  componentDidMount = () => {
    const {query, attractorColor} = this.props
    initializeWorld({elementId, attractorColor})

    this.unsubscribe()
    this.subscription = getFeed(query).subscribe(event => {
      this.addOrbital(event.result)
    })
  }

  unsubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

  addOrbital = (doc = {}) => {
    const existingOrbital = orbitals[doc._id]
    if (existingOrbital) {
      console.log('remove', doc._id)
      removeBody(existingOrbital)
    }
    const bodyOptions = this.props.transformDocument(doc)
    if (bodyOptions) {
      console.log('add', doc._id)
      const newOrbital = addBody(bodyOptions)
      orbitals[doc._id] = newOrbital
    }
  }

  render = () => {
    return <div id={elementId} className={styles.container} />
  }
}

export default {
  name: 'orbitals-2d',
  component: Orbitals2d
}
