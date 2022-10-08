import { createPortal } from 'react-dom';
import { useState } from 'react';
import PropTypes from 'prop-types';

import { Dialog, DialogContent, DialogTitle, Tabs, Tab, Box, Typography } from '@mui/material';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`attachment-tabpanel-${index}`}
            aria-labelledby={`attachment-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired
};

function a11yProps(index) {
    return {
        id: `attachment-tab-${index}`,
        'aria-controls': `attachment-tabpanel-${index}`
    };
}

const AttachmentDialog = ({ show, dialogProps, onCancel }) => {
    const portalElement = document.getElementById('portal');

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const formatBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    const component = show ? (
        <Dialog
            open={show}
            onClose={onCancel}
            fullWidth
            maxWidth="lg"
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle sx={{ fontSize: '1rem' }} id="alert-dialog-title">
                {dialogProps.title}
            </DialogTitle>
            <DialogContent>
                <Tabs value={value} onChange={handleChange} aria-label="attachment tabs">
                    {dialogProps.executionData.map((execObj, execObjIndex) => (
                        <Tab key={execObjIndex} label={`Item ${execObjIndex}`} {...a11yProps(execObjIndex)} />
                    ))}
                </Tabs>
                {dialogProps.executionData.map((execObj, execObjIndex) => (
                    <TabPanel key={execObjIndex} value={value} index={execObjIndex}>
                        {execObj.attachments &&
                            execObj.attachments.map((attachment, attchIndex) => (
                                <div key={attchIndex} style={{ marginBottom: 10 }}>
                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Typography sx={{ p: 1 }} variant="h5">
                                            {attachment.filename ? attachment.filename : `Attachment ${attchIndex}`} |{' '}
                                            {attachment.contentType} {attachment.size ? ` | ${formatBytes(attachment.size)}` : ''}
                                        </Typography>
                                        <a href={attachment.content} download rel="noopener noreferrer" target="_blank">
                                            Download File
                                        </a>
                                    </div>
                                    <embed
                                        src={attachment.content}
                                        width="100%"
                                        height="100%"
                                        type={attachment.contentType}
                                        style={{ borderStyle: 'solid', minHeight: '100vh', minWidth: '100vh' }}
                                    />
                                </div>
                            ))}
                        {!execObj.attachments && <div>No Attachment</div>}
                    </TabPanel>
                ))}
            </DialogContent>
        </Dialog>
    ) : null;

    return createPortal(component, portalElement);
};

AttachmentDialog.propTypes = {
    show: PropTypes.bool,
    dialogProps: PropTypes.object,
    onCancel: PropTypes.func
};

export default AttachmentDialog;
