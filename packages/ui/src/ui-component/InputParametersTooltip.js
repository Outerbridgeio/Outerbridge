import { Info } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import parse from 'html-react-parser';

export const InputParameterTooltip = ({ title }) => {
    return (
        <Tooltip title={parse(title)} placement="right">
            <IconButton>
                <Info style={{ height: 18, width: 18 }} />
            </IconButton>
        </Tooltip>
    );
};
