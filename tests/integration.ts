process.env.NODE_ENV = 'test'

import { dbConnect, dbDisconnect } from '../src/database/database'
import { graphqlTestCall } from "../src/utils/graphqlTestCall";

const GET_PEC_BY_TAX_CODE = `
  query taxCode($taxCode: String!, $personType: PersonEnum) {
    pecByTaxCode(taxCode: $taxCode, personType: $personType)
  }
`
beforeAll(async () => {
  await dbConnect()
})

afterAll(() => {
  dbDisconnect()
})

describe('pec retrieval', () => {
  it('should return pec for valid tax code of legal person', async () => {
    const res = await graphqlTestCall(GET_PEC_BY_TAX_CODE, { taxCode: '09276010965', personType: "LEGAL" })
    expect(res.data).toEqual({"pecByTaxCode": "parkingo.group@legalmail.it"})
  })
  it('should return pec for valid tax code of natural person', async () => {
    const res = await graphqlTestCall(GET_PEC_BY_TAX_CODE, { taxCode: 'BBLLRI79H57B745C', personType: "NATURAL" })
    expect(res.data).toEqual({"pecByTaxCode": "ilaria.obbili.594@psypec.it"})
  })
  it('should not accept short tax codes', async () => {
    const res = await graphqlTestCall(GET_PEC_BY_TAX_CODE, { taxCode: '0927', personType: "LEGAL" })
    expect(res.errors![0]!.extensions).toEqual({ code: 'SHORT_TAX_CODE' })
  })
  it('should not accept long tax codes', async () => {
    const res = await graphqlTestCall(GET_PEC_BY_TAX_CODE, { taxCode: '09276010965234156', personType: "LEGAL" })
    expect(res.errors![0]!.extensions).toEqual({ code: 'LONG_TAX_CODE' })
  })
  it('should not accept empty tax codes', async () => {
    const res = await graphqlTestCall(GET_PEC_BY_TAX_CODE, { taxCode: '', personType: "LEGAL" })
    expect(res.errors![0]!.extensions).toEqual({ code: 'SHORT_TAX_CODE' })
  })
  it('should not accept tax codes with invalid characters', async () => {
    const res = await graphqlTestCall(GET_PEC_BY_TAX_CODE, { taxCode: '09276010__5', personType: "LEGAL" })
    expect(res.errors![0]!.extensions).toEqual({ code: 'INVALID_TAX_CODE' })
  })
  // test commented temporarily: 2captcha api not responding right now
  // it('should return not found for unregistered valid tax code', async () => {
  //   jest.setTimeout(90000)
  //   const res = await graphqlTestCall(GET_PEC_BY_TAX_CODE, { taxCode: '09276010964', personType: "LEGAL" })
  //   expect(res.errors![0]!.extensions).toEqual({ code: 'NO_PEC_FOUND' })
  // })
})
