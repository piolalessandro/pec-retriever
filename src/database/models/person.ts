import mongoose from 'mongoose'
import { composeWithMongoose } from 'graphql-compose-mongoose'

export interface IPerson extends mongoose.Document {
  taxCode: string
  pec: string
}

const schema: mongoose.SchemaDefinition = {
  taxCode: {
    type: String,
    uppercase: true,
    unique: true,
    required: [true, 'Please insert a tax code'],
    minlength: [11, 'The tax code is too short'],
    maxlength: [16, 'The tax code is too long'],
    validate: {
      validator: (code: string) => /^[a-z0-9]+$/i.test(code),
      message: 'The tax code contains invalid characters',
    },
  },
  pec: { type: String, lowercase: true, index: true, trim: true },
}

const personSchema: mongoose.Schema = new mongoose.Schema(schema, { timestamps: true })

export const Person = mongoose.model('Person', personSchema)
export const PersonTC = composeWithMongoose(Person)
