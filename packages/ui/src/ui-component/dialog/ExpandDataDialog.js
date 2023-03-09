import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import ReactJson from 'react-json-view'

// utils
import { copyToClipboard } from 'utils/genericHelper'

const ExpandDataDialog = ({ show, dialogProps, onCancel, onCopyClick, enableClipboard }) => {
    const portalElement = document.getElementById('portal')
    const customization = useSelector((state) => state.customization)
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
                {!enableClipboard && (
                    <ReactJson
                        theme={customization.isDarkMode ? 'apathy:inverted' : 'apathy'}
                        src={dialogProps.data}
                        enableClipboard={(e) => copyToClipboard(e)}
                    />
                )}
                {enableClipboard && (
                    <ReactJson
                        t
                        theme={customization.isDarkMode ? 'apathy:inverted' : 'apathy'}
                        src={dialogProps.data}
                        enableClipboard={(e) => onCopyClick(e, dialogProps.node)}
                    />
                )}
            </DialogContent>
        </Dialog>
    ) : null

    return createPortal(component, portalElement)
}

ExpandDataDialog.propTypes = {
    show: PropTypes.bool,
    dialogProps: PropTypes.object,
    onCancel: PropTypes.func,
    onCopyClick: PropTypes.func,
    enableClipboard: PropTypes.bool
}

export default ExpandDataDialog
