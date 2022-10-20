import { createPortal } from 'react-dom'

import { Dialog, DialogContent, DialogTitle, DialogProps } from '@mui/material'
import ReactJson, { OnCopyProps } from 'react-json-view'

// utils
import { copyToClipboard, Node } from 'utils'

export type Input = { name: string; type: 'json' | 'string' | 'number' | 'code'; placeholder: string }

export type ExpandDialogProps = {
    title: string
    data: Record<string, unknown>
    node: Node
}

export const ExpandDataDialog = ({
    show,
    dialogProps,
    onCancel,
    onCopyClick,
    enableClipboard
}: {
    show: boolean
    enableClipboard: boolean
    dialogProps: ExpandDialogProps
    onCopyClick: (e: OnCopyProps, node: Node) => void
    onCancel: DialogProps['onClose']
}) => {
    const portalElement = document.getElementById('portal')!

    const component = show ? (
        <Dialog
            open={show}
            fullWidth
            maxWidth='md'
            onClose={onCancel}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
        >
            <DialogTitle sx={{ fontSize: '1rem' }} id='alert-dialog-title'>
                {dialogProps.title}
            </DialogTitle>
            <DialogContent>
                <ReactJson
                    src={dialogProps.data}
                    enableClipboard={(e) => (enableClipboard ? onCopyClick(e, dialogProps.node) : copyToClipboard(e))}
                />
            </DialogContent>
        </Dialog>
    ) : null

    return createPortal(component, portalElement)
}
