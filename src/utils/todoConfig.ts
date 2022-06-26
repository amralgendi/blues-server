import ITodo from '../interfaces/todo'
import { priorityEnum, statusEnum } from '../interfaces/todoEnums'

const populateTodo = (todo: ITodo) => {
    return {
        ...todo.toObject(),
        priority: Object.values(priorityEnum)[todo.priority],
        status: Object.values(statusEnum)[todo.status],
    }
}

export { populateTodo }
