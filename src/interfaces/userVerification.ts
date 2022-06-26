import { Document, Schema, PopulatedDoc } from 'mongoose'
import IUser from './user'

interface IUserVerification extends Document {
    code: string
    user: PopulatedDoc<Document<Schema.Types.ObjectId> & IUser>
}

export default IUserVerification
