import { useState, useEffect, ComponentProps } from 'react'
import { NodeType } from 'outerbridge-components'
import { useTheme } from 'themes'

// material-ui
import { Box, Button, Chip, CircularProgress, Stack, Typography, IconButton } from '@mui/material'

// third party
import ReactJson from 'react-json-view'
import socketIOClient from 'socket.io-client'

// project imports
import { AnimateButton, AttachmentDialog, HTMLDialog, ExpandDataDialog } from 'ui-component'

// API
import { nodesApi } from 'api'

// Hooks
import { useApi } from 'hooks'

// icons
import { IconExclamationMark, IconCopy, IconArrowUpRightCircle, IconX, IconArrowsMaximize } from '@tabler/icons'

// const
import { constant, reducer } from 'store'

const { baseURL } = constant

// utils
import { copyToClipboard, Nodes, Edges, NodeData, ParamsType } from 'utils'

// ==============================|| OUTPUT RESPONSES ||============================== //

export const OutputResponses = ({
    nodeId,
    nodeParamsType,
    nodeFlowData,
    nodes,
    edges,
    workflow,
    onSubmit
}: {
    nodeId: string
    nodeParamsType: ParamsType[]
    nodeFlowData: NodeData
    nodes: Nodes
    edges: Edges
    workflow: reducer.canvas.WorkFlow
    onSubmit: (value: { submit: boolean | null; needRetest: null; output: any }, paramType: ParamsType) => void
}) => {
    const theme = useTheme()

    const [outputResponse, setOutputResponse] = useState<reducer.canvas.ExecutionData['data']>([])
    const [errorResponse, setErrorResponse] = useState<any>(null)
    const [nodeName, setNodeName] = useState<string | null>(null)
    const [nodeType, setNodeType] = useState<NodeType | null>(null)
    const [nodeLabel, setNodeLabel] = useState<string | null>(null)
    const [isTestNodeBtnDisabled, disableTestNodeBtn] = useState(true)
    const [testNodeLoading, setTestNodeLoading] = useState<boolean | null>(null)
    const [showHTMLDialog, setShowHTMLDialog] = useState(false)
    const [HTMLDialogProps, setHTMLDialogProps] = useState({})
    const [showAttachmentDialog, setShowAttachmentDialog] = useState(false)
    const [attachmentDialogProps, setAttachmentDialogProps] = useState({})
    const [showExpandDialog, setShowExpandDialog] = useState(false)
    // ! logic changed
    const [expandDialogProps, setExpandDialogProps] = useState<ComponentProps<typeof ExpandDataDialog>['dialogProps']>({
        title: '',
        data: {}
    })

    const testNodeApi = useApi(nodesApi.testNode)

    const onTestNodeClick = (nodeType: NodeType | null) => {
        /* If workflow is already deployed, stop it first to be safe.
         *  Because it could cause throttled calls
         */
        if (workflow.deployed) {
            setTestNodeLoading(false)
            alert('Testing trigger requires stopping workflow. Please stop workflow first')
            return
        }

        const testNodeBody: {
            nodes: Nodes
            edges: Edges
            nodeId: string
            clientId?: string
        } = {
            nodes,
            edges,
            nodeId
        }

        try {
            setTestNodeLoading(true)

            if (nodeType === 'webhook') {
                const socket = socketIOClient(baseURL)

                socket.on('connect', async () => {
                    testNodeBody.clientId = socket.id
                    testNodeApi.request(nodeFlowData.name, testNodeBody)
                })

                socket.on('testWebhookNodeResponse', (data) => {
                    setOutputResponse(data)
                    setTestNodeLoading(false)
                    const formValues = {
                        submit: true,
                        needRetest: null,
                        output: data
                    }
                    onSubmit(formValues, 'outputResponses')
                    socket.disconnect()
                })
            } else {
                testNodeApi.request(nodeFlowData.name, testNodeBody)
            }
        } catch (error) {
            setTestNodeLoading(false)
            setOutputResponse([])
            setErrorResponse(error)
            console.error(error)
        }
    }

    const checkIfTestNodeValid = () => {
        const paramsTypes = nodeParamsType.filter((type) => type !== 'outputResponses')
        for (let i = 0; i < paramsTypes.length; i += 1) {
            const paramType = paramsTypes[i]!

            if (!nodeFlowData[paramType] || !nodeFlowData[paramType]?.submit) {
                return true
            }
        }
        return false
    }

    const openAttachmentDialog = (outputResponse: reducer.canvas.ExecutionData['data']) => {
        const dialogProp = {
            title: 'Attachments',
            executionData: outputResponse
        }
        setAttachmentDialogProps(dialogProp)
        setShowAttachmentDialog(true)
    }

    const openHTMLDialog = (executionData: reducer.canvas.ExecutionData['data']) => {
        const dialogProp = {
            title: 'HTML',
            executionData
        }
        setHTMLDialogProps(dialogProp)
        setShowHTMLDialog(true)
    }

    const onExpandDialogClicked = (executionData: reducer.canvas.ExecutionData['data']) => {
        const dialogProp = {
            title: `Output Responses: ${nodeLabel} `,
            data: executionData
        }
        setExpandDialogProps(dialogProp)
        setShowExpandDialog(true)
    }

    useEffect(() => {
        if (nodeFlowData && nodeFlowData.outputResponses && nodeFlowData.outputResponses.output) {
            setOutputResponse(nodeFlowData.outputResponses.output)
        } else {
            setOutputResponse([])
        }

        disableTestNodeBtn(checkIfTestNodeValid())

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nodeFlowData, nodeParamsType])

    useEffect(() => {
        if (nodes && nodeId) {
            const selectedNode = nodes.find((nd) => nd.id === nodeId)
            if (selectedNode) {
                setNodeName(selectedNode.data.name)
                setNodeType(selectedNode.data.type)
                setNodeLabel(selectedNode.data.label)
            }
        }
    }, [nodes, nodeId])

    // Test node successful
    useEffect(() => {
        // ! logic changed
        if (testNodeApi.data && nodeType !== 'webhook') {
            const testNodeData = testNodeApi.data
            setOutputResponse(testNodeData)
            setErrorResponse(null)
            const formValues = {
                submit: true,
                needRetest: null,
                output: testNodeData
            }
            onSubmit(formValues, 'outputResponses')
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [testNodeApi.data])

    // Test node error
    useEffect(() => {
        // ! logic changed
        if (testNodeApi.error && nodeType !== 'webhook') {
            setErrorResponse(testNodeApi.error.response?.data || testNodeApi.error.message || 'Unexpected Error.')
            setOutputResponse([])
            const formValues = {
                submit: null,
                needRetest: null,
                output: []
            }
            onSubmit(formValues, 'outputResponses')
        }
    }, [testNodeApi.error, nodeType, onSubmit])

    // Test node loading
    useEffect(() => {
        if (nodeType && nodeType !== 'webhook') setTestNodeLoading(testNodeApi.loading)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [testNodeApi.loading])

    return (
        <>
            <Box sx={{ width: 400 }}>
                <>
                    {nodeFlowData && nodeFlowData.outputResponses && nodeFlowData.outputResponses.needRetest && (
                        <Chip
                            sx={{ mb: 2 }}
                            icon={<IconExclamationMark />}
                            label='Retest the node for updated parameters'
                            color='warning'
                        />
                    )}
                    {nodeName && nodeName === 'webhook' && (
                        <Box sx={{ mb: 3 }}>
                            <Typography
                                variant='h5'
                                sx={{ mb: 1 }}
                            >{`${baseURL}/api/v1/webhook/${nodeFlowData.webhookEndpoint}`}</Typography>
                            <Stack direction='row' spacing={2}>
                                <Button
                                    size='small'
                                    variant='outlined'
                                    startIcon={<IconCopy />}
                                    onClick={() =>
                                        navigator.clipboard.writeText(`${baseURL}/api/v1/webhook/${nodeFlowData.webhookEndpoint}`)
                                    }
                                >
                                    Copy URL
                                </Button>
                                <Button
                                    size='small'
                                    variant='outlined'
                                    startIcon={<IconArrowUpRightCircle />}
                                    onClick={() => window.open(`${baseURL}/api/v1/webhook/${nodeFlowData.webhookEndpoint}`, '_blank')}
                                >
                                    Open in New Tab
                                </Button>
                            </Stack>
                        </Box>
                    )}
                    {errorResponse && (
                        <Box sx={{ mb: 2 }}>
                            <Chip sx={{ mb: 2 }} icon={<IconX />} label='Error' color='error' />
                            <div style={{ color: 'red' }}>{errorResponse}</div>
                        </Box>
                    )}
                    <Box sx={{ position: 'relative' }}>
                        <ReactJson collapsed src={outputResponse} enableClipboard={(e) => copyToClipboard(e)} />
                        <IconButton
                            size='small'
                            sx={{
                                height: 25,
                                width: 25,
                                position: 'absolute',
                                top: -5,
                                right: 5
                            }}
                            title='Expand Data'
                            color='primary'
                            onClick={() => onExpandDialogClicked(outputResponse)}
                        >
                            <IconArrowsMaximize />
                        </IconButton>
                        <div>
                            {outputResponse.map((respObj, respObjIndex) => (
                                <div key={respObjIndex}>
                                    {respObj.html && (
                                        <Typography sx={{ p: 1, mt: 2 }} variant='h5'>
                                            HTML
                                        </Typography>
                                    )}
                                    {respObj.html && (
                                        <div
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                maxHeight: 400,
                                                overflow: 'auto',
                                                backgroundColor: 'white',
                                                borderRadius: 5
                                            }}
                                            dangerouslySetInnerHTML={{ __html: respObj.html }}
                                        />
                                    )}
                                    {respObj.html && (
                                        <Button
                                            sx={{ mt: 1 }}
                                            size='small'
                                            variant='contained'
                                            onClick={() => openHTMLDialog(outputResponse)}
                                        >
                                            View HTML
                                        </Button>
                                    )}

                                    {respObj.attachments && (
                                        <Typography sx={{ p: 1, mt: 2, pb: 0 }} variant='h5'>
                                            Attachments
                                        </Typography>
                                    )}
                                    {respObj.attachments &&
                                        respObj.attachments.map((attachment, attchIndex) => (
                                            <div key={attchIndex}>
                                                <Typography sx={{ p: 1 }} variant='h6'>
                                                    Item {respObjIndex} |{' '}
                                                    {attachment.filename ? attachment.filename : `Attachment ${attchIndex}`}
                                                </Typography>
                                                <embed
                                                    src={attachment.content}
                                                    width='100%'
                                                    height='100%'
                                                    style={{ borderStyle: 'solid' }}
                                                    type={attachment.contentType}
                                                />
                                                <Button
                                                    size='small'
                                                    variant='contained'
                                                    onClick={() => openAttachmentDialog(outputResponse)}
                                                >
                                                    View Attachment
                                                </Button>
                                            </div>
                                        ))}
                                </div>
                            ))}
                        </div>
                    </Box>
                    <Box sx={{ mt: 2, position: 'relative' }}>
                        <AnimateButton>
                            <Button
                                disableElevation
                                disabled={isTestNodeBtnDisabled || !!testNodeLoading}
                                fullWidth
                                size='large'
                                type='submit'
                                variant='contained'
                                color='secondary'
                                onClick={() => onTestNodeClick(nodeType)}
                            >
                                Test Node
                            </Button>
                        </AnimateButton>
                        {testNodeLoading && (
                            <CircularProgress
                                size={24}
                                sx={{
                                    color: theme.palette.secondary.main,
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    marginTop: '-12px',
                                    marginLeft: '-12px'
                                }}
                            />
                        )}
                    </Box>
                </>
            </Box>
            <AttachmentDialog
                show={showAttachmentDialog}
                dialogProps={attachmentDialogProps}
                onCancel={() => setShowAttachmentDialog(false)}
            ></AttachmentDialog>
            <HTMLDialog show={showHTMLDialog} dialogProps={HTMLDialogProps} onCancel={() => setShowHTMLDialog(false)}></HTMLDialog>
            <ExpandDataDialog
                show={showExpandDialog}
                dialogProps={expandDialogProps}
                onCancel={() => setShowExpandDialog(false)}
            ></ExpandDataDialog>
        </>
    )
}
