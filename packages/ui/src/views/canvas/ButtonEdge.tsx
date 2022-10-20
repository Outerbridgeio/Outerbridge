import { getBezierPath, getEdgeCenter, EdgeText, Position } from 'react-flow-renderer'
import { useDispatch, actions } from 'store'
import { ComponentProps } from 'react'
import './index.css'

const { REMOVE_EDGE } = actions

const foreignObjectSize = 40

export const ButtonEdge = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    data,
    markerEnd
}: {
    id: string
    sourceX: number
    sourceY: number
    targetX: number
    targetY: number
    sourcePosition: Position
    targetPosition: Position
    data?: { label?: string }
    markerEnd: string
    style: ComponentProps<'path'>['style']
}) => {
    const edgePath = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition
    })

    const [edgeCenterX, edgeCenterY] = getEdgeCenter({
        sourceX,
        sourceY,
        targetX,
        targetY
    })

    const dispatch = useDispatch()

    const onEdgeClick = (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
        evt.stopPropagation()
        dispatch({ type: REMOVE_EDGE, edgeId: id })
    }

    return (
        <>
            <path id={id} style={style} className='react-flow__edge-path' d={edgePath} markerEnd={markerEnd} />
            {data && data.label && (
                <EdgeText
                    x={sourceX + 10}
                    y={sourceY + 10}
                    label={data.label}
                    labelStyle={{ fill: 'black' }}
                    labelBgStyle={{ fill: 'transparent' }}
                    labelBgPadding={[2, 4]}
                    labelBgBorderRadius={2}
                />
            )}
            <foreignObject
                width={foreignObjectSize}
                height={foreignObjectSize}
                x={edgeCenterX - foreignObjectSize / 2}
                y={edgeCenterY - foreignObjectSize / 2}
                className='edgebutton-foreignobject'
                requiredExtensions='http://www.w3.org/1999/xhtml'
            >
                <div>
                    <button type='button' className='edgebutton' onClick={(event) => onEdgeClick(event, id)}>
                        ×
                    </button>
                </div>
            </foreignObject>
        </>
    )
}
