import { createPortal } from 'react-dom'
import { useState, ComponentProps, SyntheticEvent } from 'react'

import { Dialog, DialogContent, DialogTitle, Tabs, Tab, Box, DialogProps } from '@mui/material'

function TabPanel({ children, value, index, ...other }: ComponentProps<'div'> & { index: number; value: number }) {
    return (
        <div
            role='tabpanel'
            hidden={value !== index}
            id={`attachment-tabpanel-${index}`}
            aria-labelledby={`attachment-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
        </div>
    )
}

function a11yProps(index: number) {
    return {
        id: `attachment-tab-${index}`,
        'aria-controls': `attachment-tabpanel-${index}`
    }
}

export const HTMLDialog = ({
    show,
    dialogProps,
    onCancel
}: {
    show: boolean
    dialogProps: { title: string; executionData: { html?: string }[] }
    onCancel: DialogProps['onClose']
}) => {
    const portalElement = document.getElementById('portal')!

    const [value, setValue] = useState(0)

    const handleChange = (event: SyntheticEvent<Element, Event>, newValue: number) => {
        setValue(newValue)
    }

    const component = show ? (
        <Dialog
            open={show}
            onClose={onCancel}
            fullWidth
            maxWidth='lg'
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
        >
            <DialogTitle sx={{ fontSize: '1rem' }} id='alert-dialog-title'>
                {dialogProps.title}
            </DialogTitle>
            <DialogContent>
                <Tabs value={value} onChange={handleChange} aria-label='attachment tabs'>
                    {dialogProps.executionData.map((execObj, execObjIndex) => (
                        <Tab key={execObjIndex} label={`Item ${execObjIndex}`} {...a11yProps(execObjIndex)} />
                    ))}
                </Tabs>
                {dialogProps.executionData.map((execObj, execObjIndex) => (
                    <TabPanel key={execObjIndex} value={value} index={execObjIndex}>
                        {execObj.html && (
                            <div
                                style={{ width: '100%', height: '100%', overflow: 'auto' }}
                                dangerouslySetInnerHTML={{ __html: execObj.html }}
                            />
                        )}
                        {!execObj.html && <div>No HTML</div>}
                    </TabPanel>
                ))}
            </DialogContent>
        </Dialog>
    ) : null

    return createPortal(component, portalElement)
}
