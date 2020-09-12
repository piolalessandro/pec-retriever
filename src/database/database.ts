import 'dotenv-safe/config'
import Mongoose from 'mongoose'

let database: Mongoose.Connection

export const dbConnect = async () => {
  const dbDetails = {
    user: 'pec-retriever-user',
    password: process.env.DATABASE_PASSWORD,
    db: 'pec-retriever',
  }
  const dbUri = `mongodb+srv://${dbDetails.user}:${dbDetails.password}@pec-retriever.mzc8t.gcp.mongodb.net/${dbDetails.db}?retryWrites=true&w=majority`

  if (!database) {
    try {
      await Mongoose.connect(dbUri, {
        bufferCommands: false,
        bufferMaxEntries: 0,
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      })
    } catch (error) {
      console.log('Database connection error', error)
    }

    database = Mongoose.connection

    database.once('open', async () => {
      console.log('Connected to database')
    })

    database.on('error', error => {
      console.log('Database error', error)
    })
  }

  return { database }
}

export const dbDisconnect = () => {
  if (!database) {
    return
  }

  Mongoose.disconnect()
}
