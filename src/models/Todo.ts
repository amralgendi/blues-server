import { Model, model, Schema } from 'mongoose'
import ITodo from '../interfaces/todo'

const todoSchema = new Schema({
    userEmail: String,
    title: String,
    description: String,
    priority: {
        type: Number,
        enum: [0, 1, 2],
    },
    status: {
        type: Number,
        enum: [0, 1, 2, 3],
    },
    startDate: String,
    endDate: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: String,
        default: new Date().toISOString(),
    },
})

const Todo: Model<ITodo> = model<ITodo>('Todo', todoSchema)

export default Todo
