import PropTypes from 'prop-types';

// material-ui
import {
    Box,
    Button,
    Stack,
    FormControl,
    OutlinedInput,
    Popper,
    TextField,
    Typography,
    Switch,
    IconButton,
    Tooltip
} from '@mui/material';
import { Info } from '@mui/icons-material';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import { styled } from '@mui/material/styles';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';
import ArrayInputParameters from './ArrayInputParameters';
import OptionParamsResponse from './OptionParamsResponse';
import AsyncSelectWrapper from './AsyncSelectWrapper';

// icons
import { IconPlus } from '@tabler/icons';

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

// ==============================|| INPUT PARAMETERS ||============================== //

const InputParameters = ({ 
    params, 
    paramsType, 
    initialValues, 
    nodeParamsValidation, 
    nodeFlowData,
    valueChanged, 
    onSubmit,
    setVariableSelectorState,
    ...others 
}) => {
    const scriptedRef = useScriptRef();

    const onChanged = (values) => {
        const updateValues = values;
        updateValues.submit = null;
        valueChanged(updateValues, paramsType);
    };

    const onMouseUp = (e, inputName) => {
        const cursorPosition = e.target.selectionEnd;
        const textBeforeCursorPosition = e.target.value.substring(0, cursorPosition);
        const textAfterCursorPosition = e.target.value.substring(cursorPosition, e.target.value.length);
        const path = `${paramsType}.${inputName}`;
        const body = {
            textBeforeCursorPosition, 
            textAfterCursorPosition,
            path,
            paramsType,
        }
        setVariableSelectorState(true, body);
    }

    const onAddArrayItem = (values, arrayItems, arrayName) => {
        const updateValues = {
            ...values,
            [arrayName]: arrayItems
        }
        valueChanged(updateValues, paramsType);
    };

    const findMatchingOptions = (options = [], value) => options.find((option) => option.name === value);

    const getDefaultOptionValue = () => ('');

    return (
        <>
        <Box sx={{ width: 400 }}>
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={Yup.object().shape(nodeParamsValidation)}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    setVariableSelectorState(false);
                    try {
                        if (scriptedRef.current) {
                            values.submit = true;
                            setStatus({ success: true });
                            setSubmitting(false);
                            onSubmit(values, paramsType);
                        }
                    } catch (err) {
                        console.error(err);
                        if (scriptedRef.current) {
                            setStatus({ success: false });
                            setErrors({ submit: err.message });
                            setSubmitting(false);
                        }
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, setFieldValue, isSubmitting, values }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        {params.map((input) => {

                            if (input.type === 'string' || input.type === 'number') {

                                const inputName = input.name;

                                return (
                                <FormControl 
                                    key={inputName}
                                    fullWidth 
                                    sx={{ mb: 1, mt: 1 }}
                                    error={Boolean(errors[inputName])}
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
                                        type={input.type === 'number' ? 'number' : 'text'}
                                        multiline={!!input.rows}
                                        maxRows={input.rows || 0}
                                        minRows={input.rows || 0}
                                        value={values[inputName] || ''}
                                        name={inputName}
                                        onBlur={e => {
                                            handleBlur(e);
                                            onChanged(values);
                                        }}
                                        onMouseUp={(e) => onMouseUp(e, inputName)}
                                        onChange={handleChange}
                                    />
                                    {errors[inputName] && <span style={{ color: 'red', fontSize: '0.7rem', fontStyle: 'italic' }}>*{errors[inputName]}</span>}
                                </FormControl>)
                            }

                            if (input.type === 'boolean') {

                                const inputName = input.name;

                                return (
                                <FormControl 
                                    key={inputName}
                                    fullWidth 
                                    sx={{ mb: 1, mt: 1 }}
                                    error={Boolean(errors[inputName])}
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
                                            setVariableSelectorState(false);
                                            setFieldValue(inputName, event.target.checked);
                                            const overwriteValues = {
                                                ...values,
                                                [inputName]: event.target.checked
                                            };
                                            onChanged(overwriteValues);
                                        }}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                    />
                                </FormControl>)
                            }

                            if (input.type === 'asyncOptions') {
                                const inputName = input.name;
                                return (
                                    <FormControl 
                                        key={inputName}
                                        fullWidth
                                        sx={{ mb: 1, mt: 1 }}
                                    >
                                        <AsyncSelectWrapper 
                                            title={input.label}
                                            description={input.description}
                                            value={values[inputName]}
                                            loadMethod={input.loadMethod}
                                            nodeFlowData={nodeFlowData}
                                            error={JSON.stringify(errors[inputName])}
                                            onChange={(selection) => {
                                                const value = selection ? selection.name : "";
                                                setFieldValue(inputName, value);
                                                const overwriteValues = {
                                                    ...values,
                                                    [inputName]: value
                                                };
                                                onChanged(overwriteValues);
                                            }}
                                            onMenuOpen={() => setVariableSelectorState(false)}
                                            onSetError={() => {
                                                const value = "";
                                                setFieldValue(inputName, value);
                                            }}
                                        />
                                    </FormControl>
                                )
                            }

                            if (input.type === 'options') {
                                const inputName = input.name;
                                return (
                                <FormControl 
                                    key={inputName}
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
                                        onOpen={() => setVariableSelectorState(false)}
                                        options={input.options || []}
                                        value={findMatchingOptions(input.options, values[inputName]) || getDefaultOptionValue()}
                                        onChange={(e, selection) => {
                                            const value = selection ? selection.name : "";
                                            setFieldValue(inputName, value);
                                            const overwriteValues = {
                                                ...values,
                                                [inputName]: value
                                            };
                                            onChanged(overwriteValues);
                                        }}
                                        onInputChange={(e, value) => {
                                            if (!value) setFieldValue(inputName, "");
                                        }}
                                        onBlur={handleBlur}
                                        PopperComponent={StyledPopper}
                                        renderInput={(params) => (
                                            <TextField 
                                                {...params}
                                                value={values[inputName]}
                                                error={Boolean(errors[inputName])}

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
                                    {errors[inputName] && <span style={{ color: 'red', fontSize: '0.7rem', fontStyle: 'italic' }}>*{errors[inputName]}</span>}
                                    <OptionParamsResponse value={values[inputName]} options={input.options || []} />
                                </FormControl>)
                            }
                            
                            if (input.type === 'array') {

                                const arrayParamItems = input.arrayParams;
                                const templateArray = input.array;
                                const inputName = input.name;
                                const arrayItemsValues = values[inputName] || [];

                                return (
                                    <Stack key={inputName}>
                                        <ArrayInputParameters 
                                            initialValues={arrayItemsValues}
                                            arrayParams={arrayParamItems}
                                            paramsType={paramsType}
                                            arrayGroupName={inputName}
                                            errors={errors[inputName] ? errors[inputName] : {}} 
                                            onArrayInputChange={(updateInitialValues) => {
                                                setFieldValue(inputName, updateInitialValues);
                                            }}
                                            onArrayInputBlur={(updateInitialValues) => {
                                                setFieldValue(inputName, updateInitialValues);
                                                const overwriteValues = {
                                                    ...values,
                                                    [inputName]: updateInitialValues
                                                };
                                                onChanged(overwriteValues);
                                            }}
                                            onArrayItemRemove={(updateInitialValues) => {
                                                setFieldValue(inputName, updateInitialValues);
                                                const overwriteValues = {
                                                    ...values,
                                                    [inputName]: updateInitialValues
                                                };
                                                onChanged(overwriteValues);
                                            }}
                                            onArrayItemMouseUp={(variableState, body) => {
                                                if (body) setVariableSelectorState(variableState, body);
                                                else setVariableSelectorState(variableState);
                                            }}
                                        />
                                        <Box key={inputName} sx={{ mt: 1, mb: 5 }}>
                                            <AnimateButton>
                                                <Button
                                                    disableElevation
                                                    fullWidth
                                                    size="small"
                                                    variant="outlined"
                                                    color="secondary"
                                                    startIcon={<IconPlus />}
                                                    onClick={() => {
                                                        setVariableSelectorState(false);
                                                        let newObj = {};
                                                        if (input.default && input.default.length) {
                                                            newObj = input.default[0];
                                                        } else {
                                                            for (let i = 0; i < templateArray.length; i+= 1) {
                                                                newObj[templateArray[i].name] = templateArray[i].default || '';
                                                            }
                                                        }
                                                        arrayItemsValues.push(newObj);
                                                        onAddArrayItem(values, arrayItemsValues, inputName);
                                                    }}
                                                >
                                                    Add {input.label}
                                                </Button>
                                            </AnimateButton>
                                        </Box>
                                    </Stack>
                                )
                            }
                            return null
                        })}

                        <Box sx={{ mt: 2 }}>
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    disabled={isSubmitting || Object.keys(errors).length > 0}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                >
                                    Continue
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>
        </Box>
        </>
    );
};

InputParameters.propTypes = {
    params: PropTypes.array, 
    paramsType: PropTypes.string, 
    initialValues: PropTypes.object,
    nodeParamsValidation: PropTypes.object, 
    nodeFlowData: PropTypes.object,
    valueChanged: PropTypes.func, 
    onSubmit: PropTypes.func, 
    setVariableSelectorState: PropTypes.func, 
};

export default InputParameters;
