// action - state management
import { REMOVE_EDGE, SET_DIRTY, REMOVE_DIRTY, SET_WORKFLOW } from '../actions'

export const initialState = {
    removeEdgeId: '',
    isDirty: false,
    workflow: null
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
              workflow: {
                  flowData: Record<string, unknown>
                  name: string
                  shortId?: string
                  deployed?: boolean
                  executionCount?: number
                  execution: {
                      shortId: string
                      state: 'INPROGRESS' | 'FINISHED' | 'ERROR' | 'TERMINATED' | 'TIMEOUT'
                      executionData: {
                          nodeLabel: string
                          data: { html: string; attachments: { filename: string; contentType: string; content: string }[] }[]
                      }
                  }[]
              }
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
