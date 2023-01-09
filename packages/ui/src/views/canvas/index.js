import { useEffect, useRef, useState, useCallback } from 'react'
import ReactFlow, { ReactFlowProvider, addEdge, MiniMap, Controls, Background, useNodesState, useEdgesState } from 'react-flow-renderer'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { usePrompt } from '../../utils/usePrompt'
import {
    REMOVE_DIRTY,
    SET_DIRTY,
    SET_WORKFLOW,
    enqueueSnackbar as enqueueSnackbarAction,
    closeSnackbar as closeSnackbarAction
} from 'store/actions'

// material-ui
import { Toolbar, Box, AppBar, Button, Fab, CircularProgress } from '@mui/material'
import { useTheme } from '@mui/material/styles'

// project imports
import CanvasNode from './CanvasNode'
import ButtonEdge from './ButtonEdge'
import CanvasHeader from './CanvasHeader'
import AddNodes from './AddNodes'
import EditNodes from './EditNodes'
import ConfirmDialog from 'ui-component/dialog/ConfirmDialog'
import TestWorkflowDialog from 'ui-component/dialog/TestWorkflowDialog'

// API
import nodesApi from 'api/nodes'
import workflowsApi from 'api/workflows'
import webhooksApi from 'api/webhooks'

// Hooks
import useApi from 'hooks/useApi'
import useConfirm from 'hooks/useConfirm'

// icons
import { IconX, IconBolt } from '@tabler/icons'

// third party
import socketIOClient from 'socket.io-client'

// utils
import {
    generateWebhookEndpoint,
    getUniqueNodeId,
    checkIfNodeLabelUnique,
    addAnchors,
    getEdgeLabelName,
    checkMultipleTriggers
} from 'utils/genericHelper'
import useNotifier from 'utils/useNotifier'

// const
import { baseURL } from 'store/constant'

const nodeTypes = { customNode: CanvasNode }
const edgeTypes = { buttonedge: ButtonEdge }

// ==============================|| CANVAS ||============================== //

const Canvas = () => {
    const theme = useTheme()
    const navigate = useNavigate()

    const URLpath = document.location.pathname.toString().split('/')
    const workflowShortId = URLpath[URLpath.length - 1] && URLpath[URLpath.length - 1].startsWith('W') ? URLpath[URLpath.length - 1] : ''

    const { confirm } = useConfirm()

    const dispatch = useDispatch()
    const canvas = useSelector((state) => state.canvas)
    const [canvasDataStore, setCanvasDataStore] = useState(canvas)
    const [workflow, setWorkflow] = useState(null)
    const [isTestWorkflowDialogOpen, setTestWorkflowDialogOpen] = useState(false)
    const [testWorkflowDialogProps, setTestWorkflowDialogProps] = useState({})
    const [isTestingWorkflow, setIsTestingWorkflow] = useState(false)

    // ==============================|| Snackbar ||============================== //

    useNotifier()
    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args))
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args))

    // ==============================|| ReactFlow ||============================== //

    const [nodes, setNodes, onNodesChange] = useNodesState()
    const [edges, setEdges, onEdgesChange] = useEdgesState()

    const [rfInstance, setRfInstance] = useState(null)
    const [selectedNode, setSelectedNode] = useState(null)

    const reactFlowWrapper = useRef(null)

    // ==============================|| Workflow API ||============================== //

    const getNodesApi = useApi(nodesApi.getAllNodes)
    const removeTestTriggersApi = useApi(nodesApi.removeTestTriggers)
    const deleteAllTestWebhooksApi = useApi(webhooksApi.deleteAllTestWebhooks)
    const createNewWorkflowApi = useApi(workflowsApi.createNewWorkflow)
    const testWorkflowApi = useApi(workflowsApi.testWorkflow)
    const updateWorkflowApi = useApi(workflowsApi.updateWorkflow)
    const getSpecificWorkflowApi = useApi(workflowsApi.getSpecificWorkflow)

    // ==============================|| Events & Actions ||============================== //

    const onConnect = (params) => {
        const newEdge = {
            ...params,
            type: 'buttonedge',
            id: `${params.source}-${params.sourceHandle}-${params.target}-${params.targetHandle}`,
            data: { label: getEdgeLabelName(params.sourceHandle) }
        }
        setEdges((eds) => addEdge(newEdge, eds))
        setDirty()
    }

    const handleTestWorkflow = () => {
        try {
            if (workflow.deployed) {
                alert('Testing workflow requires stopping deployed workflow. Please stop deployed workflow first')
                return
            }
            const rfInstanceObject = rfInstance.toObject()
            const nodes = rfInstanceObject.nodes || []
            setTestWorkflowDialogOpen(true)
            setTestWorkflowDialogProps({
                title: 'Test Workflow',
                nodes: nodes.filter((nd) => !nd.id.includes('ifElse'))
            })
        } catch (e) {
            console.error(e)
        }
    }

    const onStartingPointClick = (startingNodeId) => {
        try {
            const socket = socketIOClient(baseURL)
            const rfInstanceObject = rfInstance.toObject()
            const nodes = rfInstanceObject.nodes || []
            const edges = rfInstanceObject.edges || []
            setTestWorkflowDialogOpen(false)

            socket.on('connect', () => {
                const clientId = socket.id
                const node = nodes.find((nd) => nd.id === startingNodeId)
                const nodeData = node.data
                const body = {
                    nodes,
                    edges,
                    clientId,
                    nodeData
                }
                testWorkflowApi.request(startingNodeId, body)
                setNodes((nds) =>
                    nds.map((node) => {
                        node.data = {
                            ...node.data,
                            outputResponses: {
                                ...node.data.outputResponses,
                                submit: null,
                                needRetest: null
                            },
                            selected: false
                        }
                        return node
                    })
                )
                setIsTestingWorkflow(true)
            })

            socket.on('testWorkflowNodeResponse', (value) => {
                const { nodeId, data, status } = value

                const node = nodes.find((nd) => nd.id === nodeId)
                if (node) {
                    const outputValues = {
                        submit: status === 'FINISHED' ? true : null,
                        needRetest: status === 'FINISHED' ? null : true,
                        output: data
                    }
                    const nodeData = node.data
                    nodeData['outputResponses'] = outputValues
                    setNodes((nds) =>
                        nds.map((node) => {
                            if (node.id === nodeId) {
                                node.data = {
                                    ...nodeData,
                                    selected: false
                                }
                            }
                            return node
                        })
                    )
                }
            })

            socket.on('testWorkflowNodeFinish', () => {
                setIsTestingWorkflow(false)
                socket.disconnect()
            })
        } catch (e) {
            console.error(e)
        }
    }

    const handleLoadWorkflow = (file) => {
        try {
            const flowData = JSON.parse(file)
            const nodes = flowData.nodes || []

            for (let i = 0; i < nodes.length; i += 1) {
                const nodeData = nodes[i].data
                if (nodeData.type === 'webhook') nodeData.webhookEndpoint = generateWebhookEndpoint()
            }

            setNodes(nodes)
            setEdges(flowData.edges || [])
            setDirty()
        } catch (e) {
            console.error(e)
        }
    }

    const handleDeployWorkflow = async () => {
        if (rfInstance) {
            const rfInstanceObject = rfInstance.toObject()
            const flowData = JSON.stringify(rfInstanceObject)

            try {
                // Always save workflow first
                let savedWorkflowResponse
                if (!workflow.shortId) {
                    const newWorkflowBody = {
                        name: workflow.name,
                        deployed: false,
                        flowData
                    }
                    const response = await workflowsApi.createNewWorkflow(newWorkflowBody)
                    savedWorkflowResponse = response.data
                } else {
                    const updateBody = {
                        flowData
                    }
                    const response = await workflowsApi.updateWorkflow(workflow.shortId, updateBody)
                    savedWorkflowResponse = response.data
                }

                dispatch({ type: REMOVE_DIRTY })

                // Then deploy
                const response = await workflowsApi.deployWorkflow(savedWorkflowResponse.shortId)
                const deployedWorkflowResponse = response.data
                dispatch({ type: SET_WORKFLOW, workflow: deployedWorkflowResponse })

                enqueueSnackbar({
                    message: 'Workflow deployed!',
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'success',
                        action: (key) => (
                            <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                                <IconX />
                            </Button>
                        )
                    }
                })
            } catch (error) {
                const errorData = error.response.data || `${error.response.status}: ${error.response.statusText}`
                enqueueSnackbar({
                    message: errorData,
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'error',
                        persist: true,
                        action: (key) => (
                            <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                                <IconX />
                            </Button>
                        )
                    }
                })
            }
        }
    }

    const handleStopWorkflow = async () => {
        try {
            const response = await workflowsApi.deployWorkflow(workflow.shortId, { halt: true })
            const stoppedWorkflowResponse = response.data
            dispatch({ type: SET_WORKFLOW, workflow: stoppedWorkflowResponse })

            enqueueSnackbar({
                message: 'Workflow stopped',
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'success',
                    action: (key) => (
                        <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                            <IconX />
                        </Button>
                    )
                }
            })
        } catch (error) {
            const errorData = error.response.data || `${error.response.status}: ${error.response.statusText}`
            enqueueSnackbar({
                message: errorData,
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'error',
                    persist: true,
                    action: (key) => (
                        <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                            <IconX />
                        </Button>
                    )
                }
            })
        }
    }

    const handleDeleteWorkflow = async () => {
        const confirmPayload = {
            title: `Delete`,
            description: `Delete workflow ${workflow.name}?`,
            confirmButtonName: 'Delete',
            cancelButtonName: 'Cancel'
        }
        const isConfirmed = await confirm(confirmPayload)

        if (isConfirmed) {
            try {
                await workflowsApi.deleteWorkflow(workflow.shortId)
                navigate(-1)
            } catch (error) {
                const errorData = error.response.data || `${error.response.status}: ${error.response.statusText}`
                enqueueSnackbar({
                    message: errorData,
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'error',
                        persist: true,
                        action: (key) => (
                            <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                                <IconX />
                            </Button>
                        )
                    }
                })
            }
        }
    }

    const handleSaveFlow = (workflowName) => {
        if (rfInstance) {
            setNodes((nds) =>
                nds.map((node) => {
                    node.data = {
                        ...node.data,
                        selected: false
                    }
                    return node
                })
            )

            const rfInstanceObject = rfInstance.toObject()
            const flowData = JSON.stringify(rfInstanceObject)

            if (!workflow.shortId) {
                const newWorkflowBody = {
                    name: workflowName,
                    deployed: false,
                    flowData
                }
                createNewWorkflowApi.request(newWorkflowBody)
            } else {
                const updateBody = {
                    name: workflowName,
                    flowData
                }
                updateWorkflowApi.request(workflow.shortId, updateBody)
            }
        }
    }

    // eslint-disable-next-line
    const onNodeDoubleClick = useCallback((event, clickedNode) => {
        setSelectedNode(clickedNode)
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === clickedNode.id) {
                    node.data = {
                        ...node.data,
                        selected: true
                    }
                } else {
                    node.data = {
                        ...node.data,
                        selected: false
                    }
                }

                return node
            })
        )
    })

    // eslint-disable-next-line
    const onNodeLabelUpdate = useCallback((nodeLabel) => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === selectedNode.id) {
                    if (!checkIfNodeLabelUnique(nodeLabel, rfInstance.getNodes())) {
                        enqueueSnackbar({
                            message: 'Duplicated node label',
                            options: {
                                key: new Date().getTime() + Math.random(),
                                variant: 'error',
                                persist: true,
                                action: (key) => (
                                    <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                                        <IconX />
                                    </Button>
                                )
                            }
                        })
                    } else {
                        if (node.data.label !== nodeLabel) {
                            setTimeout(() => setDirty(), 0)
                        }
                        node.data = {
                            ...node.data,
                            label: nodeLabel
                        }
                    }
                }
                return node
            })
        )
    })

    // eslint-disable-next-line
    const onNodeValuesUpdate = useCallback((nodeFlowData) => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === selectedNode.id) {
                    setTimeout(() => setDirty(), 0)
                    node.data = {
                        ...node.data,
                        ...nodeFlowData,
                        selected: true
                    }
                }
                return node
            })
        )
    })

    const onDragOver = useCallback((event) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = 'move'
    }, [])

    const onDrop = useCallback(
        (event) => {
            event.preventDefault()
            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
            let nodeData = event.dataTransfer.getData('application/reactflow')

            // check if the dropped element is valid
            if (typeof nodeData === 'undefined' || !nodeData) {
                return
            }

            nodeData = JSON.parse(nodeData)

            // check if workflow contains multiple triggers/webhooks
            if ((nodeData.type === 'webhook' || nodeData.type === 'trigger') && checkMultipleTriggers(rfInstance.getNodes())) {
                enqueueSnackbar({
                    message: 'Workflow can only contains 1 trigger or webhook node',
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'error',
                        persist: true,
                        action: (key) => (
                            <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                                <IconX />
                            </Button>
                        )
                    }
                })
                return
            }

            if (nodeData.type === 'webhook') nodeData.webhookEndpoint = generateWebhookEndpoint()

            const position = rfInstance.project({
                x: event.clientX - reactFlowBounds.left - 100,
                y: event.clientY - reactFlowBounds.top - 50
            })

            const newNodeId = getUniqueNodeId(nodeData, rfInstance.getNodes())

            const newNode = {
                id: newNodeId,
                position,
                type: 'customNode',
                data: addAnchors(nodeData, rfInstance.getNodes(), newNodeId)
            }

            setSelectedNode(newNode)
            setNodes((nds) =>
                nds.concat(newNode).map((node) => {
                    if (node.id === newNode.id) {
                        node.data = {
                            ...node.data,
                            selected: true
                        }
                    } else {
                        node.data = {
                            ...node.data,
                            selected: false
                        }
                    }

                    return node
                })
            )
            setTimeout(() => setDirty(), 0)
        },

        // eslint-disable-next-line
        [rfInstance]
    )

    const saveWorkflowSuccess = () => {
        dispatch({ type: REMOVE_DIRTY })
        enqueueSnackbar({
            message: 'Workflow saved',
            options: {
                key: new Date().getTime() + Math.random(),
                variant: 'success',
                action: (key) => (
                    <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                        <IconX />
                    </Button>
                )
            }
        })
    }

    const errorFailed = (message) => {
        enqueueSnackbar({
            message,
            options: {
                key: new Date().getTime() + Math.random(),
                variant: 'error',
                persist: true,
                action: (key) => (
                    <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                        <IconX />
                    </Button>
                )
            }
        })
    }

    const setDirty = () => {
        dispatch({ type: SET_DIRTY })
    }

    // ==============================|| useEffect ||============================== //

    // Get specific workflow successful
    useEffect(() => {
        if (getSpecificWorkflowApi.data) {
            const workflow = getSpecificWorkflowApi.data
            const initialFlow = workflow.flowData ? JSON.parse(workflow.flowData) : []
            setNodes(initialFlow.nodes || [])
            setEdges(initialFlow.edges || [])
            dispatch({ type: SET_WORKFLOW, workflow })
        } else if (getSpecificWorkflowApi.error) {
            const error = getSpecificWorkflowApi.error
            const errorData = error.response.data || `${error.response.status}: ${error.response.statusText}`
            errorFailed(`Failed to retrieve workflow: ${errorData}`)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getSpecificWorkflowApi.data, getSpecificWorkflowApi.error])

    // Create new workflow successful
    useEffect(() => {
        if (createNewWorkflowApi.data) {
            const workflow = createNewWorkflowApi.data
            dispatch({ type: SET_WORKFLOW, workflow })
            saveWorkflowSuccess()
            window.history.replaceState(null, null, `/canvas/${workflow.shortId}`)
        } else if (createNewWorkflowApi.error) {
            const error = createNewWorkflowApi.error
            const errorData = error.response.data || `${error.response.status}: ${error.response.statusText}`
            errorFailed(`Failed to save workflow: ${errorData}`)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createNewWorkflowApi.data, createNewWorkflowApi.error])

    // Update workflow successful
    useEffect(() => {
        if (updateWorkflowApi.data) {
            dispatch({ type: SET_WORKFLOW, workflow: updateWorkflowApi.data })
            saveWorkflowSuccess()
        } else if (updateWorkflowApi.error) {
            const error = updateWorkflowApi.error
            const errorData = error.response.data || `${error.response.status}: ${error.response.statusText}`
            errorFailed(`Failed to save workflow: ${errorData}`)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateWorkflowApi.data, updateWorkflowApi.error])

    // Test workflow failed
    useEffect(() => {
        if (testWorkflowApi.error) {
            enqueueSnackbar({
                message: 'Test workflow failed',
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'error',
                    persist: true,
                    action: (key) => (
                        <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                            <IconX />
                        </Button>
                    )
                }
            })
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [testWorkflowApi.error])

    // Listen to edge button click remove redux event
    useEffect(() => {
        if (rfInstance) {
            const edges = rfInstance.getEdges()
            setEdges(edges.filter((edge) => edge.id !== canvasDataStore.removeEdgeId))
            setDirty()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canvasDataStore.removeEdgeId])

    useEffect(() => setWorkflow(canvasDataStore.workflow), [canvasDataStore.workflow])

    // Initialization
    useEffect(() => {
        removeTestTriggersApi.request()
        deleteAllTestWebhooksApi.request()

        if (workflowShortId) {
            getSpecificWorkflowApi.request(workflowShortId)
        } else {
            setNodes([])
            setEdges([])
            dispatch({
                type: SET_WORKFLOW,
                workflow: {
                    name: 'Untitled workflow'
                }
            })
        }

        getNodesApi.request()

        // Clear dirty state before leaving and remove any ongoing test triggers and webhooks
        return () => {
            removeTestTriggersApi.request()
            deleteAllTestWebhooksApi.request()

            setTimeout(() => dispatch({ type: REMOVE_DIRTY }), 0)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setCanvasDataStore(canvas)
    }, [canvas])

    useEffect(() => {
        function handlePaste(e) {
            const pasteData = e.clipboardData.getData('text')
            handleLoadWorkflow(pasteData)
        }

        window.addEventListener('paste', handlePaste)

        return () => {
            window.removeEventListener('paste', handlePaste)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    usePrompt('You have unsaved changes! Do you want to navigate away?', canvasDataStore.isDirty)

    return (
        <>
            <Box>
                <AppBar
                    enableColorOnDark
                    position='fixed'
                    color='inherit'
                    elevation={1}
                    sx={{
                        bgcolor: theme.palette.background.default
                    }}
                >
                    <Toolbar>
                        <CanvasHeader
                            workflow={workflow}
                            handleSaveFlow={handleSaveFlow}
                            handleDeployWorkflow={handleDeployWorkflow}
                            handleStopWorkflow={handleStopWorkflow}
                            handleDeleteWorkflow={handleDeleteWorkflow}
                            handleLoadWorkflow={handleLoadWorkflow}
                        />
                    </Toolbar>
                </AppBar>
                <Box sx={{ marginTop: '70px', height: '90vh', width: '100%' }}>
                    <div className='reactflow-parent-wrapper'>
                        <ReactFlowProvider>
                            <div className='reactflow-wrapper' ref={reactFlowWrapper}>
                                <ReactFlow
                                    nodes={nodes}
                                    edges={edges}
                                    onNodesChange={onNodesChange}
                                    onNodeDoubleClick={onNodeDoubleClick}
                                    onEdgesChange={onEdgesChange}
                                    onDrop={onDrop}
                                    onDragOver={onDragOver}
                                    onNodeDragStop={setDirty}
                                    nodeTypes={nodeTypes}
                                    edgeTypes={edgeTypes}
                                    onConnect={onConnect}
                                    onInit={setRfInstance}
                                    fitView
                                >
                                    <MiniMap
                                        nodeStrokeColor={() => theme.palette.primary.main}
                                        nodeColor={() => theme.palette.primary.main}
                                        nodeBorderRadius={2}
                                    />
                                    <Controls
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)'
                                        }}
                                    />
                                    <Background color='#aaa' gap={16} />
                                    <AddNodes nodesData={getNodesApi.data} node={selectedNode} />
                                    <EditNodes
                                        nodes={nodes}
                                        edges={edges}
                                        node={selectedNode}
                                        workflow={workflow}
                                        onNodeLabelUpdate={onNodeLabelUpdate}
                                        onNodeValuesUpdate={onNodeValuesUpdate}
                                    />
                                    <Fab
                                        sx={{ position: 'absolute', right: 20, top: 20 }}
                                        size='small'
                                        color='warning'
                                        aria-label='test'
                                        title='Test Workflow'
                                        disabled={isTestingWorkflow}
                                        onClick={handleTestWorkflow}
                                    >
                                        {<IconBolt />}
                                    </Fab>
                                    {isTestingWorkflow && (
                                        <CircularProgress
                                            size={50}
                                            sx={{
                                                color: theme.palette.warning.dark,
                                                position: 'absolute',
                                                right: 15,
                                                top: 15
                                            }}
                                        />
                                    )}
                                </ReactFlow>
                            </div>
                        </ReactFlowProvider>
                    </div>
                </Box>
                <ConfirmDialog />
                <TestWorkflowDialog
                    show={isTestWorkflowDialogOpen}
                    dialogProps={testWorkflowDialogProps}
                    onCancel={() => setTestWorkflowDialogOpen(false)}
                    onItemClick={onStartingPointClick}
                />
            </Box>
        </>
    )
}

export default Canvas
