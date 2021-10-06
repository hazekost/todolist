import { v1 } from "uuid"
import { AddTodoListActionType, RemoveTodoListActionType } from "./todoLists-reducer"

type TaskType = {
    id: string
    title: string
    isDone: boolean
}
type TasksType = {
    [key: string]: Array<TaskType>
}
type ActionType = AddTaskActionType | RemoveTaskActionType | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType | AddTodoListActionType | RemoveTodoListActionType

let todoListId1 = v1()
let todoListId2 = v1()
let initialState: TasksType = {
    [todoListId1]: [
        { id: v1(), title: "HTML & CSS", isDone: true },
        { id: v1(), title: "JS", isDone: true },
        { id: v1(), title: "ReactJS", isDone: false }
    ],
    [todoListId2]: [
        { id: v1(), title: "Milk", isDone: true },
        { id: v1(), title: "Bread", isDone: false }
    ]
}

export const tasksReducer = (state: TasksType = initialState, action: ActionType): TasksType => {
    switch (action.type) {
        case "ADD-TASK":
            return { ...state, [action.id]: [...state[action.id], { id: v1(), title: action.title, isDone: false }] }
        case "REMOVE-TASK":
            return { ...state, [action.tlid]: state[action.tlid].filter(t => t.id !== action.id) }
        case "CHANGE-TASK-STATUS":
            return { ...state, [action.tlid]: state[action.tlid].map(t => t.id === action.id ? { ...t, isDone: action.isDone } : t) }
        case "CHANGE-TASK-TITLE":
            return { ...state, [action.tlid]: state[action.tlid].map(t => t.id === action.id ? { ...t, title: action.title } : t) }
        case "ADD-TODOLIST":
            return { ...state, [action.id]: [] }
        case "REMOVE-TODOLIST":
            let stateCopy = { ...state }
            delete stateCopy[action.id]
            return stateCopy
        default:
            return state
    }
}

type AddTaskActionType = ReturnType<typeof addTaskAC>
type RemoveTaskActionType = ReturnType<typeof removeTaskAC>
type ChangeTaskStatusActionType = ReturnType<typeof changeTaskStatusAC>
type ChangeTaskTitleActionType = ReturnType<typeof changeTaskTitleAC>

export const addTaskAC = (title: string, id: string) => ({ type: "ADD-TASK" as const, id, title })
export const removeTaskAC = (tlid: string, id: string) => ({ type: "REMOVE-TASK" as const, tlid, id })
export const changeTaskStatusAC = (tlid: string, id: string, isDone: boolean) => (
    { type: "CHANGE-TASK-STATUS" as const, tlid, id, isDone }
)
export const changeTaskTitleAC = (tlid: string, id: string, title: string) => (
    { type: "CHANGE-TASK-TITLE" as const, tlid, id, title }
)