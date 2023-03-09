import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useRef, useState } from 'react'

// material-ui
import { useTheme } from '@mui/material/styles'
import { Box, ButtonBase, Typography, Stack, TextField, Chip } from '@mui/material'

// icons
import {
    IconSettings,
    IconChevronLeft,
    IconDeviceFloppy,
    IconRocket,
    IconPencil,
    IconCheck,
    IconX,
    IconPlayerPause,
    IconListCheck,
    IconMoon,
    IconSun
} from '@tabler/icons'

// project imports
import Executions from 'views/executions'
import Settings from 'views/settings'
import SaveWorkflowDialog from 'ui-component/dialog/SaveWorkflowDialog'

// API
import workflowsApi from 'api/workflows'

// Hooks
import useApi from 'hooks/useApi'

// utils
import { generateExportFlowData } from 'utils/genericHelper'

// store
import { SET_DARKMODE } from 'store/actions'

// ==============================|| CANVAS HEADER ||============================== //

const CanvasHeader = ({ workflow, handleSaveFlow, handleDeployWorkflow, handleStopWorkflow, handleDeleteWorkflow, handleLoadWorkflow }) => {
    const theme = useTheme()
    const navigate = useNavigate()
    const workflowNameRef = useRef()
    const viewExecutionRef = useRef()
    const settingsRef = useRef()

    const [isEditingWorkflowName, setEditingWorkflowName] = useState(null)
    const [workflowName, setWorkflowName] = useState('')
    const [isExecutionOpen, setExecutionOpen] = useState(false)
    const [isSettingsOpen, setSettingsOpen] = useState(false)
    const [workfowDialogOpen, setWorkfowDialogOpen] = useState(false)

    const updateWorkflowApi = useApi(workflowsApi.updateWorkflow)
    const canvas = useSelector((state) => state.canvas)
    const customization = useSelector((state) => state.customization)

    const [isDark, setIsDark] = useState(customization.isDarkMode)
    const dispatch = useDispatch()

    const changeDarkMode = () => {
        dispatch({ type: SET_DARKMODE, isDarkMode: !isDark })
        setIsDark((isDark) => !isDark)
    }

    const onSettingsItemClick = (setting) => {
        setSettingsOpen(false)

        if (setting === 'deleteWorkflow') {
            handleDeleteWorkflow()
        } else if (setting === 'exportWorkflow') {
            try {
                const flowData = JSON.parse(workflow.flowData)
                let dataStr = JSON.stringify(generateExportFlowData(flowData))
                let dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)

                let exportFileDefaultName = `${workflow.name} Workflow.json`

                let linkElement = document.createElement('a')
                linkElement.setAttribute('href', dataUri)
                linkElement.setAttribute('download', exportFileDefaultName)
                linkElement.click()
            } catch (e) {
                console.error(e)
            }
        }
    }

    const onUploadFile = (file) => {
        setSettingsOpen(false)
        handleLoadWorkflow(file)
    }

    const submitWorkflowName = () => {
        if (workflow.shortId) {
            const updateBody = {
                name: workflowNameRef.current.value
            }
            updateWorkflowApi.request(workflow.shortId, updateBody)
        }
    }

    const onSaveWorkflowClick = () => {
        if (workflow.shortId) handleSaveFlow(workflow.name)
        else setWorkfowDialogOpen(true)
    }

    const onConfirmSaveName = (workflowName) => {
        setWorkfowDialogOpen(false)
        handleSaveFlow(workflowName)
    }

    useEffect(() => {
        if (updateWorkflowApi.data) {
            setWorkflowName(updateWorkflowApi.data.name)
        }
        setEditingWorkflowName(false)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateWorkflowApi.data])

    useEffect(() => {
        if (workflow) {
            setWorkflowName(workflow.name)
        }
    }, [workflow])

    return (
        <>
            <Box>
                <ButtonBase title='Back' sx={{ borderRadius: '50%' }}>
                    <IconChevronLeft stroke={1.5} size='1.3rem' onClick={() => navigate(-1)} />
                </ButtonBase>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
                {!isEditingWorkflowName && (
                    <Stack flexDirection='row'>
                        <Typography
                            sx={{
                                fontSize: '1.5rem',
                                fontWeight: 600,
                                ml: 2
                            }}
                        >
                            {canvas.isDirty && <strong style={{ color: theme.palette.orange.main }}>*</strong>} {workflowName}
                        </Typography>
                        {workflow?.shortId && (
                            <ButtonBase title='Edit Name' sx={{ borderRadius: '50%', mr: 2, ml: 2 }}>
                                <IconPencil stroke={1.5} size='1.3rem' onClick={() => setEditingWorkflowName(true)} />
                            </ButtonBase>
                        )}
                        {workflow?.deployed && (
                            <Chip
                                sx={{
                                    color: theme.palette.success.dark,
                                    backgroundColor: theme.palette.success.light,
                                    ml: 1
                                }}
                                label='Deployed'
                                color='success'
                            />
                        )}
                    </Stack>
                )}
                {isEditingWorkflowName && (
                    <Stack flexDirection='row'>
                        <TextField
                            size='small'
                            inputRef={workflowNameRef}
                            sx={{
                                width: '50%',
                                ml: 2
                            }}
                            defaultValue={workflowName}
                        />
                        <ButtonBase title='Save Name' sx={{ borderRadius: '50%' }}>
                            <IconCheck stroke={1.5} size='1.3rem' onClick={submitWorkflowName} />
                        </ButtonBase>
                        <ButtonBase title='Cancel' sx={{ borderRadius: '50%' }}>
                            <IconX stroke={1.5} size='1.3rem' onClick={() => setEditingWorkflowName(false)} />
                        </ButtonBase>
                    </Stack>
                )}
            </Box>
            <Box>
                {workflow?.shortId && (
                    <ButtonBase ref={viewExecutionRef} title='View Executions' sx={{ borderRadius: '50%', mr: 2 }}>
                        <h6>{workflow?.executionCount}</h6>&nbsp;
                        <IconListCheck stroke={1.5} size='1.3rem' onClick={() => setExecutionOpen(!isExecutionOpen)} />
                    </ButtonBase>
                )}
                {workflow?.shortId && (
                    <ButtonBase title={workflow?.deployed ? 'Stop Workflow' : 'Deploy Workflow'} sx={{ borderRadius: '50%', mr: 2 }}>
                        {workflow?.deployed ? (
                            <IconPlayerPause stroke={1.5} size='1.3rem' onClick={handleStopWorkflow} />
                        ) : (
                            <IconRocket stroke={1.5} size='1.3rem' onClick={handleDeployWorkflow} />
                        )}
                    </ButtonBase>
                )}

                <ButtonBase title='Save Workflow' sx={{ mr: 2 }}>
                    <IconDeviceFloppy stroke={1.5} size='1.3rem' onClick={onSaveWorkflowClick} />
                </ButtonBase>
                <ButtonBase ref={settingsRef} title='Settings' sx={{ mr: 2 }}>
                    <IconSettings stroke={1.5} size='1.3rem' onClick={() => setSettingsOpen(!isSettingsOpen)} />
                </ButtonBase>
                <ButtonBase title='Settings'>
                    {isDark ? (
                        <IconMoon stroke={1.5} size='1.3rem' onClick={changeDarkMode} />
                    ) : (
                        <IconSun stroke={1.5} size='1.3rem' onClick={changeDarkMode} />
                    )}
                </ButtonBase>
            </Box>
            {workflow?.shortId && (
                <Executions
                    workflowShortId={workflow?.shortId}
                    execution={workflow?.execution}
                    executionCount={workflow?.executionCount}
                    isExecutionOpen={isExecutionOpen}
                    anchorEl={viewExecutionRef.current}
                />
            )}
            <Settings
                workflow={workflow}
                isSettingsOpen={isSettingsOpen}
                anchorEl={settingsRef.current}
                onSettingsItemClick={onSettingsItemClick}
                onUploadFile={onUploadFile}
            />
            <SaveWorkflowDialog
                show={workfowDialogOpen}
                dialogProps={{
                    title: `Save New Workflow`,
                    confirmButtonName: 'Save',
                    cancelButtonName: 'Cancel'
                }}
                onCancel={() => setWorkfowDialogOpen(false)}
                onConfirm={onConfirmSaveName}
            />
        </>
    )
}

CanvasHeader.propTypes = {
    workflow: PropTypes.object,
    handleSaveFlow: PropTypes.func,
    handleDeployWorkflow: PropTypes.func,
    handleStopWorkflow: PropTypes.func,
    handleDeleteWorkflow: PropTypes.func,
    handleLoadWorkflow: PropTypes.func
}

export default CanvasHeader
