import { MongoClient } from 'mongodb'

const uri = process.env.MONGO_URL
const dbName = process.env.DB_NAME || 'portfolio'

if (!uri) {
  console.warn('MONGO_URL is not defined')
}

let globalWithMongo = global

if (!globalWithMongo._mongoClientPromise) {
  const client = new MongoClient(uri)
  globalWithMongo._mongoClientPromise = client.connect()
}

export async function getDb() {
  const client = await globalWithMongo._mongoClientPromise
  return client.db(dbName)
}

export async function getCol(name) {
  const db = await getDb()
  return db.collection(name)
}
