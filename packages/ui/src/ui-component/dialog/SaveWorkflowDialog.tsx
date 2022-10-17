import { createPortal } from 'react-dom'
import { useState, useEffect, ComponentProps } from 'react'

import { Button, Dialog, DialogActions, DialogContent, OutlinedInput, DialogTitle } from '@mui/material'

export const SaveWorkflowDialog = ({
    show,
    dialogProps,
    onCancel,
    onConfirm
}: {
    show: boolean
    dialogProps: { title: string; cancelButtonName: string; confirmButtonName: string }
    onCancel: ComponentProps<typeof Button>['onClick']
    onConfirm: (value: string) => void
}) => {
    const portalElement = document.getElementById('portal')!

    const [workflowName, setWorkflowName] = useState('')
    const [isReadyToSave, setIsReadyToSave] = useState(false)

    useEffect(() => {
        if (workflowName) setIsReadyToSave(true)
        else setIsReadyToSave(false)
    }, [workflowName])

    const component = show ? (
        <Dialog
            open={show}
            fullWidth
            maxWidth='xs'
            onClose={onCancel}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
        >
            <DialogTitle sx={{ fontSize: '1rem' }} id='alert-dialog-title'>
                {dialogProps.title}
            </DialogTitle>
            <DialogContent>
                <OutlinedInput
                    sx={{ mt: 1 }}
                    id='workflow-name'
                    type='text'
                    fullWidth
                    placeholder='My New Workflow'
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>{dialogProps.cancelButtonName}</Button>
                <Button disabled={!isReadyToSave} variant='contained' onClick={() => onConfirm(workflowName)}>
                    {dialogProps.confirmButtonName}
                </Button>
            </DialogActions>
        </Dialog>
    ) : null

    return createPortal(component, portalElement)
}
