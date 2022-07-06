import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

// material-ui
import {
    Box,
    Switch,
    Fab,
    FormControl,
    Tooltip,
    OutlinedInput,
    Popper,
    TextField,
    Typography,
    Stack,
    IconButton,
} from '@mui/material';
import { Info } from '@mui/icons-material';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import { useTheme, styled } from '@mui/material/styles';

// icons
import { IconX } from '@tabler/icons';

const StyledPopper = styled(Popper)({
    boxShadow: '0px 8px 10px -5px rgb(0 0 0 / 20%), 0px 16px 24px 2px rgb(0 0 0 / 14%), 0px 6px 30px 5px rgb(0 0 0 / 12%)',
    borderRadius: '10px',
    [`& .${autocompleteClasses.listbox}`]: {
        boxSizing: 'border-box',
        '& ul': {
            padding: 10,
            margin: 10,
        },
    },
});

// ==============================|| ARRAY INPUT PARAMETERS ||============================== //

const ArrayInputParameters = ({ 
    initialValues, 
    arrayParams,
    paramsType,
    arrayGroupName,
    errors, 
    onArrayInputChange, 
    onArrayInputBlur, 
    onArrayItemRemove,
    onArrayItemMouseUp
}) => {
     
    const theme = useTheme();
    const customization = useSelector((state) => state.customization);

    const processUpdateValues = (inputValue, inputName, values, index) => {
        const updateArrayValues = {
            ...values,
            [inputName]: inputValue
        };
        const updateInitialValues = initialValues;
        updateInitialValues[index] = updateArrayValues;
        return updateInitialValues;
    };

    const onInputChange = (inputValue, inputName, values, index) => {
        const updateInitialValues = processUpdateValues(inputValue, inputName, values, index);
        onArrayInputChange(updateInitialValues);
    }

    const onInputBlur = (inputValue, inputName, values, index) => {
        const updateInitialValues = processUpdateValues(inputValue, inputName, values, index);
        onArrayInputBlur(updateInitialValues);
    }

    const onRemoveClick = (index) => {
        const updateInitialValues = initialValues;
        updateInitialValues.splice(index, 1);
        onArrayItemRemove(updateInitialValues);
        onArrayItemMouseUp(false);
    }

    const onMouseUp = (e, inputName, valueIndex) => {
        const cursorPosition = e.target.selectionEnd;
        const textBeforeCursorPosition = e.target.value.substring(0, cursorPosition);
        const textAfterCursorPosition = e.target.value.substring(cursorPosition, e.target.value.length);
        const path = `${paramsType}.${arrayGroupName}[${valueIndex}].${inputName}`;
        const body = {
            textBeforeCursorPosition, 
            textAfterCursorPosition,
            path,
            paramsType
        };
        onArrayItemMouseUp(true, body);
    }

    const findMatchingOptions = (options, value) => options.find((option) => option.name === value);

    const getDefaultOptionValue = () => ('');

    return (
        <>
            {arrayParams.map((_, index) => {
                
                const params = arrayParams[index] || [];
                const values = initialValues[index] || {};

                return (
                    <Box 
                        sx={{
                            p: 2, 
                            mt: 2, 
                            mb: 2, 
                            backgroundColor: theme.palette.secondary.light, 
                            borderRadius: `${customization.borderRadius}px`,
                            position: 'relative'
                        }}
                        key={index}
                    >
                        {arrayParams.length > 1 && (
                        <Fab 
                            sx={{ 
                                minHeight: 30, 
                                height: 30, width: 30, 
                                backgroundColor: theme.palette.secondary.light, 
                                color: theme.palette.secondary.main, 
                                position: 'absolute', 
                                right: -10, top: -10 
                            }} 
                            size="small" 
                            onClick={() => onRemoveClick(index)}
                        >
                            <IconX />
                        </Fab>
                        )}

                    {params.map((input, paramIndex) => {

                        if (input.type === 'string' || input.type === 'password' || input.type === 'number') {

                            const inputName = input.name;

                            return (
                            <FormControl 
                                key={`${inputName}_${paramIndex}`}
                                fullWidth 
                                sx={{ mb: 1, mt: 1 }}
                                error={errors && errors.length > 0 && errors[index] ?
                                    Boolean(errors[index][inputName]) : false
                                }
                            >
                                <Stack direction="row">
                                    <Typography variant="overline">{input.label}</Typography>
                                    {input.description && (
                                    <Tooltip title={input.description} placement="right">
                                        <IconButton ><Info style={{ height: 18, width: 18 }}/></IconButton>
                                    </Tooltip>
                                    )}
                                </Stack>
                                <OutlinedInput
                                    id={inputName}
                                    type={input.type === 'string' ? 'text' : input.type}
                                    value={values[inputName] || ''}
                                    name={inputName}
                                    onBlur={(e) => {
                                        const inputValue = e.target.value;
                                        onInputBlur(inputValue, inputName, values, index);
                                    }}
                                    onChange={(e) => {
                                        const inputValue = e.target.value;
                                        onInputChange(inputValue, inputName, values, index);
                                    }}
                                    onMouseUp={(e) => onMouseUp(e, inputName, index)}
                                />
                            </FormControl>)
                        }

                        if (input.type === 'boolean') {

                            const inputName = input.name;

                            return (
                            <FormControl 
                                key={inputName}
                                fullWidth 
                                sx={{ mb: 1, mt: 1 }}
                                error={errors && errors.length > 0 && errors[index] ?
                                    Boolean(errors[index][inputName]) : false
                                }
                            >
                                <Stack direction="row">
                                    <Typography variant="overline">{input.label}</Typography>
                                    {input.description && (
                                    <Tooltip title={input.description} placement="right">
                                        <IconButton ><Info style={{ height: 18, width: 18 }}/></IconButton>
                                    </Tooltip>
                                    )}
                                </Stack>
                                <Switch
                                    checked={!!values[inputName]}
                                    onChange={(event) => {
                                        onInputChange(event.target.checked, inputName, values, index)
                                    }}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                            </FormControl>)
                        }

                        if (input.type === 'options') {

                            const inputName = input.name;
                            const availableOptions = input.options || [];

                            return (
                            <FormControl 
                                key={`${inputName}_${paramIndex}`}
                                fullWidth
                                sx={{ mb: 1, mt: 1 }}
                            >
                                <Stack direction="row">
                                    <Typography variant="overline">{input.label}</Typography>
                                    {input.description && (
                                    <Tooltip title={input.description} placement="right">
                                        <IconButton ><Info style={{ height: 18, width: 18 }}/></IconButton>
                                    </Tooltip>
                                    )}
                                </Stack>
                                <Autocomplete
                                    id={inputName}
                                    freeSolo
                                    onOpen={() => onArrayItemMouseUp(false)}
                                    options={availableOptions}
                                    value={findMatchingOptions(availableOptions, values[inputName]) ||  getDefaultOptionValue()}
                                    onChange={(e, selection) => {
                                        const value = selection ? selection.name : "";
                                        onInputBlur(value, inputName, values, index)
                                    }}
                                    PopperComponent={StyledPopper}
                                    renderInput={(params) => (
                                        <TextField 
                                            {...params}
                                            value={values[inputName]}
                                            error={errors && errors.length > 0 && errors[index] ?
                                                Boolean(errors[index][inputName]) : false
                                            }
                                        />
                                    )}
                                    renderOption={(props, option) => (
                                        <Box component="li" {...props}>
                                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                                <Typography sx={{p: 1}} variant="h5">
                                                    {option.label} 
                                                </Typography>
                                                {option.description &&
                                                    <Typography sx={{p: 1}}>
                                                        {option.description} 
                                                    </Typography>
                                                }
                                            </div>
                                        </Box>
                                    )}
                                />
                            </FormControl>)
                        }
                        return null
                    })}
                    </Box>
                )}
            )} 
        </>
    );
};

ArrayInputParameters.propTypes = {
    initialValues: PropTypes.object, 
    arrayParams: PropTypes.array,
    paramsType: PropTypes.string,
    arrayGroupName: PropTypes.string,
    errors: PropTypes.array, 
    onArrayInputChange: PropTypes.func, 
    onArrayInputBlur: PropTypes.func,
    onArrayItemRemove: PropTypes.func,
    onArrayItemMouseUp: PropTypes.func,
};

export default ArrayInputParameters;
