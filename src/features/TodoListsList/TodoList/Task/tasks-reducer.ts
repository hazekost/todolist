import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Dispatch } from "redux"
import { ItemType, todoAPI } from "../../../../api/api"
import { RequestStatusType, setAppStatusAC } from "../../../../app/app-reducer"
import { AppRootStateType } from "../../../../app/store"
import { handleServerAppError, handleServerNetworkError } from "../../../../utils/error-utils"
import { addTodoListAC, removeTodoListAC, setTodoListsAC } from "../todoLists-reducer"

// enum TASKS_TYPES {
//     ADD_TASK = "TASKS/ADD_TASK", REMOVE_TASK = "TASKS/REMOVE_TASK", CHANGE_TASK_TITLE = "TASKS/CHANGE_TASK_TITLE",
//     CHANGE_TASK_STATUS = "TASKS/CHANGE_TASK_STATUS", SET_TASKS = "TASKS/SET_TASKS", CHANGE_TASK_ENTITY_STATUS = "TASKS/CHANGE_TASK_ENTITY_STATUS"
// }

// type TasksActionType = AddTaskActionType | RemoveTaskActionType | ChangeTaskStatusActionType | ChangeTaskTitleActionType
//     | AddTodoListActionType | RemoveTodoListActionType | SetTasksActionType | SetTodoListsActionType | ChangeTaskEntityStatusActionType

// export const tasksReducer = (state: TasksType = initialTasksState, action: TasksActionType): TasksType => {
//     switch (action.type) {
//         case TASKS_TYPES.ADD_TASK:
//             return { ...state, [action.task.todoListId]: [{ ...action.task, entityStatus: "idle" }, ...state[action.task.todoListId]] }
//         case TASKS_TYPES.REMOVE_TASK:
//             return { ...state, [action.tlid]: state[action.tlid].filter(t => t.id !== action.id) }
//         case TASKS_TYPES.CHANGE_TASK_STATUS:
//             return { ...state, [action.tlid]: state[action.tlid].map(t => t.id === action.id ? { ...t, status: action.status } : t) }
//         case TASKS_TYPES.CHANGE_TASK_TITLE:
//             return { ...state, [action.tlid]: state[action.tlid].map(t => t.id === action.id ? { ...t, title: action.title } : t) }
//         case addTodoListAC.type:
//             return { ...state, [action.payload.data.id]: [] }
//         case removeTodoListAC.type: {
//             let stateCopy = { ...state }
//             delete stateCopy[action.payload.id]
//             return stateCopy
//         }
//         case TASKS_TYPES.SET_TASKS:
//             return { ...state, [action.id]: action.tasks.map((t: any) => ({ ...t, entityStatus: "idle" })) }
//         case setTodoListsAC.type: {
//             let stateCopy = { ...state }
//             action.payload.todoLists.forEach((tl: any) => {
//                 stateCopy[tl.id] = []
//             })
//             return stateCopy
//         }
//         case TASKS_TYPES.CHANGE_TASK_ENTITY_STATUS:
//             return {
//                 ...state, [action.tlid]: state[action.tlid].map(t => t.id === action.taskid
//                     ? { ...t, entityStatus: action.status }
//                     : t)
//             }
//         default:
//             return state
//     }
// }

// type AddTaskActionType = ReturnType<typeof addTaskAC>
// type RemoveTaskActionType = ReturnType<typeof removeTaskAC>
// type ChangeTaskStatusActionType = ReturnType<typeof changeTaskStatusAC>
// type ChangeTaskTitleActionType = ReturnType<typeof changeTaskTitleAC>
// type SetTasksActionType = ReturnType<typeof setTasksAC>
// type ChangeTaskEntityStatusActionType = ReturnType<typeof changeTaskEntityStatus>

// export const addTaskAC = (task: ItemType) => (
//     { type: TASKS_TYPES.ADD_TASK as const, task }
// )
// export const removeTaskAC = (tlid: string, id: string) => (
//     { type: TASKS_TYPES.REMOVE_TASK as const, tlid, id }
// )
// export const changeTaskStatusAC = (tlid: string, id: string, status: number) => (
//     { type: TASKS_TYPES.CHANGE_TASK_STATUS as const, tlid, id, status }
// )
// export const changeTaskTitleAC = (tlid: string, id: string, title: string) => (
//     { type: TASKS_TYPES.CHANGE_TASK_TITLE as const, tlid, id, title }
// )
// const setTasksAC = (id: string, tasks: Array<ItemType>) => (
//     { type: TASKS_TYPES.SET_TASKS as const, tasks, id }
// )
// const changeTaskEntityStatus = (tlid: string, taskid: string, status: RequestStatusType) => (
//     { type: TASKS_TYPES.CHANGE_TASK_ENTITY_STATUS as const, tlid, taskid, status }
// )

export const getTasks = createAsyncThunk("tasks/getTasks", async (tlid: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({ status: "loading" }))
    try {
        const res = await todoAPI.getTasks(tlid)
        thunkAPI.dispatch(setAppStatusAC({ status: "succeeded" }))
        return { tlid, tasks: res.data.items }
    } catch (err: any) {
        thunkAPI.dispatch(setAppStatusAC({ status: "failed" }))
        handleServerNetworkError(err, thunkAPI.dispatch)
    }
})
// export const getTasks = (id: string) => (dispatch: Dispatch) => {
//     dispatch(setAppStatusAC({ status: "loading" }))
//     todoAPI.getTasks(id)
//         .then(res => {
//             dispatch(setAppStatusAC({ status: "succeeded" }))
//             dispatch(setTasksAC({ id, tasks: res.data.items }))
//         })
//         .catch(err => {
//             dispatch(setAppStatusAC({ status: "failed" }))
//             handleServerNetworkError(err, dispatch)
//         })
// }

export const deleteTask = createAsyncThunk("tasks/deleteTask", async (param: { tlid: string, taskid: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({ status: "loading" }))
    thunkAPI.dispatch(changeTaskEntityStatus({ tlid: param.tlid, id: param.taskid, status: "loading" }))
    try {
        const res = await todoAPI.deleteTask(param.tlid, param.taskid)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(changeTaskEntityStatus({ tlid: param.tlid, id: param.taskid, status: "succeeded" }))
            thunkAPI.dispatch(setAppStatusAC({ status: "succeeded" }))
            return { tlid: param.tlid, taskid: param.taskid }
        } else {
            thunkAPI.dispatch(changeTaskEntityStatus({ tlid: param.tlid, id: param.taskid, status: "failed" }))
            handleServerAppError(res.data, thunkAPI.dispatch)
        }
    } catch (err: any) {
        thunkAPI.dispatch(changeTaskEntityStatus({ tlid: param.tlid, id: param.taskid, status: "failed" }))
        handleServerNetworkError(err, thunkAPI.dispatch)
    }
})
// export const deleteTask_ = (tlid: string, taskid: string) => (dispatch: Dispatch) => {
//     dispatch(setAppStatusAC({ status: "loading" }))
//     dispatch(changeTaskEntityStatus({ tlid, id: taskid, status: "loading" }))
//     todoAPI.deleteTask(tlid, taskid)
//         .then(res => {
//             if (res.data.resultCode === 0) {
//                 dispatch(changeTaskEntityStatus({ tlid, id: taskid, status: "succeeded" }))
//                 dispatch(setAppStatusAC({ status: "succeeded" }))
//                 dispatch(removeTaskAC({ tlid, id: taskid }))
//             } else {
//                 dispatch(changeTaskEntityStatus({ tlid, id: taskid, status: "failed" }))
//                 handleServerAppError(res.data, dispatch)
//             }
//         })
//         .catch(err => {
//             dispatch(changeTaskEntityStatus({ tlid, id: taskid, status: "failed" }))
//             handleServerNetworkError(err, dispatch)
//         })
// }

export const createTask = createAsyncThunk("tasks/createTask", async (param: { tlid: string, title: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({ status: "loading" }))
    try {
        const res = await todoAPI.createTask(param.tlid, param.title)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({ status: "succeeded" }))
            return { task: res.data.data.item }
        } else {
            thunkAPI.dispatch(setAppStatusAC({ status: "failed" }))
            handleServerAppError(res.data, thunkAPI.dispatch)
        }
    } catch (err: any) {
        thunkAPI.dispatch(setAppStatusAC({ status: "failed" }))
        handleServerNetworkError(err, thunkAPI.dispatch)
    }
})
// export const createTask_ = (id: string, title: string) => (dispatch: Dispatch) => {
//     dispatch(setAppStatusAC({ status: "loading" }))
//     todoAPI.createTask(id, title)
//         .then(res => {
//             if (res.data.resultCode === 0) {
//                 dispatch(addTaskAC({ task: res.data.data.item }))
//                 dispatch(setAppStatusAC({ status: "succeeded" }))
//             } else {
//                 dispatch(setAppStatusAC({ status: "failed" }))
//                 handleServerAppError(res.data, dispatch)
//             }
//         })
//         .catch(err => {
//             dispatch(setAppStatusAC({ status: "failed" }))
//             handleServerNetworkError(err, dispatch)
//         })
// }

export type TasksType = {
    [key: string]: Array<ItemType & { entityStatus: RequestStatusType }>
}

let initialTasksState: TasksType = {}

const slice = createSlice({
    name: "tasks",
    initialState: initialTasksState,
    reducers: {
        // addTaskAC: (state, action: PayloadAction<{ task: ItemType }>) => {
        //     state[action.payload.task.todoListId].unshift({ ...action.payload.task, entityStatus: "idle" })
        // },
        // removeTaskAC: (state, action: PayloadAction<{ tlid: string, id: string }>) => {
        //     let index = state[action.payload.tlid].findIndex(t => t.id === action.payload.id)
        //     state[action.payload.tlid].splice(index, 1)
        // },
        changeTaskStatusAC: (state, action: PayloadAction<{ tlid: string, id: string, status: number }>) => {
            let index = state[action.payload.tlid].findIndex(t => t.id === action.payload.id)
            state[action.payload.tlid][index].status = action.payload.status
        },
        changeTaskTitleAC: (state, action: PayloadAction<{ tlid: string, id: string, title: string }>) => {
            let index = state[action.payload.tlid].findIndex(t => t.id === action.payload.id)
            state[action.payload.tlid][index].title = action.payload.title
        },
        // setTasksAC: (state, action: PayloadAction<{ id: string, tasks: Array<ItemType> }>) => {
        //     state[action.payload.id] = action.payload.tasks.map(t => ({ ...t, entityStatus: "idle" }))
        // },
        changeTaskEntityStatus: (state, action: PayloadAction<{ tlid: string, id: string, status: RequestStatusType }>) => {
            let index = state[action.payload.tlid].findIndex(t => t.id === action.payload.id)
            state[action.payload.tlid][index].entityStatus = action.payload.status
        },
    },
    extraReducers: (builder) => {
        builder.addCase(addTodoListAC, (state, action) => {
            state[action.payload.data.id] = []
        });
        builder.addCase(removeTodoListAC, (state, action) => {
            delete state[action.payload.id]
        });
        builder.addCase(setTodoListsAC, (state, action) => {
            action.payload.todoLists.forEach(tl => {
                state[tl.id] = []
            })
        });
        builder.addCase(getTasks.fulfilled, (state, action) => {
            if (action.payload) {
                state[action.payload.tlid] = action.payload.tasks.map(t => ({ ...t, entityStatus: "idle" }))
            }
        });
        builder.addCase(deleteTask.fulfilled, (state, action) => {
            if (action.payload) {
                let index = state[action.payload.tlid].findIndex(t => t.id === action.payload?.taskid)
                state[action.payload.tlid].splice(index, 1)
            }
        });
        builder.addCase(createTask.fulfilled, (state, action) => {
            if (action.payload) {
                state[action.payload.task.todoListId].unshift({ ...action.payload.task, entityStatus: "idle" })
            }
        });
    }
})

export const tasksReducer = slice.reducer;
export const { changeTaskEntityStatus, changeTaskStatusAC, changeTaskTitleAC } = slice.actions

export const setTaskStatus = (tlid: string, taskid: string, status: number) => (dispatch: Dispatch, getState: () => AppRootStateType) => {
    let task = getState().tasks[tlid].find(t => t.id === taskid)
    if (task) {
        dispatch(setAppStatusAC({ status: "loading" }))
        dispatch(changeTaskEntityStatus({ tlid, id: taskid, status: "loading" }))
        todoAPI.updateTask(tlid, taskid, { ...task, status })
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(changeTaskEntityStatus({ tlid, id: taskid, status: "succeeded" }))
                    dispatch(setAppStatusAC({ status: "succeeded" }))
                    dispatch(changeTaskStatusAC({ tlid, id: taskid, status }))
                } else {
                    dispatch(changeTaskEntityStatus({ tlid, id: taskid, status: "failed" }))
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch(err => {
                dispatch(changeTaskEntityStatus({ tlid, id: taskid, status: "failed" }))
                handleServerNetworkError(err, dispatch)
            })
    }
}
export const setTaskTitle = (tlid: string, taskid: string, title: string) => (dispatch: Dispatch, getState: () => AppRootStateType) => {
    let task = getState().tasks[tlid].find(t => t.id === taskid)
    if (task) {
        dispatch(setAppStatusAC({ status: "loading" }))
        dispatch(changeTaskEntityStatus({ tlid, id: taskid, status: "loading" }))
        todoAPI.updateTask(tlid, taskid, { ...task, title })
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(setAppStatusAC({ status: "succeeded" }))
                    dispatch(changeTaskEntityStatus({ tlid, id: taskid, status: "succeeded" }))
                    dispatch(changeTaskTitleAC({ tlid, id: taskid, title }))
                } else {
                    dispatch(changeTaskEntityStatus({ tlid, id: taskid, status: "failed" }))
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch(err => {
                dispatch(changeTaskEntityStatus({ tlid, id: taskid, status: "failed" }))
                handleServerNetworkError(err, dispatch)
            })
    }
}