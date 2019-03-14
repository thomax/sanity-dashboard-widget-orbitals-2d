import React from 'react'
import PropTypes from 'prop-types'
import {getFeed} from './sanityConnector'
import styles from './Orbitals2d.css'
import {initializeWorld, addBody} from './generator'
import {defaultTransformDocument} from './transformer'
const elementId = 'orbitals2dWorld'


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
    this.subscription = getFeed(query).subscribe(response => {
      console.log('stream', response)
      this.addOrbitals(response)
    })
  }

  unsubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

  addOrbitals = (incoming = []) => {
    const documents = Array.isArray(incoming) ? incoming : [incoming]
    const {transformDocument} = this.props
    documents.forEach(doc => {
      const bodyOptions = transformDocument(doc)
      addBody(bodyOptions)
    })
  }

  render = () => {
    return <div id={elementId} className={styles.container} />
  }
}

export default {
  name: 'orbitals-2d',
  component: Orbitals2d
}
