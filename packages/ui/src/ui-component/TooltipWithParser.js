import { Info } from '@mui/icons-material'
import { IconButton, Tooltip } from '@mui/material'
import parser from 'html-react-parser'
import PropTypes from 'prop-types'

export const TooltipWithParser = ({ title }) => {
    return (
        <Tooltip title={parser(title)} placement='right'>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <IconButton sx={{ height: 25, width: 25 }}>
                    <Info style={{ height: 18, width: 18 }} />
                </IconButton>
            </div>
        </Tooltip>
    )
}

TooltipWithParser.propTypes = {
    title: PropTypes.node
}
