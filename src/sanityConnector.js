import sanityClient from 'part:@sanity/base/client'

const getFeed = query => sanityClient.observable.fetch(query)

module.exports = {
  getFeed
}
