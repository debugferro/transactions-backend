import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'node:fs'
import { resolvers } from './graphql/resolvers'

export const prisma = new PrismaClient({
  log: ['query', 'error']
})

export interface Context {
  prisma?: PrismaClient
}

async function main() {
  const typeDefs = readFileSync('src/graphql/schema.graphql', 'utf-8')
  const server = new ApolloServer<Context>({
    typeDefs,
    resolvers
  })
  
  const { url } = await startStandaloneServer(server, {
    context: async () => {
      return {
        prisma
      }
    },
    listen: { port: 4000 }
  })
  console.log(`🚀  Server ready at: ${url}`)
}

main()
