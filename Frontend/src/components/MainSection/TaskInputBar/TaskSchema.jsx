import {v4 as uuidv4} from 'uuid'

export const createTask = (input) => ({
    id: uuidv4(),
    text: input,
    completed: false,
    dueDate: '',
    priority: 'none',
    memo: '',
    memoLastModified: null,
    projectId: null
})

export const taskPriorities = {
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low',
    NONE: 'none'
}

