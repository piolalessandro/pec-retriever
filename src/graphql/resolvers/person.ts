import { Person, PersonTC } from '../../database/models/person'
import { scrapePec } from '../../utils/scrapePec'
import { PersonType, PersonEnum } from '../../types/types'
import { ApolloError } from 'apollo-server-express'

const validateInput = (taxCode: string): void => {
  if (taxCode.length > 16) {
    throw new ApolloError('The tax code is too long', 'LONG_TAX_CODE')
  }

  if (taxCode.length < 11) {
    throw new ApolloError('The tax code is too short', 'SHORT_TAX_CODE')
  }

  if (!/^[a-z0-9]+$/i.test(taxCode)) {
    throw new ApolloError('The tax code contains invalid characters', 'INVALID_TAX_CODE')
  }
}

PersonTC.addResolver({
  kind: 'query',
  name: 'findPecByTaxCode',
  args: {
    taxCode: 'String!',
    personType: PersonEnum!,
  },
  type: 'String',
  resolve: async ({ args }: { args: { taxCode: string; personType: PersonType } }) => {
    validateInput(args.taxCode)

    const dbRes = await Person.find({ taxCode: args.taxCode }).select('pec').exec()
    if (dbRes.length === 0) {
      const scraperRes = await scrapePec(args.taxCode, args.personType)
      if (typeof scraperRes === 'string' && scraperRes.length > 0) {
        await Person.create({ taxCode: args.taxCode, pec: scraperRes }).catch(err => console.log(err))
        return scraperRes
      }
      throw new ApolloError('No pec found for the given tax code', 'NO_PEC_FOUND')
    }
    return dbRes[0].get('pec')
  },
})

const PersonQuery = {
  personConnection: PersonTC.getResolver('connection'),
  pecByTaxCode: PersonTC.getResolver('findPecByTaxCode'),
}

// Enable and export PersonMutation to add schema mutations to the Person type, then import it in graphql/composer.ts
// const PersonMutation = {
//   personCreateOne: PersonTC.getResolver('createOne'),
//   personUpdateOne: PersonTC.getResolver('updateOne'),
//   personRemoveOne: PersonTC.getResolver('removeOne'),
// }

export { PersonQuery }
