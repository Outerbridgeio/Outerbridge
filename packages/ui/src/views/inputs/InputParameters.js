import PropTypes from 'prop-types';
import { forwardRef } from 'react';

// material-ui
import { Box, Button, Stack, FormControl, OutlinedInput, Popper, TextField, Typography, Switch, IconButton } from '@mui/material';
import { Info } from '@mui/icons-material';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import { styled, useTheme } from '@mui/material/styles';

// third party
import lodash from 'lodash';
import * as Yup from 'yup';
import { Formik } from 'formik';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markup';
import 'prismjs/themes/prism.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { InputParameterTooltip } from '../../ui-component/InputParametersTooltip';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';
import ArrayInputParameters from './ArrayInputParameters';
import OptionParamsResponse from './OptionParamsResponse';
import AsyncSelectWrapper from './AsyncSelectWrapper';

// icons
import { IconPlus, IconUpload } from '@tabler/icons';

// utils
import { convertDateStringToDateObject, getFileName, getFolderName } from 'utils/genericHelper';

//css
import './InputParameters.css';

const StyledPopper = styled(Popper)({
    boxShadow: '0px 8px 10px -5px rgb(0 0 0 / 20%), 0px 16px 24px 2px rgb(0 0 0 / 14%), 0px 6px 30px 5px rgb(0 0 0 / 12%)',
    borderRadius: '10px',
    [`& .${autocompleteClasses.listbox}`]: {
        boxSizing: 'border-box',
        '& ul': {
            padding: 10,
            margin: 10
        }
    }
});

const DateCustomInput = forwardRef(({ value, onClick }, ref) => (
    <button
        style={{
            backgroundColor: '#fafafa',
            paddingTop: 8,
            paddingBottom: 8,
            paddingRight: 12,
            paddingLeft: 12,
            borderRadius: 12,
            width: '100%',
            height: 50,
            border: `1px solid #BDBDBD`,
            cursor: 'pointer',
            fontWeight: 'bold',
            textAlign: 'start',
            color: '#212121',
            opacity: 0.9
        }}
        type="button"
        onClick={onClick}
        ref={ref}
    >
        {value}
    </button>
));

DateCustomInput.propTypes = {
    value: PropTypes.string,
    onClick: PropTypes.func
};

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
    onEditVariableDialogOpen,
    ...others
}) => {
    const theme = useTheme();

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
            paramsType
        };
        setVariableSelectorState(true, body);
    };

    const onAddArrayItem = (values, arrayItems, arrayName) => {
        const updateValues = {
            ...values,
            [arrayName]: arrayItems
        };
        valueChanged(updateValues, paramsType);
    };

    const handleFolderUpload = (e, setFieldValue, values, inputName) => {
        setVariableSelectorState(false);
        if (!e.target.files) return;
        const files = e.target.files;
        const reader = new FileReader();

        function readFile(fileIndex, base64Array) {
            if (fileIndex >= files.length) {
                setFieldValue(inputName, JSON.stringify(base64Array));
                const overwriteValues = {
                    ...values,
                    [inputName]: JSON.stringify(base64Array)
                };
                onChanged(overwriteValues);
                return;
            }
            const file = files[fileIndex];
            reader.onload = (evt) => {
                if (!evt?.target?.result) {
                    return;
                }
                const { result } = evt.target;
                const value = result + `,filepath:${file.webkitRelativePath}`;
                base64Array.push(value);
                readFile(fileIndex + 1, lodash.cloneDeep(base64Array));
            };
            reader.readAsDataURL(file);
        }
        readFile(0, []);
    };

    const handleFileUpload = (e, setFieldValue, values, inputName) => {
        setVariableSelectorState(false);
        if (!e.target.files) return;

        const file = e.target.files[0];
        const { name } = file;

        const reader = new FileReader();
        reader.onload = (evt) => {
            if (!evt?.target?.result) {
                return;
            }
            const { result } = evt.target;

            const value = result + `,filename:${name}`;
            setFieldValue(inputName, value);
            const overwriteValues = {
                ...values,
                [inputName]: value
            };
            onChanged(overwriteValues);
        };
        reader.readAsDataURL(file);
    };

    const findMatchingOptions = (options = [], value) => options.find((option) => option.name === value);

    const getDefaultOptionValue = () => '';

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
                                if (input.type === 'file' || input.type === 'folder') {
                                    const inputName = input.name;

                                    return (
                                        <FormControl key={inputName} fullWidth sx={{ mb: 1, mt: 1 }} error={Boolean(errors[inputName])}>
                                            <Stack direction="row">
                                                <Typography variant="overline">{input.label}</Typography>
                                                {input.description && <InputParameterTooltip title={input.description} />}
                                            </Stack>

                                            {input.type === 'file' && (
                                                <span
                                                    style={{
                                                        fontWeight: 'bold',
                                                        color: theme.palette.grey['800'],
                                                        marginBottom: '1rem'
                                                    }}
                                                >
                                                    {values[inputName] ? getFileName(values[inputName]) : 'Choose a file to upload'}
                                                </span>
                                            )}

                                            {input.type === 'folder' && (
                                                <span
                                                    style={{
                                                        fontWeight: 'bold',
                                                        color: theme.palette.grey['800'],
                                                        marginBottom: '1rem'
                                                    }}
                                                >
                                                    {values[inputName] ? getFolderName(values[inputName]) : 'Choose a folder to upload'}
                                                </span>
                                            )}

                                            <Button
                                                variant="outlined"
                                                component="label"
                                                fullWidth
                                                startIcon={<IconUpload />}
                                                sx={{ marginRight: '1rem' }}
                                            >
                                                {input.type === 'folder' ? 'Upload Folder' : 'Upload File'}
                                                {input.type === 'file' && (
                                                    <input
                                                        type="file"
                                                        hidden
                                                        onChange={(e) => handleFileUpload(e, setFieldValue, values, inputName)}
                                                    />
                                                )}
                                                {input.type === 'folder' && (
                                                    <input
                                                        type="file"
                                                        directory=""
                                                        webkitdirectory=""
                                                        hidden
                                                        onChange={(e) => handleFolderUpload(e, setFieldValue, values, inputName)}
                                                    />
                                                )}
                                            </Button>
                                            {errors[inputName] && (
                                                <span style={{ color: 'red', fontSize: '0.7rem', fontStyle: 'italic' }}>
                                                    *{errors[inputName]}
                                                </span>
                                            )}
                                        </FormControl>
                                    );
                                }

                                if (input.type === 'json' || input.type === 'code') {
                                    const inputName = input.name;

                                    return (
                                        <FormControl key={inputName} fullWidth sx={{ mb: 1, mt: 1 }} error={Boolean(errors[inputName])}>
                                            <Stack sx={{ position: 'relative' }} direction="row">
                                                <Typography variant="overline">{input.label}</Typography>
                                                {input.description && <InputParameterTooltip title={input.description} />}
                                                <Button
                                                    sx={{
                                                        position: 'absolute',
                                                        fontSize: '0.6875rem',
                                                        right: 0,
                                                        top: 5,
                                                        height: 25,
                                                        width: 'max-content'
                                                    }}
                                                    variant="outlined"
                                                    onClick={() => onEditVariableDialogOpen(input, values)}
                                                >
                                                    Edit Variables
                                                </Button>
                                            </Stack>
                                            <PerfectScrollbar
                                                style={{
                                                    border: '1px solid',
                                                    borderColor: theme.palette.grey['500'],
                                                    borderRadius: '12px',
                                                    height: '200px',
                                                    maxHeight: '200px',
                                                    overflowX: 'hidden',
                                                    backgroundColor: 'white'
                                                }}
                                                onScroll={(e) => e.stopPropagation()}
                                            >
                                                <Editor
                                                    placeholder={input.placeholder}
                                                    value={values[inputName] || ''}
                                                    onBlur={(e) => {
                                                        const overwriteValues = {
                                                            ...values,
                                                            [inputName]: e.target.value
                                                        };
                                                        onChanged(overwriteValues);
                                                        onMouseUp(e, inputName);
                                                    }}
                                                    onValueChange={(code) => {
                                                        setFieldValue(inputName, code);
                                                    }}
                                                    onMouseUp={(e) => onMouseUp(e, inputName)}
                                                    highlight={(code) =>
                                                        highlight(code, input.type === 'json' ? languages.json : languages.js)
                                                    }
                                                    padding={10}
                                                    style={{
                                                        fontSize: '0.875rem',
                                                        minHeight: '200px',
                                                        width: '100%'
                                                    }}
                                                    textareaClassName="editor__textarea"
                                                />
                                            </PerfectScrollbar>
                                            {errors[inputName] && (
                                                <span style={{ color: 'red', fontSize: '0.7rem', fontStyle: 'italic' }}>
                                                    *{errors[inputName]}
                                                </span>
                                            )}
                                        </FormControl>
                                    );
                                }

                                if (input.type === 'date') {
                                    const inputName = input.name;

                                    return (
                                        <FormControl key={inputName} fullWidth sx={{ mb: 1, mt: 1 }} error={Boolean(errors[inputName])}>
                                            <Stack direction="row">
                                                <Typography variant="overline">{input.label}</Typography>
                                                {input.description && <InputParameterTooltip title={input.description} />}
                                            </Stack>
                                            <DatePicker
                                                customInput={<DateCustomInput />}
                                                selected={convertDateStringToDateObject(values[inputName]) || null}
                                                showTimeSelect
                                                isClearable
                                                timeInputLabel="Time:"
                                                dateFormat="MM/dd/yyyy h:mm aa"
                                                onChange={(date) => {
                                                    const value = date ? date.toISOString() : null;
                                                    setVariableSelectorState(false);
                                                    setFieldValue(inputName, value);
                                                    const overwriteValues = {
                                                        ...values,
                                                        [inputName]: value
                                                    };
                                                    onChanged(overwriteValues);
                                                }}
                                            />
                                            {errors[inputName] && (
                                                <span style={{ color: 'red', fontSize: '0.7rem', fontStyle: 'italic' }}>
                                                    *{errors[inputName]}
                                                </span>
                                            )}
                                        </FormControl>
                                    );
                                }

                                if (input.type === 'string' || input.type === 'password' || input.type === 'number') {
                                    const inputName = input.name;

                                    return (
                                        <FormControl key={inputName} fullWidth sx={{ mb: 1, mt: 1 }} error={Boolean(errors[inputName])}>
                                            <Stack sx={{ position: 'relative' }} direction="row">
                                                <Typography variant="overline">{input.label}</Typography>
                                                {input.description && <InputParameterTooltip title={input.description} />}
                                                {(input.type === 'string' || input.type === 'number') && (
                                                    <Button
                                                        sx={{
                                                            position: 'absolute',
                                                            fontSize: '0.6875rem',
                                                            right: 0,
                                                            top: 5,
                                                            height: 25,
                                                            width: 'max-content'
                                                        }}
                                                        variant="outlined"
                                                        onClick={() => onEditVariableDialogOpen(input, values)}
                                                    >
                                                        Edit Variables
                                                    </Button>
                                                )}
                                            </Stack>
                                            <OutlinedInput
                                                id={inputName}
                                                type={input.type === 'string' || input.type === 'number' ? 'text' : input.type}
                                                placeholder={input.placeholder}
                                                multiline={!!input.rows}
                                                maxRows={input.rows || 0}
                                                minRows={input.rows || 0}
                                                value={values[inputName] || ''}
                                                name={inputName}
                                                onBlur={(e) => {
                                                    handleBlur(e);
                                                    onChanged(values);
                                                    onMouseUp(e, inputName);
                                                }}
                                                onMouseUp={(e) => onMouseUp(e, inputName)}
                                                onChange={handleChange}
                                            />
                                            {errors[inputName] && (
                                                <span style={{ color: 'red', fontSize: '0.7rem', fontStyle: 'italic' }}>
                                                    *{errors[inputName]}
                                                </span>
                                            )}
                                        </FormControl>
                                    );
                                }

                                if (input.type === 'boolean') {
                                    const inputName = input.name;

                                    return (
                                        <FormControl key={inputName} fullWidth sx={{ mb: 1, mt: 1 }} error={Boolean(errors[inputName])}>
                                            <Stack direction="row">
                                                <Typography variant="overline">{input.label}</Typography>
                                                {input.description && <InputParameterTooltip title={input.description} />}
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
                                        </FormControl>
                                    );
                                }

                                if (input.type === 'asyncOptions') {
                                    const inputName = input.name;
                                    return (
                                        <FormControl key={inputName} fullWidth sx={{ mb: 1, mt: 1 }}>
                                            <AsyncSelectWrapper
                                                title={input.label}
                                                description={input.description}
                                                value={values[inputName]}
                                                loadMethod={input.loadMethod}
                                                loadFromDbCollections={input.loadFromDbCollections || []}
                                                nodeFlowData={nodeFlowData}
                                                error={JSON.stringify(errors[inputName])}
                                                onChange={(selection) => {
                                                    const value = selection ? selection.name : '';
                                                    setFieldValue(inputName, value);
                                                    const overwriteValues = {
                                                        ...values,
                                                        [inputName]: value
                                                    };
                                                    onChanged(overwriteValues);
                                                }}
                                                onMenuOpen={() => setVariableSelectorState(false)}
                                                onSetError={() => {
                                                    const value = '';
                                                    setFieldValue(inputName, value);
                                                }}
                                            />
                                        </FormControl>
                                    );
                                }

                                if (input.type === 'options') {
                                    const inputName = input.name;
                                    return (
                                        <FormControl key={inputName} fullWidth sx={{ mb: 1, mt: 1 }}>
                                            <Stack direction="row">
                                                <Typography variant="overline">{input.label}</Typography>
                                                {input.description && <InputParameterTooltip title={input.description} />}
                                            </Stack>
                                            <Autocomplete
                                                id={inputName}
                                                freeSolo
                                                onOpen={() => setVariableSelectorState(false)}
                                                options={input.options || []}
                                                value={findMatchingOptions(input.options, values[inputName]) || getDefaultOptionValue()}
                                                onChange={(e, selection) => {
                                                    const value = selection ? selection.name : '';
                                                    setFieldValue(inputName, value);
                                                    const overwriteValues = {
                                                        ...values,
                                                        [inputName]: value
                                                    };
                                                    onChanged(overwriteValues);
                                                }}
                                                onInputChange={(e, value) => {
                                                    if (!value) setFieldValue(inputName, '');
                                                }}
                                                onBlur={handleBlur}
                                                PopperComponent={StyledPopper}
                                                renderInput={(params) => (
                                                    <TextField {...params} value={values[inputName]} error={Boolean(errors[inputName])} />
                                                )}
                                                renderOption={(props, option) => (
                                                    <Box component="li" {...props}>
                                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                            <Typography sx={{ p: 1 }} variant="h5">
                                                                {option.label}
                                                            </Typography>
                                                            {option.description && (
                                                                <Typography sx={{ p: 1 }}>{option.description}</Typography>
                                                            )}
                                                        </div>
                                                    </Box>
                                                )}
                                            />
                                            {errors[inputName] && (
                                                <span style={{ color: 'red', fontSize: '0.7rem', fontStyle: 'italic' }}>
                                                    *{errors[inputName]}
                                                </span>
                                            )}
                                            <OptionParamsResponse value={values[inputName]} options={input.options || []} />
                                        </FormControl>
                                    );
                                }

                                if (input.type === 'array') {
                                    const arrayParamItems = input.arrayParams;
                                    const templateArray = input.array;
                                    const inputName = input.name;
                                    const arrayItemsValues = values[inputName] || [];

                                    return (
                                        <Stack sx={{ mt: 1 }} key={inputName}>
                                            <Stack direction="row">
                                                <Typography variant="overline">{input.label}</Typography>
                                                {input.description && <InputParameterTooltip title={input.description} />}
                                            </Stack>
                                            <ArrayInputParameters
                                                initialValues={arrayItemsValues}
                                                arrayParams={arrayParamItems}
                                                paramsType={paramsType}
                                                arrayGroupName={inputName}
                                                errors={errors[inputName] ? errors[inputName] : []}
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
                                                onEditVariableDialogOpen={(arrayItemInput, arrayItemValues, arrayItemIndex) => {
                                                    const arrayItemBody = {
                                                        arrayItemInput,
                                                        arrayItemValues,
                                                        arrayItemIndex,
                                                        initialValues: arrayItemsValues
                                                    };
                                                    onEditVariableDialogOpen(input, values, arrayItemBody);
                                                }}
                                            />
                                            <Box key={inputName} sx={{ mb: 2 }}>
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
                                                                for (let i = 0; i < templateArray.length; i += 1) {
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
                                    );
                                }
                                return null;
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
    onEditVariableDialogOpen: PropTypes.func
};

export default InputParameters;
