import { PrismaClient } from '@prisma/client'
import * as path from 'path'
import * as fs from 'fs'
import { parse } from 'csv-parse/sync'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const prisma = new PrismaClient({
  log: ['error']
})

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const seedMetadatas = [{
  path: path.resolve(__dirname, 'data/categories.csv'),
  model: 'category',
  headers: []
},
{
  path: path.resolve(__dirname, 'data/accounts.csv'),
  model: 'account'
},
{
  path: path.resolve(__dirname, 'data/transactions.csv'),
  model: 'transaction'
}
]

function castDataType (columnValue, context) {
  if (context.column === 'date') {
    return new Date(columnValue)
  }

  return columnValue
}

function fetchSeedData () {
  const seedData = {}

  seedMetadatas.forEach((seedMetadata) => {
    const fileContent = fs.readFileSync(seedMetadata.path, { encoding: 'utf-8' })
    const records = parse(fileContent, {
      delimiter: ',',
      columns: true,
      objname: 'id',
      cast: castDataType
    })

    seedData[seedMetadata.model] = records
  })

  return seedData
}

async function main () {
  const seedData = fetchSeedData()
  const transactions = Object.values(seedData.transaction)
  for (let i = 0; i < transactions.length; i++) {
    const data = {}
    if (transactions[i].accountId) {
      data.account = {
        connectOrCreate: {
          where: {
            id: transactions[i].accountId
          },
          create: {
            ...seedData.account[transactions[i].accountId]
          }
        }
      }
    }
    if (transactions[i].categoryId) {
      data.category = {
        connectOrCreate: {
          where: {
            id: transactions[i].categoryId
          },
          create: {
            ...seedData.category[transactions[i].categoryId]
          }
        }
      }
    }

    await prisma.transaction.create({
      data: {
        id: transactions[i].id,
        reference: transactions[i].reference,
        amount: transactions[i].amount,
        currency: transactions[i].currency,
        date: transactions[i].date,
        ...data
      }
    }).catch(async e => {
      console.log(e, 'deu merda', transactions[i])
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
