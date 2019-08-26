import React from 'react'
import PropTypes from 'prop-types'
import sleep from 'await-sleep'
import {getSubscription} from './sanityConnector'
import styles from './Orbitals2d.css'
import {initializeWorld, addBody, removeBody} from './generator'
import {defaultTransformDocument} from './transformer'

const elementId = 'orbitals2dWorld'
const gracePeriodOnBodyRemoval = 1500
const orbitals = {}

class Orbitals2d extends React.Component {

  static propTypes = {
    query: PropTypes.string,
    transformDocument: PropTypes.func,
    attractorColor: PropTypes.string,
    attractorRadius: PropTypes.number,
    attractorOpacity: PropTypes.number,
    attractorSides: PropTypes.number
  }

  static defaultProps = {
    query: '*[!(_id in path("_.listeners.**"))]|order(_createdAt desc)[0..5]',
    transformDocument: defaultTransformDocument,
    attractorColor: '#606060',
    attractorRadius: 20,
    attractorOpacity: null,
    attractorSides: 0
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  componentDidMount = () => {
    const {query, attractorColor, attractorOpacity, attractorRadius, attractorSides} = this.props
    initializeWorld({elementId, attractorColor, attractorOpacity, attractorRadius, attractorSides})

    this.unsubscribe()
    this.subscription = getSubscription(query).subscribe(event => {
      this.addOrbital(event.result)
    })
  }

  unsubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

  addOrbital = async (doc = {}) => {
    const existingOrbital = orbitals[doc._id]
    if (existingOrbital) {
      removeBody(existingOrbital)
      await sleep(gracePeriodOnBodyRemoval)
    }

    const bodyOptions = this.props.transformDocument(doc)
    if (bodyOptions) {
      const newOrbital = addBody(bodyOptions)
      orbitals[doc._id] = newOrbital
    }
    console.log('There are now', Object.keys(orbitals).length)
  }

  render = () => {
    return <div id={elementId} className={styles.container} />
  }
}

export default {
  name: 'orbitals-2d',
  component: Orbitals2d
}
