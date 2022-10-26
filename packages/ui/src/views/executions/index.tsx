import { useState, useRef, useEffect, ComponentProps } from 'react'
import { SET_WORKFLOW, enqueueSnackbar as enqueueSnackbarAction, closeSnackbar as closeSnackbarAction } from 'store/actions'
import { useDispatch } from 'store'
import { useTheme } from 'themes'
import { StrictOmit } from 'ts-essentials'

// material-ui
import { ExpandMore } from '@mui/icons-material'
import {
    Box,
    List,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Paper,
    Popper,
    Chip,
    Stack,
    Typography,
    Button,
    IconButton,
    PopperProps,
    AccordionProps
} from '@mui/material'

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar'
import moment from 'moment'
import ReactJson from 'react-json-view'
import { reducer } from 'store'
// project imports
import { MainCard, Transitions, AttachmentDialog, HTMLDialog, ExpandDataDialog } from 'ui-component'

// hooks
import { useConfirm } from 'hooks'

// icon
import { IconTrash, IconX, IconArrowsMaximize } from '@tabler/icons'

// API
import { executionsApi, workflowsApi } from 'api'

// utils
import { copyToClipboard, useNotifier } from 'utils'

// ==============================|| EXECUTIONS ||============================== //

export const Executions = ({
    workflowShortId,
    execution,
    executionCount,
    isExecutionOpen,
    anchorEl
}: {
    workflowShortId: string
    execution: (StrictOmit<reducer.canvas.Execution, 'executionData'> & { executionData: string })[]
    executionCount: number
    isExecutionOpen: boolean
    anchorEl: PopperProps['anchorEl']
}) => {
    const theme = useTheme()
    const [expanded, setExpanded] = useState<string | false>(false)
    const [open, setOpen] = useState(false)
    const [showHTMLDialog, setShowHTMLDialog] = useState(false)
    const [HTMLDialogProps, setHTMLDialogProps] = useState<ComponentProps<typeof HTMLDialog>['dialogProps']>({})
    const [showAttachmentDialog, setShowAttachmentDialog] = useState(false)
    const [attachmentDialogProps, setAttachmentDialogProps] = useState<ComponentProps<typeof AttachmentDialog>['dialogProps']>({})
    const [showExpandDialog, setShowExpandDialog] = useState(false)
    const [expandDialogProps, setExpandDialogProps] = useState<ComponentProps<typeof ExpandDataDialog>['dialogProps'] | null>(null)

    const dispatch = useDispatch()
    const varPrevOpen = useRef(open)
    const { confirm } = useConfirm()

    useNotifier()
    const enqueueSnackbar = (...args: Parameters<typeof enqueueSnackbarAction>) => dispatch(enqueueSnackbarAction(...args))
    const closeSnackbar = (...args: Parameters<typeof closeSnackbarAction>) => dispatch(closeSnackbarAction(...args))

    const handleAccordionChange =
        (executionShortId: string): AccordionProps['onChange'] =>
        (event, isExpanded) => {
            setExpanded(isExpanded ? executionShortId : false)
        }

    const setChipColor = (execState: reducer.canvas.State) => {
        if (execState === 'INPROGRESS') return theme.palette.warning.dark
        if (execState === 'FINISHED') return theme.palette.success.dark
        if (execState === 'ERROR') return theme.palette.error.dark
        if (execState === 'TERMINATED' || execState === 'TIMEOUT') return theme.palette.grey['700']
        return theme.palette.primary.dark
    }

    const setChipBgColor = (execState: reducer.canvas.State) => {
        if (execState === 'INPROGRESS') return theme.palette.warning.light
        if (execState === 'FINISHED') return theme.palette.success.light
        if (execState === 'ERROR') return theme.palette.error.light
        if (execState === 'TERMINATED' || execState === 'TIMEOUT') return theme.palette.grey['300']
        return theme.palette.primary.light
    }

    const openAttachmentDialog = (executionData: reducer.canvas.ExecutionData['data']) => {
        const dialogProp = {
            title: 'Attachments',
            executionData
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

    const onExpandDialogClicked = (executionData: reducer.canvas.ExecutionData['data'], nodeLabel: string) => {
        const dialogProp = {
            title: `Execution Data: ${nodeLabel}`,
            data: executionData
        }
        setExpandDialogProps(dialogProp)
        setShowExpandDialog(true)
    }

    const deleteExecution = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, executionShortId: string) => {
        e.stopPropagation()
        const confirmPayload = {
            title: `Delete`,
            description: `Delete execution ${executionShortId}?`,
            confirmButtonName: 'Delete',
            cancelButtonName: 'Cancel'
        }
        const isConfirmed = await confirm(confirmPayload)

        if (isConfirmed) {
            try {
                const executionResp = await executionsApi.deleteExecution(executionShortId)
                if (executionResp.data) {
                    const workflowResponse = await workflowsApi.getSpecificWorkflow(workflowShortId)
                    if (workflowResponse.data) dispatch({ type: SET_WORKFLOW, workflow: workflowResponse.data })
                }
                enqueueSnackbar({
                    message: 'Execution deleted!',
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
            } catch (error: any) {
                const errorData = error?.response?.data || `${error?.response?.status}: ${error?.response?.statusText}`
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

    // Handle Accordian
    useEffect(() => {
        varPrevOpen.current = open
    }, [open])

    useEffect(() => {
        setOpen(isExecutionOpen)
    }, [isExecutionOpen])

    return (
        <>
            <Popper
                placement='bottom-end'
                open={open}
                anchorEl={anchorEl}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [170, 20]
                            }
                        }
                    ]
                }}
                sx={{ zIndex: 1000 }}
            >
                {({ TransitionProps }) => (
                    <Transitions in={open} {...TransitionProps}>
                        <Paper>
                            <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                <Box sx={{ p: 2 }}>
                                    <Stack>
                                        <Typography variant='h4'>{executionCount} Executions</Typography>
                                    </Stack>
                                </Box>
                                <PerfectScrollbar style={{ height: '100%', maxHeight: 'calc(100vh - 250px)', overflowX: 'hidden' }}>
                                    {executionCount === 0 && execution.length === 0 && <Box sx={{ p: 2 }}>No executions yet</Box>}

                                    {executionCount > 0 && execution.length > 0 && (
                                        <Box sx={{ p: 2 }}>
                                            <List
                                                sx={{
                                                    width: '100%',
                                                    maxWidth: 330,
                                                    py: 0,
                                                    borderRadius: '10px',
                                                    [theme.breakpoints.down('md')]: {
                                                        maxWidth: 300
                                                    },
                                                    '& .MuiListItemSecondaryAction-root': {
                                                        top: 22
                                                    },
                                                    '& .MuiDivider-root': {
                                                        my: 0
                                                    },
                                                    '& .list-container': {
                                                        pl: 7
                                                    }
                                                }}
                                            >
                                                {execution &&
                                                    execution.map((exec, index) => (
                                                        <Box key={index}>
                                                            <Accordion
                                                                expanded={expanded === exec.shortId}
                                                                onChange={handleAccordionChange(exec.shortId)}
                                                            >
                                                                <AccordionSummary
                                                                    expandIcon={<ExpandMore />}
                                                                    aria-controls={`${exec.shortId}-content`}
                                                                    id={`${exec.shortId}-header`}
                                                                >
                                                                    <Stack sx={{ p: 1, mr: 1 }} direction='column'>
                                                                        <Stack sx={{ mb: 1, alignItems: 'center' }} direction='row'>
                                                                            <Typography variant='h5'>{exec.shortId}</Typography>
                                                                            {exec.state && (
                                                                                <Chip
                                                                                    sx={{
                                                                                        color: setChipColor(exec.state),
                                                                                        backgroundColor: setChipBgColor(exec.state),
                                                                                        ml: 1
                                                                                    }}
                                                                                    label={exec.state}
                                                                                />
                                                                            )}
                                                                        </Stack>
                                                                        <Stack sx={{ mb: -1, alignItems: 'center' }} direction='row'>
                                                                            <Typography
                                                                                variant='h6'
                                                                                sx={{ color: theme.palette.grey['500'] }}
                                                                            >
                                                                                {moment(exec.createdDate).format(
                                                                                    'MMMM Do YYYY, h:mm:ss A z'
                                                                                )}
                                                                            </Typography>
                                                                            <IconButton
                                                                                size='small'
                                                                                sx={{ height: 25, width: 25, ml: 1 }}
                                                                                title='Delete Execution'
                                                                                color='error'
                                                                                onClick={(e) => deleteExecution(e, exec.shortId)}
                                                                            >
                                                                                <IconTrash />
                                                                            </IconButton>
                                                                        </Stack>
                                                                    </Stack>
                                                                </AccordionSummary>
                                                                {(
                                                                    JSON.parse(
                                                                        exec.executionData
                                                                    ) as reducer.canvas.Execution['executionData']
                                                                ).map((execData, execDataIndex) => (
                                                                    <AccordionDetails key={execDataIndex}>
                                                                        <Box
                                                                            sx={{
                                                                                p: 2,
                                                                                backgroundColor: theme.palette.secondary.light,
                                                                                borderRadius: `15px`,
                                                                                position: 'relative'
                                                                            }}
                                                                            key={execDataIndex}
                                                                        >
                                                                            <Typography sx={{ p: 1 }} variant='h5'>
                                                                                {execData.nodeLabel}
                                                                            </Typography>
                                                                            <ReactJson
                                                                                collapsed
                                                                                src={execData.data}
                                                                                enableClipboard={(e) => copyToClipboard(e)}
                                                                            />
                                                                            <IconButton
                                                                                size='small'
                                                                                sx={{
                                                                                    height: 25,
                                                                                    width: 25,
                                                                                    position: 'absolute',
                                                                                    top: 5,
                                                                                    right: 5
                                                                                }}
                                                                                title='Expand Data'
                                                                                color='primary'
                                                                                onClick={() =>
                                                                                    onExpandDialogClicked(execData.data, execData.nodeLabel)
                                                                                }
                                                                            >
                                                                                <IconArrowsMaximize />
                                                                            </IconButton>
                                                                            <div>
                                                                                {execData.data.map((execObj, execObjIndex) => (
                                                                                    <div key={execObjIndex}>
                                                                                        {execObj.html && (
                                                                                            <Typography sx={{ p: 1, mt: 2 }} variant='h5'>
                                                                                                HTML
                                                                                            </Typography>
                                                                                        )}
                                                                                        {execObj.html && (
                                                                                            <div
                                                                                                style={{
                                                                                                    width: '100%',
                                                                                                    height: '100%',
                                                                                                    maxHeight: 400,
                                                                                                    overflow: 'auto',
                                                                                                    backgroundColor: 'white',
                                                                                                    borderRadius: 5
                                                                                                }}
                                                                                                dangerouslySetInnerHTML={{
                                                                                                    __html: execObj.html
                                                                                                }}
                                                                                            />
                                                                                        )}
                                                                                        {execObj.html && (
                                                                                            <Button
                                                                                                sx={{ mt: 1 }}
                                                                                                size='small'
                                                                                                variant='contained'
                                                                                                onClick={() =>
                                                                                                    openHTMLDialog(execData.data)
                                                                                                }
                                                                                            >
                                                                                                View HTML
                                                                                            </Button>
                                                                                        )}

                                                                                        {execObj.attachments && (
                                                                                            <Typography
                                                                                                sx={{ p: 1, pb: 0, mt: 2 }}
                                                                                                variant='h5'
                                                                                            >
                                                                                                Attachments
                                                                                            </Typography>
                                                                                        )}
                                                                                        {execObj.attachments &&
                                                                                            execObj.attachments.map(
                                                                                                (attachment, attchIndex) => (
                                                                                                    <div key={attchIndex}>
                                                                                                        <Typography
                                                                                                            sx={{ p: 1 }}
                                                                                                            variant='h6'
                                                                                                        >
                                                                                                            Item {execObjIndex} |{' '}
                                                                                                            {attachment.filename
                                                                                                                ? attachment.filename
                                                                                                                : `Attachment ${attchIndex}`}
                                                                                                        </Typography>
                                                                                                        <embed
                                                                                                            src={attachment.content}
                                                                                                            width='100%'
                                                                                                            height='100%'
                                                                                                            style={{
                                                                                                                borderStyle: 'solid'
                                                                                                            }}
                                                                                                            type={attachment.contentType}
                                                                                                        />
                                                                                                        <Button
                                                                                                            size='small'
                                                                                                            variant='contained'
                                                                                                            onClick={() =>
                                                                                                                openAttachmentDialog(
                                                                                                                    execData.data
                                                                                                                )
                                                                                                            }
                                                                                                        >
                                                                                                            View Attachment
                                                                                                        </Button>
                                                                                                    </div>
                                                                                                )
                                                                                            )}
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </Box>
                                                                    </AccordionDetails>
                                                                ))}
                                                            </Accordion>
                                                        </Box>
                                                    ))}
                                            </List>
                                        </Box>
                                    )}
                                </PerfectScrollbar>
                            </MainCard>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
            <AttachmentDialog
                show={showAttachmentDialog}
                dialogProps={attachmentDialogProps}
                onCancel={() => setShowAttachmentDialog(false)}
            ></AttachmentDialog>
            <HTMLDialog show={showHTMLDialog} dialogProps={HTMLDialogProps} onCancel={() => setShowHTMLDialog(false)}></HTMLDialog>
            {expandDialogProps && ( // ! logic changed
                <ExpandDataDialog show={showExpandDialog} dialogProps={expandDialogProps} onCancel={() => setShowExpandDialog(false)} />
            )}
        </>
    )
}
