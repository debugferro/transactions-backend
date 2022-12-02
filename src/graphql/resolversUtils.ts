import { Prisma } from '@prisma/client'
import { QueryTransactionsArgs } from './__generated__/resolvers-types'
import { PER_PAGE } from './resolvers'

export const buildTransactionQuery = ({ page, startDate, endDate, ...otherArgs }: QueryTransactionsArgs): Prisma.TransactionFindManyArgs => {
  const currentPage = (page || 1) - 1

  const query: Prisma.TransactionFindManyArgs = {
    skip: currentPage * PER_PAGE,
    take: PER_PAGE + 1,
    where: {}
  }

  Object.entries(otherArgs).forEach(([key, value]) => {
    if (key === 'category') {
      query.where[key] = {
        is: {
          id: value
        }
      }
    } else {
      query.where[key] = {
        contains: value,
        mode: 'insensitive'
      }
    }
  })

  if (startDate || endDate) {
    query.where.date = {}
    query.where.date.gte = startDate ? new Date(startDate) : undefined
    query.where.date.lte = endDate ? new Date(endDate) : undefined
    query.orderBy = [{
      date: 'asc'
    }]
  }

  return query
}
