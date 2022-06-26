import { priorityEnum, statusEnum } from '../interfaces/todoEnums'

interface todoCreationError {
    title?: string
    description?: string
    priority?: string
    status?: string
    startDate?: string
    endDate?: string
}

const isIsoDate = (str: string): boolean => {
    if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false
    const d = new Date(str)
    return d.toISOString() === str
}

const validateTodoCreation = (
    title: string,
    description: string,
    priority: string,
    status: string,
    startDate: string,
    endDate: string
): { valid: boolean; errors: todoCreationError } => {
    console.log(Object.values(priorityEnum))
    console.log(Object.values(statusEnum))

    const errors: todoCreationError = {}
    if (title.trim() == '') errors.title = 'Title must not be empty'
    if (description.trim() == '')
        errors.description = 'Description must not be empty'
    if (!Object.values(priorityEnum).includes(priority))
        errors.priority = 'Invalid Priority'
    if (!Object.values(statusEnum).includes(status))
        errors.status = 'Invalid Status'
    if (!isIsoDate(startDate)) errors.startDate = 'Invalid Start Date'
    if (!isIsoDate(endDate)) errors.endDate = 'Invalid End Date'
    else if (endDate <= startDate)
        errors.endDate = 'End Date should be after Start Date'
    return { valid: Object.keys(errors).length < 1, errors }
}

// const sortTodoPriority()

export { validateTodoCreation }
