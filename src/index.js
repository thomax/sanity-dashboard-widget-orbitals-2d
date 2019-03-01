import React from 'react'
import sanityClient from 'part:@sanity/base/client'
import styles from './Orbitals2d.css'
import {initializeWorld, addBody} from './generator'
const elementId = 'orbitals2dWorld'

function fetch() {
  return sanityClient.fetch(query)
}

class Orbitals2d extends React.Component {
  componentDidMount() {
    const {query, transformDocument, attractorColor} = this.props
    initializeWorld({elementId, attractorColor})
    fetch(query).then(documents => {
      documents.forEach(doc => {
        const bodyOptions = transformDocument(doc)
        addBody(bodyOptions)
      })
    })
  }

  render() {
    return <div id={elementId} className={styles.container} />
  }
}

export default {
  name: 'orbitals-2d',
  component: Orbitals2d
}
