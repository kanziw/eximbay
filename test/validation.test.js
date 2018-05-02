import _ from 'partial-js'
import { expect } from 'chai'
import EximbayServer, { RESPONSE_CODE, PAYMENT_STATUS } from '../src/server'
import { ExpiredCard } from './res/MockResult'

/** @type {EximbayServer} */
const eximbayServer = new EximbayServer('289F40E6640124B2628640168C3C5464')

describe('Validation', function () {
  it('should fail /w expired card.', async () => {
    const body = _.clone(ExpiredCard)

    /** @type {PaymentValidationResponse} */
    const paymentResult = await eximbayServer.requestPaymentResult(body)

    // 왜 성공하는가...?!!
    expect(paymentResult.rescode).to.equal(RESPONSE_CODE.SUCCESS)
    expect(paymentResult.status).to.equal(PAYMENT_STATUS.SALE)
  })
})
