import { sortByKeys, makeQueryString } from '../common'

const paymentTmpl = curry2((url, data) => `
    <div align="center">
      <form method="post" action="${url}">
        <input type="submit">
        ${Object.entries(data).map(([ key, value ]) => `<input type="hidden" name="${key}" value="${value}" >`).join('\n')}
      </form>
    </div>
    `)

class EximbayClient {
  /**
   * @param {string} mid
   * @param {string} secret
   * @param {string} [env=prod]
   */
  constructor (mid, secret, { env = 'prod' }) {
    this.mid = mid
    this.secret = secret
    this.eximbayServerUrl = `https://secureapi${env === 'prod' ? '' : '.test'}.eximbay.com`
  }

  generateFgKey (data = {}) {
    return pipe(
      makeQueryString,
      query => `${this.secret}?${query}`,
      d => sha256.create().update(d).hex(),
    )(data)
  }

  renderPayment (data = {}) {
    return pipe(
      data => Object.assign({}, data, {
        ver: 230,
        txntype: 'PAYMENT',
        charset: 'UTF-8',
        mid: this.mid,
      }),
      sortByKeys,
      data => {
        data.fgkey = this.generateFgKey(data)
        return data
      },
      paymentTmpl(`${this.eximbayServerUrl}/Gateway/BasicProcessor.krp`),
      $.el,
      $.append($('.request'))
    )(data)
  }
}

if (window) {
  window.EximbayClient = EximbayClient
} else {
  module.exports = EximbayClient
}
