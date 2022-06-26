import express from 'express'
import ITodo from '../interfaces/todo'
import { priorityEnum, statusEnum } from '../interfaces/todoEnums'
import { checkAuth, checkVerified } from '../middleware/checkAuth'
import Todo from '../models/Todo'
import { populateTodo } from '../utils/todoConfig'
import { validateTodoCreation } from '../utils/todoValidation'
const router = express.Router()

router.post('/', checkAuth, checkVerified, async (req, res) => {
    const { title, description, priority, status, startDate, endDate } =
        req.body
    const { id, email } = res.locals['user']
    const { valid, errors } = validateTodoCreation(
        title,
        description,
        priority,
        status,
        startDate,
        endDate
    )
    if (!valid) return res.status(400).json({ success: false, errors })
    const todo: ITodo = new Todo({
        userEmail: email,
        title,
        description,
        priority: +priorityEnum[priority],
        status: +statusEnum[status],
        startDate,
        endDate,
        user: id,
    })
    const result = await todo.save()
    res.status(200).json({
        success: true,
        data: result,
    })
})
router.get('/', checkAuth, checkVerified, async (req, res) => {
    const { id } = res.locals['user']
    const todos: ITodo[] = await Todo.find({ user: id }).sort(
        'priority -endDate'
    )
    const populatedTodos = todos.map((t) => populateTodo(t))
    res.status(200).json({ success: true, data: populatedTodos })
})
// router.patch('/:id', checkAuth, checkVerified, async(req, res) => {

// })
router.get('/:id', checkAuth, checkVerified, async (req, res) => {
    const { id } = req.params
    const todo = (await Todo.findById(id)) as ITodo
    if (!todo)
        return res.status(400).json({
            success: false,
            errors: {
                general: 'Todo Not Found',
            },
        })
    console.log(todo.user == res.locals['user'].user)

    if (todo.user != res.locals['user'].id)
        return res.status(401).json({
            success: false,
            errors: {
                accessibility: 'Not accessible',
            },
        })
    return res.status(200).json({ success: true, data: populateTodo(todo) })
})
router.delete('/:id', checkAuth, checkVerified, async (req, res) => {
    const { id } = req.params
    const todo = (await Todo.findById(id)) as ITodo
    if (!todo)
        return res.status(400).json({
            success: false,
            errors: {
                general: 'Todo Not Found',
            },
        })
    if (todo.user != res.locals['user'].id)
        return res.status(401).json({
            success: false,
            errors: {
                accessibility: 'Not accessible',
            },
        })
    await todo.delete()
    return res.status(200).json({
        success: true,
        message: 'deleted',
    })
})
router.patch('/:id', checkAuth, checkVerified, async (req, res) => {
    const { id } = req.params
    const { title, description, priority, status, startDate, endDate } =
        req.body
    const user = res.locals['user']
    const { valid, errors } = validateTodoCreation(
        title,
        description,
        priority,
        status,
        startDate,
        endDate
    )
    if (!valid) return res.status(400).json({ success: false, errors })
    const todo = (await Todo.findById(id)) as ITodo
    if (!todo)
        return res.status(400).json({
            success: false,
            errors: {
                general: 'Todo Not Found',
            },
        })
    if (todo.user != user.id)
        return res.status(401).json({
            success: false,
            errors: {
                accessibility: 'Not accessible',
            },
        })
    const result = await Todo.findByIdAndUpdate(
        id,
        {
            title,
            description,
            priority,
            status,
            startDate,
            endDate,
        },
        { new: true }
    )
    return res.status(200).json({ success: true, data: result })
})

export default router
