import sanityClient from 'part:@sanity/base/client'

const getFeed = query => sanityClient.observable.fetch(query)

const getFeed2 = query => sanityClient
  .listen(query, {}, {events: ['welcome', 'mutation']})


module.exports = {
  getFeed: getFeed2
}
