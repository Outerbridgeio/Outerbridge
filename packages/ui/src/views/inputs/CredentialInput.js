import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// material-ui
import {
    Box,
    Button,
    FormControl,
    Stack,
    OutlinedInput,
    Popper,
    TextField,
    Typography,
    IconButton,
    Switch,
    Tooltip
} from '@mui/material';
import { Info } from '@mui/icons-material';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import { styled } from '@mui/material/styles';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';

// API
import credentialApi from "api/credential";

// Hooks
import useApi from "hooks/useApi";
import useScriptRef from 'hooks/useScriptRef';

// icons
import { IconTrash } from '@tabler/icons';

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

const ADD_NEW_CREDENTIAL = '+ Add New Credential';

// ==============================|| CREDENTIAL INPUT ||============================== //

const CredentialInput = ({ 
    initialParams,
    paramsType,
    initialValues, 
    initialValidation, 
    valueChanged, 
    paramsChanged,
    onSubmit,
    ...others 
}) => {
    const scriptedRef = useScriptRef();
    const [credentialValidation, setCredentialValidation] = useState({});
    const [credentialValues, setCredentialValues] = useState({});
    const [nodeCredentialName, setNodeCredentialName] = useState('');
    const [credentialParams, setCredentialParams] = useState([]);
    const [credentialOptions, setCredentialOptions] = useState([]);
    const getCredentialParamsApi = useApi(credentialApi.getCredentialParams);
    const getRegisteredCredentialsApi = useApi(credentialApi.getCredentials);
    const getSpecificCredentialApi = useApi(credentialApi.getSpecificCredential);

    const onChanged = (values) => {
        const updateValues = values;
        updateValues.submit = null;
        valueChanged(updateValues, paramsType);
    };

    const getCredentialRequestBody = (values) => {
        if (credentialParams.length === 0) throw new Error('Credential params empty');
        
        const credentialData = {};
        for (let i = 0; i < credentialParams.length; i+=1 ) {
            const credParamName = credentialParams[i].name;
            if (credParamName in values) credentialData[credParamName] = values[credParamName];
        }
        delete credentialData.name;

        const createBody = {
            name: values.name,
            nodeCredentialName: values.credentialMethod,
            credentialData
        };

        return createBody;
    }

    const updateYupValidation = (inputName, validationKey) => {
        const updateValidation = {
            ...credentialValidation,
            [inputName]: Yup.object({[validationKey]: Yup.string().required(`${inputName} is required`) })
        };
        setCredentialValidation(updateValidation);
    };

    const resetCredentialParams = () => {
        const updateParams = initialParams.filter(item => credentialParams.every(paramItem => item.name !== paramItem.name));
        setCredentialParams([]);
        paramsChanged(updateParams, paramsType);
    }

    const clearCredentialParamsValues = (value) => {
        let updateValues = JSON.parse(JSON.stringify(credentialValues));
        
        for (let i = 0; i < credentialParams.length; i+=1 ) {
            const credParamName = credentialParams[i].name;
            if (credParamName in updateValues) delete updateValues[credParamName];
        }
        updateValues = {
            ...updateValues,
            registeredCredential: value
        };
        valueChanged(updateValues, paramsType);
    };
    
    const onDeleteCredential = async(credentialId) => {
        const response = await credentialApi.deleteCredential(credentialId);
        if (response.data) {
            resetCredentialParams();
            clearCredentialParamsValues('');
        }
    }

    const findMatchingOptions = (options, value) => options.find((option) => option.name === value);

    const getDefaultOptionValue = () => ('');

    // getRegisteredCredentialsApi successful
    useEffect(() => {
        if (getRegisteredCredentialsApi.data) {
            const credentialOptions = [
                ...getRegisteredCredentialsApi.data,
                {
                    name: ADD_NEW_CREDENTIAL
                }
            ];
            setCredentialOptions(credentialOptions);
            if (initialParams.find((prm) => prm.name === 'registeredCredential')) {
                updateYupValidation('registeredCredential', 'name');
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getRegisteredCredentialsApi.data]);

    // getCredentialParamsApi successful
    useEffect(() => {
        if (getCredentialParamsApi.data) {

            const newCredentialParams = getCredentialParamsApi.data.credentials;

            const credentialNameParam = {
				label: 'Credential Name',
				name: 'name',
				type: 'string',
				default: '',
            };

            newCredentialParams.unshift(credentialNameParam);

            setCredentialParams(newCredentialParams);

            const updateParams = initialParams;

            for (let i = 0; i < newCredentialParams.length; i+=1 ) {
                const credParamName = newCredentialParams[i].name;
                if (initialParams.find((prm) => prm.name === credParamName) === undefined) {
                    updateParams.push(newCredentialParams[i]);
                }
            }
            paramsChanged(updateParams, paramsType);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getCredentialParamsApi.data]);

    // getSpecificCredentialApi successful
    useEffect(() => {
        if (getSpecificCredentialApi.data) {
            const updateValues = {
                ...credentialValues,
                ...getSpecificCredentialApi.data.credentialData,
                name: getSpecificCredentialApi.data.name,
            };
            valueChanged(updateValues, paramsType);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getSpecificCredentialApi.data]);

    // Initialize values
    useEffect(() => {
        setCredentialValues(initialValues);
        if (initialValues && initialValues.credentialMethod) {
            getRegisteredCredentialsApi.request(initialValues.credentialMethod);
            setNodeCredentialName(initialValues.credentialMethod);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialValues]);

    // Initialize validation
    useEffect(() => {
        setCredentialValidation(initialValidation);

    }, [initialValidation]);

    return (
        <>
        <Box sx={{ width: 400 }}>
            <Formik
                enableReinitialize
                initialValues={credentialValues}
                validationSchema={Yup.object().shape(credentialValidation)}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        if (scriptedRef.current) {
                            const isAddNewCredential = values && values.registeredCredential && values.registeredCredential.name === ADD_NEW_CREDENTIAL;
                            if (!isAddNewCredential && credentialParams.length === 0) {
                                values.submit = true;
                                onSubmit(values, paramsType);
                                setStatus({ success: true });
                                setSubmitting(false);
                                
                            } else {
                                const body = getCredentialRequestBody(values);
                                let response;
                                if (isAddNewCredential) {
                                    response = await credentialApi.createNewCredential(body);
                                } else {
                                    response = await credentialApi.updateCredential(values.registeredCredential._id, body);
                                }
                                if (response.data) {
                                    const submitValues = {
                                        credentialMethod: values.credentialMethod,
                                        registeredCredential: response.data,
                                        submit: true
                                    }
                                    resetCredentialParams();
                                    onSubmit(submitValues, paramsType);
                                    setStatus({ success: true });
                                    setSubmitting(false);
                                } else {
                                    throw new Error(response);
                                }
                            }
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

                        {initialParams.map((input) => {

                            if (input.type === 'options') {

                                const inputName = input.name;
                                const availableOptions = input.options || [];

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
                                        options={availableOptions}
                                        value={findMatchingOptions(availableOptions, values[inputName]) ||  getDefaultOptionValue()}
                                        onChange={(e, selection) => {
                                            const value = selection ? selection.name : "";
                                            setFieldValue(inputName, value);
                                            const overwriteValues = {
                                                [inputName]: value
                                            };
                                            onChanged(overwriteValues);
                                            resetCredentialParams();
                                            if (selection) {
                                                getRegisteredCredentialsApi.request(value);
                                                setNodeCredentialName(value);
                                            } else {
                                                setCredentialOptions([]);
                                            }
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
                                </FormControl>)
                            }
                            return null
                        })}

                        {initialParams.find((prm) => prm.name === 'registeredCredential') && (
                        <FormControl 
                            fullWidth
                            sx={{ mb: 1, mt: 1 }}
                        >
                            <Stack direction="row">
                                <Typography variant="overline">Registered Credential</Typography>
                                <Tooltip title="Select previously registered credential OR add new credential" placement="right">
                                    <IconButton ><Info style={{ height: 18, width: 18 }}/></IconButton>
                                </Tooltip>
                            </Stack>
                            <Autocomplete
                                id="registered-credential"
                                freeSolo
                                options={credentialOptions}
                                value={values.registeredCredential && values.credentialMethod ? values.registeredCredential : " "}
                                getOptionLabel={(option) => option.name || " "}
                                onChange={(e, selectedCredential) => {
                                    setFieldValue('registeredCredential', selectedCredential !== null ? selectedCredential : initialValues.registeredCredential);
                                    const overwriteValues = {
                                        ...values,
                                        registeredCredential: selectedCredential
                                    };
                                    onChanged(overwriteValues);
                                    if (selectedCredential) {
                                        if (selectedCredential.name !== ADD_NEW_CREDENTIAL) {
                                            getSpecificCredentialApi.request(selectedCredential._id);
                                        } else {
                                            clearCredentialParamsValues(selectedCredential);
                                        }
                                        getCredentialParamsApi.request(nodeCredentialName);
                                    }
                                }}
                                onInputChange={(e, value) => {
                                    if (!value) {
                                        resetCredentialParams();
                                        clearCredentialParamsValues('');
                                    }
                                }}
                                onBlur={handleBlur}
                                PopperComponent={StyledPopper}
                                renderInput={(params) => (
                                    <TextField 
                                        {...params}
                                        value={values.registeredCredential}
                                        error={Boolean(errors.registeredCredential)}
                                    />
                                )}
                                renderOption={(props, option) => (
                                    <Box component="li" {...props}>
                                        <div style={{display: 'flex', flexDirection: 'column'}}>
                                            <Typography sx={{p: 1}} variant="h5">
                                                {option.name} 
                                            </Typography>
                                        </div>
                                    </Box>
                                )}
                            />
                            {errors.registeredCredential && <span style={{ color: 'red', fontSize: '0.7rem', fontStyle: 'italic' }}>*Registered Credential is required</span>}
                        </FormControl>
                        )}

                        {values && values.registeredCredential && values.registeredCredential._id && (
                        <Button sx={{ mb: 2 }} size="small" variant="outlined" startIcon={<IconTrash size={15} />} onClick={() => onDeleteCredential(values.registeredCredential._id)}>
                            Delete Credential
                        </Button>)}

                        {values.credentialMethod && credentialParams.map((input) => {

                            if (input.type === 'string' || input.type === 'password' || input.type === 'number') {

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
                                        type={input.type === 'string' || input.type === 'number' ? 'text' : input.type}
                                        value={values[inputName] || ''}
                                        placeholder={input.placeholder}
                                        name={inputName}
                                        onBlur={e => {
                                            handleBlur(e);
                                            onChanged(values);
                                        }}
                                        onChange={handleChange}
                                    />
                                    {errors[inputName] && <span style={{ color: 'red', fontSize: '0.7rem', fontStyle: 'italic' }}>*{errors[inputName]}</span>}
                                </FormControl>
                                )
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

                            if (input.type === 'options') {

                                const inputName = input.name;
                                const availableOptions = input.options || [];

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
                                        options={availableOptions}
                                        value={findMatchingOptions(availableOptions, values[inputName]) ||  getDefaultOptionValue()}
                                        onChange={(e, selection) => {
                                            const value = selection ? selection.name : "";
                                            setFieldValue(inputName, value);
                                            const overwriteValues = {
                                                ...values,
                                                [inputName]: value
                                            };
                                            onChanged(overwriteValues);
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
                                </FormControl>)
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
                                    {values && values.registeredCredential && 
                                    (values.registeredCredential.name === ADD_NEW_CREDENTIAL || credentialParams.length) ? 
                                    'Save and Continue' : 'Continue'}
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

CredentialInput.propTypes = {
    initialParams: PropTypes.array,
    paramsType: PropTypes.string,
    initialValues: PropTypes.object, 
    initialValidation: PropTypes.object, 
    valueChanged: PropTypes.func, 
    paramsChanged: PropTypes.func,
    onSubmit: PropTypes.func,
};

export default CredentialInput;
