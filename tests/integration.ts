process.env.NODE_ENV = 'test'

import * as dotenv from 'dotenv'
import { expect } from 'chai'
import { ApolloServer } from 'apollo-server-express'
import graphqlSchema from '../src/graphql/composer'
import { createTestClient } from 'apollo-server-testing'
import { PersonType } from '../src/types/types'
import { dbConnect } from '../src/database/database'
import gql from 'graphql-tag'

dotenv.config({ path: '../.env' })

const GET_PEC_BY_TAX_CODE = gql`
  query taxCode($taxCode: String, $personType: PersonEnum) {
    pecByTaxCode(taxCode: $taxCode, personType: $personType)
  }`

describe('pec retrieval', () => {
  let server: ApolloServer

  before(() => {
    dbConnect()
    server = new ApolloServer({ schema: graphqlSchema })
  })

  it('should return pec for valid tax code of legal person', async () => {
    const { query } = createTestClient(server)
    const res = await query({
      query: GET_PEC_BY_TAX_CODE,
      variables: { taxCode: '09276010965', personType: PersonType.LEGAL },
    })
    expect(res.data).to.equal('parkingo.group@legalmail.it')
  })
  it('should return pec for valid tax code of natural person', async () => {
    const { query } = createTestClient(server)
    const res = await query({
      query: GET_PEC_BY_TAX_CODE,
      variables: { taxCode: 'BBLLRI79H57B745C', personType: PersonType.NATURAL },
    })
    expect(res.data).to.equal('ilaria.obbili.594@psypec.it')
  })
  it('should not accept short tax codes', async () => {
    const { query } = createTestClient(server)
    const res = await query({
      query: GET_PEC_BY_TAX_CODE,
      variables: { taxCode: '0927', personType: PersonType.LEGAL },
    })
    expect(res.errors["extensions"].code).to.equal('SHORT_TAX_CODE')
  })
  it('should not accept long tax codes', async () => {
    const { query } = createTestClient(server)
    const res = await query({
      query: GET_PEC_BY_TAX_CODE,
      variables: { taxCode: '09276010965234156', personType: PersonType.LEGAL },
    })
    expect(res.errors["extensions"].code).to.equal('LONG_TAX_CODE')

  })
  it('should not accept empty tax codes', async () => {
    const { query } = createTestClient(server)
    const res = await query({
      query: GET_PEC_BY_TAX_CODE,
      variables: { taxCode: '', personType: PersonType.LEGAL },
    })
    expect(res.errors["extensions"].code).to.equal('SHORT_TAX_CODE')
  })
  it('should not accept tax codes with invalid characters', async () => {
    const { query } = createTestClient(server)
    const res = await query({
      query: GET_PEC_BY_TAX_CODE,
      variables: { taxCode: '09276010__5', personType: PersonType.LEGAL },
    })
    expect(res.errors["extensions"].code).to.equal('INVALID_TAX_CODE')
  })
  it('should return not found for unregistered valid tax code', async () => {
    const { query } = createTestClient(server)
    const res = await query({
      query: GET_PEC_BY_TAX_CODE,
      variables: { taxCode: '09276010964', personType: PersonType.LEGAL },
    })
    expect(res.errors["extensions"].code).to.equal('NO_PEC_FOUND')
  })
})
