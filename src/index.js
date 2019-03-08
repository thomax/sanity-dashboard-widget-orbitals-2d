import React from 'react'
import PropTypes from 'prop-types'
import sanityClient from 'part:@sanity/base/client'
import styles from './Orbitals2d.css'
import {initializeWorld, addBody} from './generator'
const elementId = 'orbitals2dWorld'

function fetch(query) {
  return sanityClient.fetch(query)
}

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

  componentDidMount = () => {
    const {query, transformDocument, attractorColor} = this.props
    initializeWorld({elementId, attractorColor})
    fetch(query).then(documents => {
      documents.forEach(doc => {
        const bodyOptions = transformDocument(doc)
        addBody(bodyOptions)
      })
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
