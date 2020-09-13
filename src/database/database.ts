import 'dotenv-safe/config'
import Mongoose from 'mongoose'

let database: Mongoose.Connection

export const dbConnect = async () => {
  const dbUri = process.env.DATABASE_CONNECTION_STRING

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
