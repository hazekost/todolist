export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as string | null,
    isInitialized: false
}

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET_STATUS':
            return { ...state, status: action.status }
        case 'APP/SET_ERROR':
            return { ...state, error: action.error }
        case 'APP/SET_INITIALIZE':
            return { ...state, isInitialized: action.value }
        default:
            return state
    }
}

type InitialStateType = typeof initialState
export type AppActionsType = ReturnType<typeof setAppStatusAC> | ReturnType<typeof setAppErrorAC> | ReturnType<typeof setAppInitializeAC>

export const setAppStatusAC = (status: RequestStatusType) => ({ type: "APP/SET_STATUS" as const, status })
export const setAppErrorAC = (error: string | null) => ({ type: "APP/SET_ERROR" as const, error })
export const setAppInitializeAC = (value: boolean) => ({ type: "APP/SET_INITIALIZE" as const, value })