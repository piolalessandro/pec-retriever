import { schemaComposer } from 'graphql-compose'
import { PersonQuery } from './resolvers/person'
import { PersonEnum } from '../types/types'

schemaComposer.createEnumTC(PersonEnum)

schemaComposer.Query.addFields({
  ...PersonQuery,
})

// Enable after enabling mutations graphql/resolvers/person.ts to add mutations to the Person type
// schemaComposer.Mutation.addFields({
//   ...PersonMutation,
// })

const graphqlSchema = schemaComposer.buildSchema()

export default graphqlSchema
