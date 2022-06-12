import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ButtonBase, Typography, Stack, TextField, Chip } from '@mui/material';

// icons
import { IconChevronLeft, IconDeviceFloppy, IconRocket, IconPencil, IconCheck, IconX, IconPlayerPause, IconTrash, IconListCheck } from '@tabler/icons';

// project imports
import Executions from 'views/executions';

// API
import workflowsApi from "api/workflows";

// Hooks
import useApi from "hooks/useApi";

// ==============================|| CANVAS HEADER ||============================== //

const CanvasHeader = ({ 
    workflow, 
    handleSaveFlow,
    handleDeployWorkflow, 
    handleStopWorkflow, 
    handleNewWorkflowCreated,
    handleDeleteWorkflow,
}) => {

    const theme = useTheme();
    const navigate = useNavigate();
    const workflowNameRef = useRef();
    const viewExecutionRef = useRef();

    const [isEditingWorkflowName, setEditingWorkflowName] = useState(null);
    const [workflowName, setWorkflowName] = useState('');
    const [isExecutionOpen, setExecutionOpen] = useState(false);
  
    const updateWorkflowApi = useApi(workflowsApi.updateWorkflow);
    const createNewWorkflowApi = useApi(workflowsApi.createNewWorkflow);
    const canvas = useSelector((state) => state.canvas);

    const submitWorkflowName = () => {
        if (workflow.shortId) {
            const updateBody = {
                name: workflowNameRef.current.value
            };
            updateWorkflowApi.request(workflow.shortId, updateBody);
        } else {
            const createBody = {
                name: workflowNameRef.current.value,
                deployed: false
            };
            createNewWorkflowApi.request(createBody);
        }
    };

    useEffect(() => {
        if (updateWorkflowApi.data) {
            setWorkflowName(updateWorkflowApi.data.name);
        } else if (createNewWorkflowApi.data) {
            setWorkflowName(createNewWorkflowApi.data.name);
            handleNewWorkflowCreated(createNewWorkflowApi.data);
        }
        setEditingWorkflowName(false);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateWorkflowApi.data, createNewWorkflowApi.data]);

    useEffect(() => {
        if (workflow) {
            setWorkflowName(workflow.name);
        }
    }, [workflow]);

    return (
        <>
            <Box >
                <ButtonBase title="Back" sx={{ borderRadius: '50%' }}>
                    <Avatar
                        variant="rounded"
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
                        color="inherit"
                        onClick={() => navigate(-1)}
                    >
                        <IconChevronLeft stroke={1.5} size="1.3rem" />
                    </Avatar>
                </ButtonBase>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
                {!isEditingWorkflowName && (
                <Stack flexDirection="row">
                    <Typography
                        sx={{
                            fontSize: '1.5rem',
                            fontWeight: 600,
                            ml: 2
                        }}
                    >
                        {canvas.isDirty && <strong style={{color: theme.palette.orange.main}}>*</strong> } {workflowName}
                    </Typography>
                    <ButtonBase title="Edit Name" sx={{ borderRadius: '50%' }}>
                        <Avatar
                            variant="rounded"
                            sx={{
                                ...theme.typography.commonAvatar,
                                ...theme.typography.mediumAvatar,
                                transition: 'all .2s ease-in-out',
                                background: 'white',
                                color: theme.palette.text.dark,
                                ml: 1,
                                '&:hover': {
                                    background: theme.palette.secondary.light,
                                    color: theme.palette.secondary.dark,
                                }
                            }}
                            color="inherit"
                            onClick={() => setEditingWorkflowName(true)}
                        >
                            <IconPencil stroke={1.5} size="1.3rem" />
                        </Avatar>
                    </ButtonBase>
                    {workflow?.deployed && (
                        <Chip 
                            sx={{
                                color: theme.palette.success.dark, 
                                backgroundColor: theme.palette.success.light, 
                                ml: 1
                            }} 
                            label="Deployed" 
                            color="success" 
                        />
                    )}
                </Stack>
                )}
                {isEditingWorkflowName && (
                <Stack flexDirection="row">
                    <TextField
                        size="small"
                        inputRef={workflowNameRef}
                        sx={{
                            width: '50%',
                            ml: 2
                        }}
                        defaultValue={workflowName}
                    />
                    <ButtonBase title="Save Name" sx={{ borderRadius: '50%' }}>
                        <Avatar
                            variant="rounded"
                            sx={{
                                ...theme.typography.commonAvatar,
                                ...theme.typography.mediumAvatar,
                                transition: 'all .2s ease-in-out',
                                background: 'white',
                                color: theme.palette.text.dark,
                                ml: 1,
                                '&:hover': {
                                    background: theme.palette.secondary.light,
                                    color: theme.palette.secondary.dark,
                                }
                            }}
                            color="inherit"
                            onClick={submitWorkflowName}
                        >
                            <IconCheck stroke={1.5} size="1.3rem" />
                        </Avatar>
                    </ButtonBase>
                    <ButtonBase title="Cancel" sx={{ borderRadius: '50%' }}>
                        <Avatar
                            variant="rounded"
                            sx={{
                                ...theme.typography.commonAvatar,
                                ...theme.typography.mediumAvatar,
                                transition: 'all .2s ease-in-out',
                                background: 'white',
                                color: theme.palette.text.dark,
                                ml: 1,
                                '&:hover': {
                                    background: theme.palette.error.light,
                                    color: theme.palette.error.dark,
                                }
                            }}
                            color="inherit"
                            onClick={() => setEditingWorkflowName(false)}
                        >
                            <IconX stroke={1.5} size="1.3rem" />
                        </Avatar>
                    </ButtonBase>
                </Stack>
                )}
            </Box>
            <Box >
                {workflow?.shortId && (
                <ButtonBase ref={viewExecutionRef} title="View Executions" sx={{ borderRadius: '50%', mr: 2 }}>
                    <Avatar
                        variant="rounded"
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
                        color="inherit"
                        onClick={() => setExecutionOpen(true)}
                    >
                       <h6>{workflow?.executionCount}</h6>&nbsp;<IconListCheck stroke={1.5} size="1.3rem" />
                    </Avatar>
                </ButtonBase>
                )}
                {workflow?.shortId && (
                <ButtonBase title={workflow?.deployed ? "Stop Workflow" : "Deploy Workflow"} sx={{ borderRadius: '50%', mr: 2 }}>
                    <Avatar
                        variant="rounded"
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
                        color="inherit"
                        onClick={workflow?.deployed ? handleStopWorkflow : handleDeployWorkflow}
                    >
                        {workflow?.deployed ? <IconPlayerPause stroke={1.5} size="1.3rem" /> : <IconRocket stroke={1.5} size="1.3rem" />}
                    </Avatar>
                </ButtonBase>
                )}
                <ButtonBase title="Save Workflow" sx={{ borderRadius: '50%', mr: workflow?.shortId ? 2 : 0 }}>
                    <Avatar
                        variant="rounded"
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
                        color="inherit"
                        onClick={handleSaveFlow}
                    >
                        <IconDeviceFloppy stroke={1.5} size="1.3rem" />
                    </Avatar>
                </ButtonBase>
                {workflow?.shortId && (
                    <ButtonBase title="Delete Workflow" sx={{ borderRadius: '50%' }}>
                        <Avatar
                            variant="rounded"
                            sx={{
                                ...theme.typography.commonAvatar,
                                ...theme.typography.mediumAvatar,
                                transition: 'all .2s ease-in-out',
                                background: theme.palette.error.light,
                                color: theme.palette.error.dark,
                                '&:hover': {
                                    background: theme.palette.error.dark,
                                    color: theme.palette.error.light
                                }
                            }}
                            color="inherit"
                            onClick={handleDeleteWorkflow}
                        >
                            <IconTrash stroke={1.5} size="1.3rem" />
                        </Avatar>
                    </ButtonBase>
                )}
            </Box>
            {workflow?.shortId && (
            <Executions
                execution={workflow?.execution}
                executionCount={workflow?.executionCount}
                isExecutionOpen={isExecutionOpen}
                anchorEl={viewExecutionRef.current}
                handleClose={() => setExecutionOpen(false)}
            />
            )}
        </>
    );
};

CanvasHeader.propTypes = {
    workflow: PropTypes.object,
    handleSaveFlow: PropTypes.func,
    handleDeployWorkflow: PropTypes.func,
    handleStopWorkflow: PropTypes.func,
    handleNewWorkflowCreated: PropTypes.func,
    handleDeleteWorkflow: PropTypes.func,
};

export default CanvasHeader;
