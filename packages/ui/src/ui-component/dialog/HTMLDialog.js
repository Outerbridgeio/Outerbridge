import { createPortal } from 'react-dom';
import { useState } from 'react';
import PropTypes from 'prop-types';

import { 
    Dialog, 
    DialogContent, 
    DialogTitle,
    Tabs,
    Tab,
    Box,
} from '@mui/material';


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
            {value === index && (
                <Box sx={{ p: 1 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}
  
TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};
  
function a11yProps(index) {
    return {
        id: `attachment-tab-${index}`,
        'aria-controls': `attachment-tabpanel-${index}`,
    };
}

const HTMLDialog = ({
    show,
    dialogProps,
    onCancel,
}) => {

    const portalElement = document.getElementById('portal');

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
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
                    {dialogProps.executionData.map((execObj, execObjIndex) =>
                        <Tab key={execObjIndex} label={`Item ${execObjIndex}`} {...a11yProps(execObjIndex)} />
                    )}
                </Tabs>
                {dialogProps.executionData.map((execObj, execObjIndex) =>
                    <TabPanel key={execObjIndex} value={value} index={execObjIndex}>
                        {execObj.html && <div style={{ width: '100%', height: '100%', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: execObj.html }} />}
                        {!execObj.html && <div>No HTML</div>}
                    </TabPanel>
                )}
            </DialogContent>
        </Dialog>
    ) : null;

    return createPortal(component, portalElement);
}

HTMLDialog.propTypes = {
    show: PropTypes.bool, 
    dialogProps: PropTypes.object,
    onCancel: PropTypes.func,
};

export default HTMLDialog;
