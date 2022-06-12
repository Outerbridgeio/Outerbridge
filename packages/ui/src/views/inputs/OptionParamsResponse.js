import PropTypes from 'prop-types';

// material-ui
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// third party
import ReactJson from 'react-json-view';

// ==============================|| OPTION PARAMS RESPONSE ||============================== //

const OptionParamsResponse = ({
    value,
    options,
}) => {

    const theme = useTheme();

    const getSelectedValue = (value) => options.find((option) => option.name === value);

    const getSelectedOptionInputParams = (value) => {
        const selectedOption = options.find((option) => option.name === value);
        if (selectedOption) {
            return selectedOption.inputParameters || '';
        }
        return '';
    }

    const getSelectedOptionExampleParams = (value) => {
        const selectedOption = options.find((option) => option.name === value);
        if (selectedOption) {
            return selectedOption.exampleParameters || '';
        }
        return '';
    }

    const getSelectedOptionExampleResponse = (value) => {
        const selectedOption = options.find((option) => option.name === value);
        if (selectedOption) {
            return selectedOption.exampleResponse || '';
        }
        return '';
    }

    return (
        <>
            {getSelectedValue(value) && getSelectedOptionInputParams(value) && (
                <Box 
                    sx={{
                        p: 1,
                        mt: 2,
                        backgroundColor: theme.palette.secondary.light, 
                        borderRadius: `15px`,
                        position: 'relative'
                    }}
                >
                    <Typography sx={{p: 1}} variant="h6">
                        Parameters
                    </Typography>
                    <div dangerouslySetInnerHTML={{ __html: getSelectedOptionInputParams(value) }} />
                </Box>
            )}
            
            {getSelectedValue(value) && getSelectedOptionExampleParams(value) && (
                <Box 
                    sx={{
                        p: 1,
                        mt: 2, 
                        backgroundColor: theme.palette.secondary.light, 
                        borderRadius: `15px`,
                        position: 'relative'
                    }}
                >
                    <Typography sx={{p: 1}} variant="h6">
                        Example Parameters
                    </Typography>
                    <ReactJson 
                        collapsed 
                        src={JSON.parse(getSelectedOptionExampleParams(value))}
                    />
                </Box>
            )}

            {getSelectedValue(value) && getSelectedOptionExampleResponse(value) && (
                <Box 
                    sx={{
                        p: 1,
                        mt: 2, 
                        backgroundColor: theme.palette.secondary.light, 
                        borderRadius: `15px`,
                        position: 'relative'
                    }}
                >
                    <Typography sx={{p: 1}} variant="h6">
                        Example Response
                    </Typography>
                    <ReactJson 
                        collapsed 
                        src={getSelectedOptionExampleResponse(value)}
                    />
                </Box>
            )}
        </>
    );
}

OptionParamsResponse.propTypes = {
    value: PropTypes.string,
    options: PropTypes.array,
};

export default OptionParamsResponse;
