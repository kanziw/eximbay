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

  makeQueryString (data = {}) {
    return go(
      data,
      data => Object.keys(data).sort(),
      sortedKeys => sortedKeys.reduce((newData, key) => {
        newData[ key ] = data[ key ]
        return newData
      }, {}),
      simpleQueryString.stringify,
    )
  }

  generateFgKey (data) {
    return pipe(
      this.makeQueryString,
      query => `${this.secret}?${query}`,
      d => sha256.create().update(d).hex()
    )(data)
  }

  renderTo (data = {}) {
    data = Object.assign(data, {
      ver: 230,
      txntype: 'PAYMENT',
      charset: 'UTF-8',
      mid: this.mid,
      fgkey: this.generateFgKey(data)
    })

    // SAMPLE REQUIRED KEYS
    const keys = [ 'statusurl', 'returnurl', 'ref', 'ostype', 'displaytype', 'paymethod', 'cur', 'amt', 'lang', 'buyer', 'email' ]
    keys.forEach(key => data[ key ] = key)

    const requestUrl = `${this.eximbayServerUrl}/Gateway/BasicProcessor.krp`

    const tmpl = url => `
    <div align="center" onload="javascript:document.regForm.submit()">
      <form name="regForm" method="post" action="${url}">
        <input type="submit">
        ${Object.entries(data).map(([ key, value ]) => `<input type="hidden" name="${key}" value="${value}" >`).join('\n')}
      </form>
    </div>
    `

    pipe(
      tmpl,
      $.el,
      $.append($('.request'))
    )(requestUrl)
  }
}

if (window) {
  window.EximbayClient = EximbayClient
} else {
  module.exports = EximbayClient
}
