import { Resolvers } from './__generated__/resolvers-types'
import { buildTransactionQuery } from './resolversUtils'

export const PER_PAGE = 20

export const resolvers: Resolvers = {
  Query: {
    transactions: async (_parent, args, context) => {
      const query = buildTransactionQuery(args)
      const transactions = await context.prisma.transaction.findMany(query)

      const hasNextPage = transactions.length > PER_PAGE
      if (hasNextPage) transactions.pop()

      return {
        nodes: transactions,
        pageInfo: {
          hasNextPage,
          page: args.page || 1
        }
      }
    },
    categories: async (_parent, _args, context) => (
      context.prisma.category.findMany({ orderBy: { name: 'asc' } })
    ),
    transaction: async (_parent, args, context) => (
      context.prisma.transaction.findUnique({ where: { id: args.id } })
    )
  },
  Mutation: {
    transaction: async (_parent, { id, ...data }, context) => (
      context.prisma.transaction.update({
        where: { id },
        data
      })
    )
  },
  Transaction: {
    category: async (parent, _args, context) => {
      if (!parent.categoryId) { return null }
      console.log('vim pegar cetegory... ainda que eu já tenha...')
      return context.prisma.category.findUnique({ where: { id: parent.categoryId } })
    },
    account: async (parent, _args, context) => {
      if (!parent.accountId) { return null }

      return context.prisma.account.findUnique({ where: { id: parent.accountId } })
    },
    date: async (parent, _args, _context) => (
      new Date(parent.date).toISOString()
    )
  }
}
