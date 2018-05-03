import crypto from 'crypto'
import qs from 'querystring'
import _ from 'partial-js'
import request from 'request'
import { sortByKeys, makeQueryString } from '../common'

export default class EximbayServer {
  constructor (secret) {
    this.secret = secret
  }

  _generateFGKey = _.pipe(
    sortByKeys,
    makeQueryString,
    query => `${this.secret}?${query}`,
    d => crypto.createHash('sha256').update(d).digest('hex'),
  )

  /** @returns {Promise<PaymentValidationResponse>} */
  requestPaymentResult = _.pipe(
    _.pick([ 'ver', 'mid', 'ref', 'cur', 'amt', 'transid' ]),
    _.extend({ txntype: 'QUERY', keyfield: 'TRANSID', lang: 'KR', charset: 'UTF-8' }),
    data => {
      data.fgkey = this._generateFGKey(data)
      return data
    },
    form => new Promise((resolve, reject) => request.post(
      { url: 'https://secureapi.test.eximbay.com/Gateway/DirectProcessor.krp', form },
      (err, _, body) => err ? reject(err) : resolve(body))),
    qs.parse,
    _.mapObject((val) => _.isString(val) ? val.trim() : val),
  )
}

export const RESPONSE_CODE = {
  SUCCESS: '0000',
  // 응답 파라미터의 rescode 가 0000이면 정상을 의미하며, 이외의 코드는 거절을 의미합니다. 거절코드 에 대한 상세 내용은 resmsg 를 참고해 주시기 바랍니다.
}

export const PAYMENT_STATUS = {
  SALE: 'SALE',               // 정상매출, 매출 확정
  AUTH: 'AUTH',               // 승인거래, 매출 미확정, Capture 시 매출 확정
  REGISTERED: 'REGISTERED',   // 주문등록, 매출 미확정, 입금통지 시 매 출 확정
  NONE: 'NONE',               // 거래없음
}

/**
 * @typedef {object} PaymentValidationResponse
 *
 * @property {string} cur                 ex) 'USD',
 * @property {string} ver                 ex) '230',
 * @property {string} cardno1             ex) '1234',
 * @property {string} transid             ex) '1849705C6420180430000032',
 * @property {string} resdt               ex) '20180430183525',
 * @property {string} cardno4             ex) '1234',
 * @property {string} mid                 ex) '1849705C64',
 * @property {string} amt                 ex) '1.0',
 * @property {string} param3              ex) '',
 * @property {string} resmsg              ex) 'Success.',
 * @property {string} param1              ex) '',
 * @property {RESPONSE_CODE} rescode      ex) '0000',
 * @property {string} param2              ex) '',
 * @property {string} authcode            ex) '',
 * @property {string} ref                 ex) 'demo201704182020234',
 * @property {string} paymethod           ex) 'P101',
 * @property {string} fgkey               ex) '76C20565DA910F2085A3440043D1D90D8F5FE45AC4DE449341248A1D580CF6E6',
 * @property {string} balance             ex) '0.0',
 * @property {string} txntype             ex) 'QUERY',
 * @property {PAYMENT_STATUS} status      ex) 'SALE\n'
 */
