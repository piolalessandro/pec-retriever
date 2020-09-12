import { GraphQLEnumType } from 'graphql-compose/lib/graphql'

export const enum PersonType {
  NATURAL = 'professionals',
  LEGAL = 'companies',
}

export const PersonEnum = new GraphQLEnumType({
  name: 'PersonEnum',
  values: {
    NATURAL: { value: 'professionals' },
    LEGAL: { value: 'companies' },
  },
})
