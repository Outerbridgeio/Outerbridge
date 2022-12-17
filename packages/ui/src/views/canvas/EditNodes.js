import { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'

// material-ui
import { useTheme } from '@mui/material/styles'
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Box,
    Fab,
    ClickAwayListener,
    Divider,
    Paper,
    Stack,
    Popper,
    Typography,
    TextField,
    Avatar
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar'
import * as Yup from 'yup'
import lodash from 'lodash'

// project imports
import MainCard from 'ui-component/cards/MainCard'
import Transitions from 'ui-component/extended/Transitions'
import InputParameters from 'views/inputs/InputParameters'
import CredentialInput from 'views/inputs/CredentialInput'
import OutputResponses from 'views/output/OutputResponses'
import VariableSelector from './VariableSelector'
import EditVariableDialog from 'ui-component/dialog/EditVariableDialog'

// API
import nodesApi from 'api/nodes'

// Hooks
import useApi from 'hooks/useApi'

// icons
import { IconPencil, IconMinus, IconCheck } from '@tabler/icons'

// utils
import { getAvailableNodeIdsForVariable, numberOrExpressionRegex, handleCredentialParams } from 'utils/genericHelper'

// ==============================|| EDIT NODES||============================== //

const EditNodes = ({ node, nodes, edges, workflow, onNodeLabelUpdate, onNodeValuesUpdate }) => {
    const theme = useTheme()

    const [nodeFlowData, setNodeFlowData] = useState(null)
    const [nodeLabel, setNodeLabel] = useState('')
    const [expanded, setExpanded] = useState(false)
    const [open, setOpen] = useState(false)
    const [nodeDetails, setNodeDetails] = useState(null)
    const [nodeParams, setNodeParams] = useState([])
    const [nodeParamsType, setNodeParamsType] = useState([])
    const [nodeParamsInitialValues, setNodeParamsInitialValues] = useState({})
    const [nodeParamsValidation, setNodeParamsValidation] = useState({})
    const [isVariableSelectorOpen, setVariableSelectorOpen] = useState(false)
    const [variableBody, setVariableBody] = useState({})
    const [availableNodesForVariable, setAvailableNodesForVariable] = useState(null)
    const [isEditVariableDialogOpen, setEditVariableDialog] = useState(false)
    const [editVariableDialogProps, setEditVariableDialogProps] = useState({})

    const anchorRef = useRef(null)
    const ps = useRef()

    const getSpecificNodeApi = useApi(nodesApi.getSpecificNode)

    const scrollTop = () => {
        const curr = ps.current
        if (curr) {
            curr.scrollTop = 0
        }
    }

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return
        }
        setOpen(false)
        setVariableSelectorOpen(false)
    }

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen)
        if (open) setVariableSelectorOpen(false)
    }

    const handleAccordionChange = (paramsType) => (event, isExpanded) => {
        setExpanded(isExpanded ? paramsType : false)
        scrollTop()
    }

    const handleNodeLabelChange = (event) => {
        setNodeLabel(event.target.value)
    }

    const saveNodeLabel = () => {
        onNodeLabelUpdate(nodeLabel)
    }

    const onEditVariableDialogOpen = (input, values, arrayItemBody) => {
        const variableNodesIds = getAvailableNodeIdsForVariable(nodes, edges, node.id)

        const nodesForVariable = []
        for (let i = 0; i < variableNodesIds.length; i += 1) {
            const nodeId = variableNodesIds[i]
            const node = nodes.find((nd) => nd.id === nodeId)
            nodesForVariable.push(node)
        }

        const dialogProps = {
            input,
            values,
            arrayItemBody,
            availableNodesForVariable: nodesForVariable,
            cancelButtonName: 'Cancel',
            confirmButtonName: 'Save'
        }

        setEditVariableDialogProps(dialogProps)
        setEditVariableDialog(true)
    }

    const setVariableSelectorState = (variableSelectorState, body) => {
        setVariableSelectorOpen(variableSelectorState)
        if (body) {
            setVariableBody(body)
            const variableNodesIds = getAvailableNodeIdsForVariable(nodes, edges, node.id)

            const nodesForVariable = []
            for (let i = 0; i < variableNodesIds.length; i += 1) {
                const nodeId = variableNodesIds[i]
                const node = nodes.find((nd) => nd.id === nodeId)
                nodesForVariable.push(node)
            }
            setAvailableNodesForVariable(nodesForVariable)
        }
    }

    const paramsChanged = (formParams, paramsType) => {
        // Because formParams options can be changed due to show hide options,
        // To avoid that, replace with original details options

        const credentialMethodParam = formParams.find((param) => param.name === 'credentialMethod')
        const credentialMethodParamIndex = formParams.findIndex((param) => param.name === 'credentialMethod')

        if (credentialMethodParam !== undefined) {
            const originalParam = nodeDetails[paramsType].find((param) => param.name === 'credentialMethod')
            if (originalParam !== undefined) {
                formParams[credentialMethodParamIndex]['options'] = originalParam.options
            }
        }

        const updateNodeDetails = {
            ...nodeDetails,
            [paramsType]: formParams
        }
        setNodeDetails(updateNodeDetails)
    }

    const valueChanged = (formValues, paramsType) => {
        const updateNodeFlowData = {
            ...nodeFlowData,
            [paramsType]: formValues
        }
        // If input parameters change, notify output has to be retest
        if (nodeFlowData.outputResponses) {
            const outputResponsesFlowData = nodeFlowData.outputResponses
            outputResponsesFlowData.submit = null
            outputResponsesFlowData.needRetest = true
            updateNodeFlowData.outputResponses = outputResponsesFlowData
        }

        setNodeFlowData(updateNodeFlowData)
        onNodeValuesUpdate(updateNodeFlowData)
    }

    const onVariableSelected = (returnVariablePath) => {
        if (variableBody) {
            const path = variableBody.path
            const paramsType = variableBody.paramsType
            const newInput = `${variableBody.textBeforeCursorPosition}{{${returnVariablePath}}}${variableBody.textAfterCursorPosition}`
            const clonedNodeFlowData = lodash.cloneDeep(nodeFlowData)
            lodash.set(clonedNodeFlowData, path, newInput)
            valueChanged(clonedNodeFlowData[paramsType], paramsType)
        }
    }

    const onSubmit = (formValues, paramsType) => {
        const updateNodeFlowData = {
            ...nodeFlowData,
            [paramsType]: formValues
        }
        setNodeFlowData(updateNodeFlowData)
        onNodeValuesUpdate(updateNodeFlowData)

        const index = nodeParamsType.indexOf(paramsType)
        if (index >= 0 && index !== nodeParamsType.length - 1) {
            setExpanded(nodeParamsType[index + 1])
            scrollTop()
        }
    }

    const showHideParameters = (input, displayType, index, toBeDeleteParams) => {
        const displayOptions = input[displayType]
        Object.keys(displayOptions).forEach((path) => {
            const comparisonValue = displayOptions[path]
            if (path.includes('$index')) {
                path = path.replace('$index', index)
            }
            const groundValue = lodash.get(nodeFlowData, path, '')

            if (Array.isArray(comparisonValue)) {
                if (displayType === 'show' && !comparisonValue.includes(groundValue)) {
                    toBeDeleteParams.push(input)
                }
                if (displayType === 'hide' && comparisonValue.includes(groundValue)) {
                    toBeDeleteParams.push(input)
                }
            } else if (typeof comparisonValue === 'string') {
                if (displayType === 'show' && !(comparisonValue === groundValue || new RegExp(comparisonValue).test(groundValue))) {
                    toBeDeleteParams.push(input)
                }
                if (displayType === 'hide' && (comparisonValue === groundValue || new RegExp(comparisonValue).test(groundValue))) {
                    toBeDeleteParams.push(input)
                }
            }
        })
    }

    const displayParameters = (params, paramsType, arrayIndex) => {
        const toBeDeleteParams = []

        for (let i = 0; i < params.length; i += 1) {
            const input = params[i]

            if (input.type === 'array') {
                const arrayInitialValue = lodash.get(nodeFlowData, `${paramsType}.${input.name}`, [])
                const inputArray = []
                for (let j = arrayIndex; j < arrayInitialValue.length; j += 1) {
                    inputArray.push(displayParameters(input.array || [], paramsType, j))
                }
                input.arrayParams = inputArray
            }
            if (input.show) {
                showHideParameters(input, 'show', arrayIndex, toBeDeleteParams)
            }
            if (input.hide) {
                showHideParameters(input, 'hide', arrayIndex, toBeDeleteParams)
            }
        }

        let returnParams = params
        for (let i = 0; i < toBeDeleteParams.length; i += 1) {
            returnParams = returnParams.filter((prm) => JSON.stringify(prm) !== JSON.stringify(toBeDeleteParams[i]))
        }
        return returnParams
    }

    const showHideOptions = (displayType, index, options) => {
        let returnOptions = options
        const toBeDeleteOptions = []

        for (let i = 0; i < returnOptions.length; i += 1) {
            const option = returnOptions[i]
            const displayOptions = option[displayType]
            if (displayOptions) {
                Object.keys(displayOptions).forEach((path) => {
                    const comparisonValue = displayOptions[path]

                    if (path.includes('$index')) {
                        path = path.replace('$index', index)
                    }
                    const groundValue = lodash.get(nodeFlowData, path, '')

                    if (Array.isArray(comparisonValue)) {
                        if (displayType === 'show' && !comparisonValue.includes(groundValue)) {
                            toBeDeleteOptions.push(option)
                        }
                        if (displayType === 'hide' && comparisonValue.includes(groundValue)) {
                            toBeDeleteOptions.push(option)
                        }
                    } else if (typeof comparisonValue === 'string') {
                        if (displayType === 'show' && !(comparisonValue === groundValue || new RegExp(comparisonValue).test(groundValue))) {
                            toBeDeleteOptions.push(option)
                        }
                        if (displayType === 'hide' && (comparisonValue === groundValue || new RegExp(comparisonValue).test(groundValue))) {
                            toBeDeleteOptions.push(option)
                        }
                    }
                })
            }
        }

        for (let i = 0; i < toBeDeleteOptions.length; i += 1) {
            returnOptions = returnOptions.filter((opt) => JSON.stringify(opt) !== JSON.stringify(toBeDeleteOptions[i]))
        }

        return returnOptions
    }

    const displayOptions = (params, paramsType, arrayIndex) => {
        let clonedParams = params

        for (let i = 0; i < clonedParams.length; i += 1) {
            const input = clonedParams[i]

            if (input.type === 'array') {
                const arrayInitialValue = lodash.get(nodeFlowData, `${paramsType}.${input.name}`, [])
                const inputArray = []
                for (let j = arrayIndex; j < arrayInitialValue.length; j += 1) {
                    inputArray.push(displayOptions(input.arrayParams[j] || [], paramsType, j))
                }
                input.arrayParams = inputArray
            }

            if (input.type === 'options') {
                input.options = showHideOptions('show', arrayIndex, input.options)
                input.options = showHideOptions('hide', arrayIndex, input.options)
            }
        }

        return clonedParams
    }

    const setYupValidation = (params) => {
        const validationSchema = {}
        for (let i = 0; i < params.length; i += 1) {
            const input = params[i]
            let inputOptional = input.optional

            if (typeof input.optional === 'object' && input.optional !== null) {
                const keys = Object.keys(input.optional)
                inputOptional = true
                for (let j = 0; j < keys.length; j += 1) {
                    const path = keys[j]
                    const comparisonValue = input.optional[path]
                    const groundValue = lodash.get(nodeFlowData, path, '')

                    if (Array.isArray(comparisonValue)) {
                        inputOptional = inputOptional && comparisonValue.includes(groundValue)
                    } else if (typeof comparisonValue === 'string') {
                        inputOptional = inputOptional && (comparisonValue === groundValue || new RegExp(comparisonValue).test(groundValue))
                    }
                }
            }

            if (
                (input.type === 'string' ||
                    input.type === 'password' ||
                    input.type === 'date' ||
                    input.type === 'code' ||
                    input.type === 'json' ||
                    input.type === 'file' ||
                    input.type === 'options' ||
                    input.type === 'asyncOptions') &&
                !inputOptional
            ) {
                validationSchema[input.name] = Yup.string().required(`${input.label} is required. Type: ${input.type}`)
            } else if (input.type === 'number' && !inputOptional) {
                validationSchema[input.name] = Yup.string()
                    .required(`${input.label} is required. Type: ${input.type}`)
                    .matches(numberOrExpressionRegex, `${input.label} must be numbers or a variable expression.`)
            } else if (input.type === 'array' && !inputOptional) {
                /*
                ************
                * Limitation on different object shape within array: https://github.com/jquense/yup/issues/757
                ************
                const innerValidationSchema = setYupValidation(input.arrayParams);
                validationSchema[input.name] = Yup.array(Yup.object(innerValidationSchema)).required(`Must have ${input.label}`).min(1, `Minimum of 1 ${input.label}`);
                */
            }
        }
        return validationSchema
    }

    const initializeFormValuesAndParams = (paramsType) => {
        const initialValues = {}

        const reorganizedParams = displayParameters(nodeDetails[paramsType] || [], paramsType, 0)
        let nodeParams = displayOptions(lodash.cloneDeep(reorganizedParams), paramsType, 0)

        nodeParams = handleCredentialParams(nodeParams, paramsType, reorganizedParams, nodeFlowData)

        for (let i = 0; i < nodeParams.length; i += 1) {
            const input = nodeParams[i]

            // Load from nodeFlowData values
            if (paramsType in nodeFlowData && input.name in nodeFlowData[paramsType]) {
                initialValues[input.name] = nodeFlowData[paramsType][input.name]

                // Check if option value is still available from the list of options
                if (input.type === 'options') {
                    const optionVal = input.options.find((option) => option.name === initialValues[input.name])
                    if (!optionVal) delete initialValues[input.name]
                }
            } else {
                // Load from nodeParams default values
                initialValues[input.name] = input.default || ''

                /**
                 * Special case for array, always initialize the item if default is not set
                 * Disabling for now
                if (input.type === 'array' && !input.default) {
                    const newObj = {}
                    for (let j = 0; j < input.array.length; j += 1) {
                        newObj[input.array[j].name] = input.array[j].default || ''
                    }
                    initialValues[input.name] = [newObj]
                }
                */
            }
        }

        initialValues.submit = null

        setNodeParamsInitialValues(initialValues)
        setNodeParamsValidation(setYupValidation(nodeParams))
        setNodeParams(nodeParams)
    }

    // Handle Accordian
    const prevOpen = useRef(open)
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus()
        }

        prevOpen.current = open
    }, [open])

    // Get Node Details from API
    useEffect(() => {
        if (getSpecificNodeApi.data) {
            const nodeDetails = getSpecificNodeApi.data

            setNodeDetails(nodeDetails)

            const nodeParamsType = []

            if (nodeDetails.actions) nodeParamsType.push('actions')
            if (nodeDetails.networks) nodeParamsType.push('networks')
            if (nodeDetails.credentials) nodeParamsType.push('credentials')
            if (nodeDetails.inputParameters) nodeParamsType.push('inputParameters')
            nodeParamsType.push('outputResponses')

            setNodeParamsType(nodeParamsType)

            if (nodeParamsType.length) {
                setExpanded(nodeParamsType[0])
                scrollTop()
            }
        }
    }, [getSpecificNodeApi.data])

    // Initialization
    useEffect(() => {
        if (node) {
            setOpen(true)
            setNodeLabel(node.data.label)
            setNodeFlowData(node.data)
            getSpecificNodeApi.request(node.data.name)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [node])

    // Initialize Parameters Initial Values & Validation
    useEffect(() => {
        if (nodeDetails && nodeFlowData && expanded) {
            initializeFormValuesAndParams(expanded)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nodeDetails, nodeFlowData, expanded])

    return (
        <>
            <Fab sx={{ left: 40, top: 20 }} ref={anchorRef} size='small' color='secondary' onClick={handleToggle} title='Edit Node'>
                {open ? <IconMinus /> : <IconPencil />}
            </Fab>
            <Popper
                placement='bottom-end'
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [-80, 14]
                            }
                        }
                    ]
                }}
                sx={{ zIndex: 1000 }}
            >
                {({ TransitionProps }) => (
                    <Transitions in={open} {...TransitionProps}>
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                    <Box sx={{ p: 2 }}>
                                        <Stack>
                                            <Typography variant='h4'>Edit Nodes</Typography>
                                        </Stack>
                                    </Box>
                                    <PerfectScrollbar
                                        containerRef={(el) => {
                                            ps.current = el
                                        }}
                                        style={{ height: '100%', maxHeight: 'calc(100vh - 250px)', overflowX: 'hidden' }}
                                    >
                                        {!node && <Box sx={{ p: 2 }}>No data</Box>}

                                        {nodeFlowData && nodeFlowData.label && (
                                            <Box
                                                sx={{
                                                    pl: 4,
                                                    pr: 4,
                                                    pt: 2,
                                                    pb: 2,
                                                    textAlign: 'center',
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <TextField
                                                    id={nodeFlowData.name}
                                                    label='Node Label'
                                                    variant='outlined'
                                                    value={nodeLabel}
                                                    onChange={handleNodeLabelChange}
                                                    fullWidth
                                                />
                                                <Fab
                                                    sx={{
                                                        minHeight: 10,
                                                        height: 27,
                                                        width: 30,
                                                        backgroundColor: theme.palette.secondary.light,
                                                        color: theme.palette.secondary.main,
                                                        ml: 2
                                                    }}
                                                    size='small'
                                                    title='Validate and Save'
                                                    onClick={saveNodeLabel}
                                                >
                                                    <IconCheck />
                                                </Fab>
                                            </Box>
                                        )}

                                        {/* actions */}
                                        {nodeParamsType.includes('actions') && (
                                            <Box sx={{ p: 2 }}>
                                                <Accordion expanded={expanded === 'actions'} onChange={handleAccordionChange('actions')}>
                                                    <AccordionSummary
                                                        expandIcon={<ExpandMoreIcon />}
                                                        aria-controls='actions-content'
                                                        id='actions-header'
                                                    >
                                                        <Typography variant='h4'>Actions</Typography>
                                                        {nodeFlowData && nodeFlowData.actions && nodeFlowData.actions.submit && (
                                                            <Avatar
                                                                variant='rounded'
                                                                sx={{
                                                                    ...theme.typography.smallAvatar,
                                                                    borderRadius: '50%',
                                                                    background: theme.palette.success.dark,
                                                                    color: 'white',
                                                                    ml: 2
                                                                }}
                                                            >
                                                                <IconCheck />
                                                            </Avatar>
                                                        )}
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <InputParameters
                                                            key={node.id} // to reload whenever node changed
                                                            params={nodeParams}
                                                            paramsType='actions'
                                                            initialValues={nodeParamsInitialValues}
                                                            nodeParamsValidation={nodeParamsValidation}
                                                            nodeFlowData={nodeFlowData}
                                                            setVariableSelectorState={setVariableSelectorState}
                                                            onEditVariableDialogOpen={onEditVariableDialogOpen}
                                                            valueChanged={valueChanged}
                                                            onSubmit={onSubmit}
                                                        />
                                                    </AccordionDetails>
                                                </Accordion>
                                                <Divider />
                                            </Box>
                                        )}

                                        {/* networks */}
                                        {nodeParamsType.includes('networks') && (
                                            <Box sx={{ p: 2 }}>
                                                <Accordion expanded={expanded === 'networks'} onChange={handleAccordionChange('networks')}>
                                                    <AccordionSummary
                                                        expandIcon={<ExpandMoreIcon />}
                                                        aria-controls='networks-content'
                                                        id='networks-header'
                                                    >
                                                        <Typography variant='h4'>Networks</Typography>
                                                        {nodeFlowData && nodeFlowData.networks && nodeFlowData.networks.submit && (
                                                            <Avatar
                                                                variant='rounded'
                                                                sx={{
                                                                    ...theme.typography.smallAvatar,
                                                                    borderRadius: '50%',
                                                                    background: theme.palette.success.dark,
                                                                    color: 'white',
                                                                    ml: 2
                                                                }}
                                                            >
                                                                <IconCheck />
                                                            </Avatar>
                                                        )}
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <InputParameters
                                                            key={node.id} // to reload whenever node changed
                                                            params={nodeParams}
                                                            paramsType='networks'
                                                            initialValues={nodeParamsInitialValues}
                                                            nodeParamsValidation={nodeParamsValidation}
                                                            nodeFlowData={nodeFlowData}
                                                            setVariableSelectorState={setVariableSelectorState}
                                                            onEditVariableDialogOpen={onEditVariableDialogOpen}
                                                            valueChanged={valueChanged}
                                                            onSubmit={onSubmit}
                                                        />
                                                    </AccordionDetails>
                                                </Accordion>
                                                <Divider />
                                            </Box>
                                        )}

                                        {/* credentials */}
                                        {nodeParamsType.includes('credentials') && (
                                            <Box sx={{ p: 2 }}>
                                                <Accordion
                                                    expanded={expanded === 'credentials'}
                                                    onChange={handleAccordionChange('credentials')}
                                                >
                                                    <AccordionSummary
                                                        expandIcon={<ExpandMoreIcon />}
                                                        aria-controls='credentials-content'
                                                        id='credentials-header'
                                                    >
                                                        <Typography variant='h4'>Credentials</Typography>
                                                        {nodeFlowData && nodeFlowData.credentials && nodeFlowData.credentials.submit && (
                                                            <Avatar
                                                                variant='rounded'
                                                                sx={{
                                                                    ...theme.typography.smallAvatar,
                                                                    borderRadius: '50%',
                                                                    background: theme.palette.success.dark,
                                                                    color: 'white',
                                                                    ml: 2
                                                                }}
                                                            >
                                                                <IconCheck />
                                                            </Avatar>
                                                        )}
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <CredentialInput
                                                            key={node.id} // to reload whenever node changed
                                                            initialParams={nodeParams}
                                                            paramsType='credentials'
                                                            initialValues={nodeParamsInitialValues}
                                                            initialValidation={nodeParamsValidation}
                                                            valueChanged={valueChanged}
                                                            paramsChanged={paramsChanged}
                                                            onSubmit={onSubmit}
                                                        />
                                                    </AccordionDetails>
                                                </Accordion>
                                                <Divider />
                                            </Box>
                                        )}

                                        {/* inputParameters */}
                                        {nodeParamsType.includes('inputParameters') && (
                                            <Box sx={{ p: 2 }}>
                                                <Accordion
                                                    expanded={expanded === 'inputParameters'}
                                                    onChange={handleAccordionChange('inputParameters')}
                                                >
                                                    <AccordionSummary
                                                        expandIcon={<ExpandMoreIcon />}
                                                        aria-controls='inputParameters-content'
                                                        id='inputParameters-header'
                                                    >
                                                        <Typography variant='h4'>Input Parameters</Typography>
                                                        {nodeFlowData &&
                                                            nodeFlowData.inputParameters &&
                                                            nodeFlowData.inputParameters.submit && (
                                                                <Avatar
                                                                    variant='rounded'
                                                                    sx={{
                                                                        ...theme.typography.smallAvatar,
                                                                        borderRadius: '50%',
                                                                        background: theme.palette.success.dark,
                                                                        color: 'white',
                                                                        ml: 2
                                                                    }}
                                                                >
                                                                    <IconCheck />
                                                                </Avatar>
                                                            )}
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <InputParameters
                                                            key={node.id} // to reload whenever node changed
                                                            params={nodeParams}
                                                            paramsType='inputParameters'
                                                            initialValues={nodeParamsInitialValues}
                                                            nodeParamsValidation={nodeParamsValidation}
                                                            nodeFlowData={nodeFlowData}
                                                            setVariableSelectorState={setVariableSelectorState}
                                                            onEditVariableDialogOpen={onEditVariableDialogOpen}
                                                            valueChanged={valueChanged}
                                                            onSubmit={onSubmit}
                                                        />
                                                    </AccordionDetails>
                                                </Accordion>
                                                <Divider />
                                            </Box>
                                        )}

                                        {/* outputResponses */}
                                        {nodeDetails && nodeFlowData && (
                                            <Box sx={{ p: 2 }}>
                                                <Accordion
                                                    expanded={expanded === 'outputResponses'}
                                                    onChange={handleAccordionChange('outputResponses')}
                                                >
                                                    <AccordionSummary
                                                        expandIcon={<ExpandMoreIcon />}
                                                        aria-controls='outputResponses-content'
                                                        id='outputResponses-header'
                                                    >
                                                        <Typography variant='h4'>Output Responses</Typography>
                                                        {nodeFlowData &&
                                                            nodeFlowData.outputResponses &&
                                                            nodeFlowData.outputResponses.submit && (
                                                                <Avatar
                                                                    variant='rounded'
                                                                    sx={{
                                                                        ...theme.typography.smallAvatar,
                                                                        borderRadius: '50%',
                                                                        background: theme.palette.success.dark,
                                                                        color: 'white',
                                                                        ml: 2
                                                                    }}
                                                                >
                                                                    <IconCheck />
                                                                </Avatar>
                                                            )}
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <OutputResponses
                                                            key={node.id} // to reload whenever node changed
                                                            nodeId={node.id}
                                                            nodeParamsType={nodeParamsType}
                                                            nodeFlowData={nodeFlowData}
                                                            nodes={nodes}
                                                            edges={edges}
                                                            workflow={workflow}
                                                            onSubmit={onSubmit}
                                                        />
                                                    </AccordionDetails>
                                                </Accordion>
                                                <Divider />
                                            </Box>
                                        )}
                                    </PerfectScrollbar>
                                    <VariableSelector
                                        key={JSON.stringify(availableNodesForVariable)}
                                        nodes={availableNodesForVariable}
                                        isVariableSelectorOpen={isVariableSelectorOpen}
                                        anchorEl={anchorRef.current}
                                        onVariableSelected={(returnVariablePath) => onVariableSelected(returnVariablePath)}
                                        handleClose={() => setVariableSelectorOpen(false)}
                                    />
                                    <EditVariableDialog
                                        key={JSON.stringify(editVariableDialogProps)}
                                        show={isEditVariableDialogOpen}
                                        dialogProps={editVariableDialogProps}
                                        onCancel={() => setEditVariableDialog(false)}
                                        onConfirm={(updateValues) => {
                                            valueChanged(updateValues, expanded)
                                            setEditVariableDialog(false)
                                        }}
                                    />
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
        </>
    )
}

EditNodes.propTypes = {
    node: PropTypes.object,
    nodes: PropTypes.array,
    edges: PropTypes.array,
    workflow: PropTypes.object,
    onNodeLabelUpdate: PropTypes.func,
    onNodeValuesUpdate: PropTypes.func
}

export default EditNodes
