import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    Box,
    List,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Fab,
    Paper,
    Popper,
    Chip,
    Stack,
    Typography,
    Button
} from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';
import moment from 'moment';
import ReactJson from 'react-json-view'

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import AttachmentDialog from 'ui-component/dialog/AttachmentDialog';
import HTMLDialog from 'ui-component/dialog/HTMLDialog';

// icons
import { IconX } from '@tabler/icons';

// ==============================|| EXECUTIONS ||============================== //

const Executions = ({ execution, executionCount, isExecutionOpen, anchorEl, handleClose }) => {
    const theme = useTheme();
    const [expanded, setExpanded] = useState(false);
    const [open, setOpen] = useState(false);
    const [showHTMLDialog, setShowHTMLDialog] = useState(false);
    const [HTMLDialogProps, setHTMLDialogProps] = useState({});
    const [showAttachmentDialog, setShowAttachmentDialog] = useState(false);
    const [attachmentDialogProps, setAttachmentDialogProps] = useState({});

    const varPrevOpen = useRef(open);

    const handleAccordionChange = (executionShortId) => (event, isExpanded) => {
        setExpanded(isExpanded ? executionShortId : false);
    };

    const setChipColor = (execState) => {
        if (execState === 'INPROGRESS') return theme.palette.warning.dark;
        if (execState === 'FINISHED') return theme.palette.success.dark;
        if (execState === 'ERROR') return theme.palette.error.dark;
        if (execState === 'TERMINATED' || execState === 'TIMEOUT') return theme.palette.grey['700'];
        return theme.palette.primary.dark;
    }

    const setChipBgColor = (execState) => {
        if (execState === 'INPROGRESS') return theme.palette.warning.light;
        if (execState === 'FINISHED') return theme.palette.success.light;
        if (execState === 'ERROR') return theme.palette.error.light;
        if (execState === 'TERMINATED' || execState === 'TIMEOUT') return theme.palette.grey['300'];
        return theme.palette.primary.light;
    }

    const openAttachmentDialog = (executionData) => {
        const dialogProp = {
            title: 'Attachments',
            executionData
        };
        setAttachmentDialogProps(dialogProp);
        setShowAttachmentDialog(true);
    };

    const openHTMLDialog = (executionData) => {
        const dialogProp = {
            title: 'HTML',
            executionData
        };
        setHTMLDialogProps(dialogProp);
        setShowHTMLDialog(true);
    };

    // Handle Accordian
    useEffect(() => {
        varPrevOpen.current = open;

    }, [open]);

    useEffect(() => {
        setOpen(isExecutionOpen);
    }, [isExecutionOpen]);

    return (
        <>
           <Popper
                placement="bottom-end"
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
                sx={{zIndex: 1000}}
            >
                {({ TransitionProps }) => (
                    <Transitions in={open} {...TransitionProps}>
                        <Paper>
                            <Fab 
                                sx={{ 
                                    minHeight: 30, 
                                    height: 30, width: 30, 
                                    backgroundColor: theme.palette.secondary.light, 
                                    color: theme.palette.secondary.main, 
                                    position: 'absolute', 
                                    left: -15, top: -15 
                                }} 
                                size="small"
                                onClick={handleClose}
                            >
                                <IconX />
                            </Fab>
                            <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                <Box sx={{ p: 2 }}>
                                    <Stack>
                                        <Typography variant="h4">{executionCount} Executions</Typography>
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
                                            {execution && execution.map((exec, index) => (
                                                <Box key={index}>
                                                    <Accordion expanded={expanded === exec.shortId} onChange={handleAccordionChange(exec.shortId)}>
                                                        <AccordionSummary
                                                            expandIcon={<ExpandMoreIcon />}
                                                            aria-controls={`${exec.shortId}-content`}
                                                            id={`${exec.shortId}-header`}
                                                        >
                                                            <Stack sx={{ p: 1, mr: 1 }} direction="column">
                                                                <Stack sx={{ mb: 1, alignItems: 'center' }} direction="row">
                                                                    <Typography variant="h5">
                                                                        {exec.shortId}
                                                                    </Typography>
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
                                                                <Typography variant="h6" sx={{ color: theme.palette.grey['500'] }}>
                                                                    {moment(exec.createdDate).format('MMMM Do YYYY, h:mm:ss A z')}
                                                                </Typography>
                                                            </Stack>
                                                        </AccordionSummary>
                                                        {JSON.parse(exec.executionData).map((execData, execDataIndex) => (
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
                                                                <Typography sx={{p: 1}} variant="h5">
                                                                    {execData.nodeLabel} 
                                                                </Typography>
                                                                <ReactJson 
                                                                    collapsed 
                                                                    src={execData.data}
                                                                />
                                                                <div>
                                                                    {execData.data.map((execObj, execObjIndex) =>
                                                                        <div key={execObjIndex}>

                                                                            {execObj.html && (
                                                                            <Typography sx={{p: 1, mt: 2}} variant="h5">
                                                                                HTML
                                                                            </Typography>)}
                                                                            {execObj.html && <div style={{ width: '100%', height: '100%', maxHeight: 400, overflow: 'auto', backgroundColor: 'white', borderRadius: 5 }} dangerouslySetInnerHTML={{ __html: execObj.html }} />}
                                                                            {execObj.html && <Button sx={{ mt: 1}} size="small" variant="contained" onClick={() => openHTMLDialog(execData.data)}>View HTML</Button>}

                                                                            {execObj.attachments && (
                                                                            <Typography sx={{p: 1, pb: 0, mt: 2}} variant="h5">
                                                                                Attachments
                                                                            </Typography>)}
                                                                            {execObj.attachments && execObj.attachments.map((attachment, attchIndex) =>
                                                                                <div key={attchIndex}>
                                                                                    <Typography sx={{p: 1}} variant="h6">
                                                                                        Item {execObjIndex} | {attachment.filename ? attachment.filename : `Attachment ${attchIndex}`}
                                                                                    </Typography>
                                                                                    <embed
                                                                                        src={attachment.content}
                                                                                        width="100%"
                                                                                        height="100%"
                                                                                        style={{ borderStyle: "solid" }}
                                                                                        type={attachment.contentType}
                                                                                    />
                                                                                    <Button size="small" variant="contained" onClick={() => openAttachmentDialog(execData.data)}>View Attachment</Button>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
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
            <HTMLDialog
                show={showHTMLDialog}
                dialogProps={HTMLDialogProps}
                onCancel={() => setShowHTMLDialog(false)}
            ></HTMLDialog>
        </>
    );
};

Executions.propTypes = {
    execution: PropTypes.array,
    executionCount: PropTypes.number,
    isExecutionOpen: PropTypes.bool,
    anchorEl: PropTypes.any,
    handleClose: PropTypes.func,
};

export default Executions;
