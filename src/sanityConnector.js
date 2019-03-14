import sanityClient from 'part:@sanity/base/client'

const getFeed = query => sanityClient.listen(query, {}, {events: ['mutation']})


module.exports = {
  getFeed
}
