import React from 'react'
import PropTypes from 'prop-types'
import sanityConnector from './sanityConnector'
import styles from './Orbitals2d.css'
import {initializeWorld, addBody} from './generator'
const elementId = 'orbitals2dWorld'


class Orbitals2d extends React.Component {

  static propTypes = {
    query: PropTypes.string,
    transformDocument: PropTypes.func.isRequired,
    attractorColor: PropTypes.string
  }

  static defaultProps = {
    query: '*[]|order(_createdAt desc)[0..10]',
    attractorColor: '#606060'
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  unsubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

  componentDidMount = () => {
    const {query, attractorColor} = this.props
    initializeWorld({elementId, attractorColor})

    this.unsubscribe()
    this.subscription = sanityConnector.getFeed(query).subscribe(response => this.addOrbitals(response.items)
    )
  }

  addOrbitals(documents) {
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
