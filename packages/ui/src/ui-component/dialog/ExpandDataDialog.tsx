import { createPortal } from 'react-dom'

import { Dialog, DialogContent, DialogTitle, DialogProps } from '@mui/material'
import ReactJson, { OnCopyProps } from 'react-json-view'

// utils
import { copyToClipboard, Node } from 'utils'

export type Input = { name: string; type: 'json' | 'string' | 'number' | 'code'; placeholder: string }

export type ExpandDialogProps = {
    title: string
    data: object
    node?: Node
}

export const ExpandDataDialog = (
    props: {
        show: boolean
        dialogProps: ExpandDialogProps
        onCancel: DialogProps['onClose']
    } & ({ enableClipboard: boolean; onCopyClick: (e: OnCopyProps, node: Node) => void } | { enableClipboard?: undefined })
) => {
    const portalElement = document.getElementById('portal')!
    const {
        show,
        dialogProps: { node, title, data },
        onCancel,
        enableClipboard
    } = props
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
                {title}
            </DialogTitle>
            <DialogContent>
                {node && ( // ! logic changed
                    <ReactJson src={data} enableClipboard={(e) => (enableClipboard ? props.onCopyClick(e, node) : copyToClipboard(e))} />
                )}
            </DialogContent>
        </Dialog>
    ) : null

    return createPortal(component, portalElement)
}
