import sanityClient from 'part:@sanity/base/client'

export default {
  getFeed: query => sanityClient.observable.fetch(query)
}
