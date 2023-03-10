import { getBezierPath } from 'reactflow'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { REMOVE_EDGE } from 'store/actions'

import './index.css'

const foreignObjectSize = 40

const ButtonEdge = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, markerEnd }) => {
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition
    })

    const dispatch = useDispatch()

    const onEdgeClick = (evt, id) => {
        evt.stopPropagation()
        dispatch({ type: REMOVE_EDGE, edgeId: id })
    }

    return (
        <>
            <path id={id} style={style} className='react-flow__edge-path' d={edgePath} markerEnd={markerEnd} />
            <foreignObject
                width={foreignObjectSize}
                height={foreignObjectSize}
                x={labelX - foreignObjectSize / 2}
                y={labelY - foreignObjectSize / 2}
                className='edgebutton-foreignobject'
                requiredExtensions='http://www.w3.org/1999/xhtml'
            >
                <div>
                    <button className='edgebutton' onClick={(event) => onEdgeClick(event, id)}>
                        ×
                    </button>
                </div>
            </foreignObject>
        </>
    )
}

ButtonEdge.propTypes = {
    id: PropTypes.string,
    sourceX: PropTypes.number,
    sourceY: PropTypes.number,
    targetX: PropTypes.number,
    targetY: PropTypes.number,
    sourcePosition: PropTypes.any,
    targetPosition: PropTypes.any,
    style: PropTypes.object,
    data: PropTypes.object,
    markerEnd: PropTypes.any
}

export default ButtonEdge
