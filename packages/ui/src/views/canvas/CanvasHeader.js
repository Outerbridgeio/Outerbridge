import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'

// material-ui
import { useTheme } from '@mui/material/styles'
import { Avatar, Box, ButtonBase, Typography, Stack, TextField, Chip } from '@mui/material'

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
    IconListCheck
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
                    <Avatar
                        variant='rounded'
                        sx={{
                            ...theme.typography.commonAvatar,
                            ...theme.typography.mediumAvatar,
                            transition: 'all .2s ease-in-out',
                            background: theme.palette.secondary.light,
                            color: theme.palette.secondary.dark,
                            '&:hover': {
                                background: theme.palette.secondary.dark,
                                color: theme.palette.secondary.light
                            }
                        }}
                        color='inherit'
                        onClick={() => navigate(-1)}
                    >
                        <IconChevronLeft stroke={1.5} size='1.3rem' />
                    </Avatar>
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
                            <ButtonBase title='Edit Name' sx={{ borderRadius: '50%' }}>
                                <Avatar
                                    variant='rounded'
                                    sx={{
                                        ...theme.typography.commonAvatar,
                                        ...theme.typography.mediumAvatar,
                                        transition: 'all .2s ease-in-out',
                                        background: 'white',
                                        color: theme.palette.text.dark,
                                        ml: 1,
                                        '&:hover': {
                                            background: theme.palette.secondary.light,
                                            color: theme.palette.secondary.dark
                                        }
                                    }}
                                    color='inherit'
                                    onClick={() => setEditingWorkflowName(true)}
                                >
                                    <IconPencil stroke={1.5} size='1.3rem' />
                                </Avatar>
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
                            <Avatar
                                variant='rounded'
                                sx={{
                                    ...theme.typography.commonAvatar,
                                    ...theme.typography.mediumAvatar,
                                    transition: 'all .2s ease-in-out',
                                    background: 'white',
                                    color: theme.palette.text.dark,
                                    ml: 1,
                                    '&:hover': {
                                        background: theme.palette.secondary.light,
                                        color: theme.palette.secondary.dark
                                    }
                                }}
                                color='inherit'
                                onClick={submitWorkflowName}
                            >
                                <IconCheck stroke={1.5} size='1.3rem' />
                            </Avatar>
                        </ButtonBase>
                        <ButtonBase title='Cancel' sx={{ borderRadius: '50%' }}>
                            <Avatar
                                variant='rounded'
                                sx={{
                                    ...theme.typography.commonAvatar,
                                    ...theme.typography.mediumAvatar,
                                    transition: 'all .2s ease-in-out',
                                    background: 'white',
                                    color: theme.palette.text.dark,
                                    ml: 1,
                                    '&:hover': {
                                        background: theme.palette.error.light,
                                        color: theme.palette.error.dark
                                    }
                                }}
                                color='inherit'
                                onClick={() => setEditingWorkflowName(false)}
                            >
                                <IconX stroke={1.5} size='1.3rem' />
                            </Avatar>
                        </ButtonBase>
                    </Stack>
                )}
            </Box>
            <Box>
                {workflow?.shortId && (
                    <ButtonBase ref={viewExecutionRef} title='View Executions' sx={{ borderRadius: '50%', mr: 2 }}>
                        <Avatar
                            variant='rounded'
                            sx={{
                                ...theme.typography.commonAvatar,
                                ...theme.typography.mediumAvatar,
                                width: '54px',
                                transition: 'all .2s ease-in-out',
                                background: theme.palette.success.light,
                                color: theme.palette.success.dark,
                                '&:hover': {
                                    background: theme.palette.success.dark,
                                    color: theme.palette.success.light
                                }
                            }}
                            color='inherit'
                            onClick={() => setExecutionOpen(!isExecutionOpen)}
                        >
                            <h6>{workflow?.executionCount}</h6>&nbsp;
                            <IconListCheck stroke={1.5} size='1.3rem' />
                        </Avatar>
                    </ButtonBase>
                )}
                {workflow?.shortId && (
                    <ButtonBase title={workflow?.deployed ? 'Stop Workflow' : 'Deploy Workflow'} sx={{ borderRadius: '50%', mr: 2 }}>
                        <Avatar
                            variant='rounded'
                            sx={{
                                ...theme.typography.commonAvatar,
                                ...theme.typography.mediumAvatar,
                                transition: 'all .2s ease-in-out',
                                background: theme.palette.primary.light,
                                color: theme.palette.primary.dark,
                                '&:hover': {
                                    background: theme.palette.primary.dark,
                                    color: theme.palette.primary.light
                                }
                            }}
                            color='inherit'
                            onClick={workflow?.deployed ? handleStopWorkflow : handleDeployWorkflow}
                        >
                            {workflow?.deployed ? (
                                <IconPlayerPause stroke={1.5} size='1.3rem' />
                            ) : (
                                <IconRocket stroke={1.5} size='1.3rem' />
                            )}
                        </Avatar>
                    </ButtonBase>
                )}
                <ButtonBase title='Save Workflow' sx={{ borderRadius: '50%', mr: 2 }}>
                    <Avatar
                        variant='rounded'
                        sx={{
                            ...theme.typography.commonAvatar,
                            ...theme.typography.mediumAvatar,
                            transition: 'all .2s ease-in-out',
                            background: theme.palette.secondary.light,
                            color: theme.palette.secondary.dark,
                            '&:hover': {
                                background: theme.palette.secondary.dark,
                                color: theme.palette.secondary.light
                            }
                        }}
                        color='inherit'
                        onClick={onSaveWorkflowClick}
                    >
                        <IconDeviceFloppy stroke={1.5} size='1.3rem' />
                    </Avatar>
                </ButtonBase>
                <ButtonBase ref={settingsRef} title='Settings' sx={{ borderRadius: '50%' }}>
                    <Avatar
                        variant='rounded'
                        sx={{
                            ...theme.typography.commonAvatar,
                            ...theme.typography.mediumAvatar,
                            transition: 'all .2s ease-in-out',
                            background: theme.palette.grey[300],
                            color: theme.palette.grey[700],
                            '&:hover': {
                                background: theme.palette.grey[700],
                                color: theme.palette.grey[300]
                            }
                        }}
                        onClick={() => setSettingsOpen(!isSettingsOpen)}
                    >
                        <IconSettings stroke={1.5} size='1.3rem' />
                    </Avatar>
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
