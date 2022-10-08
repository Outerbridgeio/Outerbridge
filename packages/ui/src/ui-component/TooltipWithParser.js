import { Info } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import parser from 'html-react-parser';

export const TooltipWithParser = ({ title }) => {
    return (
        <Tooltip title={parser(title)} placement="right">
            <IconButton>
                <Info style={{ height: 18, width: 18 }} />
            </IconButton>
        </Tooltip>
    );
};
