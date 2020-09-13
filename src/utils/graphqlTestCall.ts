import { graphql } from 'graphql'
import graphqlSchema from '../graphql/composer'

export const graphqlTestCall = async (query: any, variables?: any) => {
  return await graphql(graphqlSchema, query, undefined, undefined, variables)
}
