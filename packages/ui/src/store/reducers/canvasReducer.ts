// action - state management
import { REMOVE_EDGE, SET_DIRTY, REMOVE_DIRTY, SET_WORKFLOW } from '../actions'
import { NetWorkName } from '../constant'

export const initialState = {
    removeEdgeId: '',
    isDirty: false,
    workflow: null
}

export type ExecutionData = {
    nodeLabel: string
    data: { html: string; attachments?: { filename: string; contentType: string; content: string; size?: number }[] }[]
}

export type State = 'INPROGRESS' | 'FINISHED' | 'ERROR' | 'TERMINATED' | 'TIMEOUT'

export type Execution = {
    createdDate: Date
    shortId: string
    state: State
    executionData: ExecutionData[]
}

export type ExecutionArr = Execution[]

export type WorkFlow = {
    flowData: Record<string, unknown>
    name: string
    shortId?: string
    deployed?: boolean
    executionCount?: number
    execution: Execution[]
    address?: string
    network?: NetWorkName
}

// ==============================|| CANVAS REDUCER ||============================== //

export const canvasReducer = (
    state = initialState,
    action:
        | { type: typeof REMOVE_EDGE; edgeId: string }
        | { type: typeof SET_DIRTY }
        | { type: typeof REMOVE_DIRTY }
        | {
              type: typeof SET_WORKFLOW
              workflow: WorkFlow
          }
) => {
    switch (action.type) {
        case REMOVE_EDGE:
            return {
                ...state,
                removeEdgeId: action.edgeId
            }
        case SET_DIRTY:
            return {
                ...state,
                isDirty: true
            }
        case REMOVE_DIRTY:
            return {
                ...state,
                isDirty: false
            }
        case SET_WORKFLOW:
            return {
                ...state,
                workflow: action.workflow
            }
        default:
            return state
    }
}
