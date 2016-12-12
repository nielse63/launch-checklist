import assert from 'assert'
import _ from 'lodash'
import cheerio from 'cheerio'
import https from 'https'

import request from '../../lib/request'
import seo from '../../lib/tests/seo'

let $
let output
const TEST_URL = 'https://www.facebook.com/'

describe('tests/seo', function () {

  before(function(done) {
    request(TEST_URL, (err, data) => {
      if(err) {
        throw new Error(err)
      }

      $ = cheerio.load(data.body)
      output = seo($)
      done()
    })
  })

  it('SEO should return object', function() {
    assert(
      _.isPlainObject(output)
      )
  })

  it('SEO should have desired keys', function() {
    assert(_.has(output, 'passed'))
    assert(_.has(output, 'info'))
    assert(_.has(output, 'reason'))
  })
})
