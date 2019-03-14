import React from 'react'
import PropTypes from 'prop-types'
import sleep from 'await-sleep'
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
    attractorColor: PropTypes.string,
    attractorSize: PropTypes.number
  }

  static defaultProps = {
    query: '*[]|order(_createdAt desc)[0..5]',
    transformDocument: defaultTransformDocument,
    attractorColor: '#606060',
    attractorSize: 30
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  componentDidMount = () => {
    const {query, attractorColor, attractorSize} = this.props
    initializeWorld({elementId, attractorColor, attractorSize})

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

  addOrbital = async (doc = {}) => {
    const existingOrbital = orbitals[doc._id]
    if (existingOrbital) {
      removeBody(existingOrbital)
      await sleep(1000)
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
