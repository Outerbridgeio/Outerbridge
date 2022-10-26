import { useState, useRef, useEffect, ComponentProps } from 'react'
import { useTheme } from 'themes'
import { Node } from 'utils'

// material-ui
import { ExpandMore } from '@mui/icons-material'
import {
    Box,
    Fab,
    List,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Paper,
    Popper,
    Stack,
    Typography,
    IconButton,
    PopperProps,
    FabProps,
    AccordionProps
} from '@mui/material'

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar'
import ReactJson, { OnCopyProps } from 'react-json-view'

// project imports
import { MainCard, Transitions, ExpandDataDialog } from 'ui-component'

// icons
import { IconX, IconArrowsMaximize } from '@tabler/icons'

// ==============================|| VARIABLE SELECTOR ||============================== //

const isPositiveNumeric = (value: string | null | undefined) => /^\d+$/.test(`${value}`)

export const VariableSelector = ({
    nodes,
    isVariableSelectorOpen,
    anchorEl,
    onVariableSelected,
    handleClose
}: {
    nodes: Node[]
    isVariableSelectorOpen: boolean
    anchorEl: PopperProps['anchorEl']
    onVariableSelected: (value: string) => void
    handleClose: FabProps['onClick']
}) => {
    const theme = useTheme()
    const [expanded, setExpanded] = useState<string | false>(false)
    const [open, setOpen] = useState(false)
    const [showExpandDialog, setShowExpandDialog] = useState(false)
    const [expandDialogProps, setExpandDialogProps] = useState<ComponentProps<typeof ExpandDataDialog>['dialogProps'] | null>(null) // !logic changed

    const varPrevOpen = useRef(open)

    const handleAccordionChange =
        (nodeLabel: string): AccordionProps['onChange'] =>
        (event, isExpanded) => {
            setExpanded(isExpanded ? nodeLabel : false)
        }

    const onClipboardCopy = (e: OnCopyProps, node: Node) => {
        const namespaces = e.namespace
        let returnVariablePath = `${node.id}`
        for (let i = 0; i < namespaces.length; i += 1) {
            const namespace = namespaces[i]
            if (namespace !== 'root') {
                if (isPositiveNumeric(namespace)) {
                    if (returnVariablePath.endsWith('.')) {
                        returnVariablePath = returnVariablePath.substring(0, returnVariablePath.length - 1)
                    }
                    returnVariablePath += `[${namespace}]`
                } else {
                    returnVariablePath += namespace
                }
                if (i !== namespaces.length - 1) {
                    returnVariablePath += '.'
                }
            }
        }
        onVariableSelected(returnVariablePath)
    }

    const onExpandDialogClicked = (data: Record<string, unknown>, node: Node) => {
        const dialogProp = {
            title: `Variable Data: ${node.data.label}`,
            data,
            node
        }
        setExpandDialogProps(dialogProp)
        setShowExpandDialog(true)
    }

    // Handle Accordian
    useEffect(() => {
        varPrevOpen.current = open
    }, [open])

    useEffect(() => {
        setOpen(isVariableSelectorOpen)
    }, [isVariableSelectorOpen])

    return (
        <>
            <Popper
                placement='right-start'
                open={open}
                role={undefined}
                transition
                anchorEl={anchorEl}
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [55, 350]
                            }
                        }
                    ]
                }}
                sx={{ zIndex: 900, width: 350 }}
            >
                {({ TransitionProps }) => (
                    <Transitions in={open} {...TransitionProps}>
                        <Paper>
                            <Fab
                                sx={{
                                    minHeight: 30,
                                    height: 30,
                                    width: 30,
                                    backgroundColor: theme.palette.secondary.light,
                                    color: theme.palette.secondary.main,
                                    position: 'absolute',
                                    right: -10,
                                    top: -10
                                }}
                                size='small'
                                onClick={handleClose}
                            >
                                <IconX />
                            </Fab>
                            <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                <Box sx={{ p: 2 }}>
                                    <Stack>
                                        <Typography variant='h4'>Variable Selector</Typography>
                                    </Stack>
                                </Box>
                                <PerfectScrollbar style={{ height: '100%', maxHeight: 'calc(100vh - 250px)', overflowX: 'hidden' }}>
                                    {nodes && nodes.length === 0 && <Box sx={{ p: 2 }}>No variables</Box>}

                                    {nodes && nodes.length > 0 && (
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
                                                {nodes.map((node, index) => (
                                                    <Box key={index}>
                                                        <Accordion
                                                            expanded={expanded === node.data.label}
                                                            onChange={handleAccordionChange(node.data.label)}
                                                        >
                                                            <AccordionSummary
                                                                expandIcon={<ExpandMore />}
                                                                aria-controls={`${node.data.label}-content`}
                                                                id={`${node.data.label}-header`}
                                                            >
                                                                <Typography variant='h5'>{node.data.label}</Typography>
                                                            </AccordionSummary>
                                                            <AccordionDetails>
                                                                <div style={{ position: 'relative' }}>
                                                                    <ReactJson
                                                                        collapsed
                                                                        src={node.data.outputResponses?.output || {}}
                                                                        enableClipboard={(e) => onClipboardCopy(e, node)}
                                                                    />
                                                                    <IconButton
                                                                        size='small'
                                                                        sx={{
                                                                            height: 25,
                                                                            width: 25,
                                                                            position: 'absolute',
                                                                            top: -5,
                                                                            right: 5
                                                                        }}
                                                                        title='Expand Variable'
                                                                        color='primary'
                                                                        onClick={() =>
                                                                            onExpandDialogClicked(
                                                                                node.data.outputResponses?.output || {},
                                                                                node
                                                                            )
                                                                        }
                                                                    >
                                                                        <IconArrowsMaximize />
                                                                    </IconButton>
                                                                </div>
                                                            </AccordionDetails>
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
            {expandDialogProps && ( // ! logic changed
                <ExpandDataDialog
                    enableClipboard
                    show={showExpandDialog}
                    dialogProps={expandDialogProps}
                    onCancel={() => setShowExpandDialog(false)}
                    onCopyClick={(e, node) => {
                        onClipboardCopy(e, node)
                        setShowExpandDialog(false)
                    }}
                />
            )}
        </>
    )
}
