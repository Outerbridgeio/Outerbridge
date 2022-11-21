import { useState, useEffect, ComponentProps } from 'react'
import { useTheme } from 'themes'
import { ParamsType, NodeParams, NodeData } from 'utils'
import { ElementOf } from 'ts-essentials'
// material-ui
import { Box, Button, FormControl, Stack, OutlinedInput, Popper, TextField, Typography, IconButton, Switch } from '@mui/material'
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete'
import { styled } from '@mui/material/styles'

// third party
import * as Yup from 'yup'
import { Formik } from 'formik'
import PerfectScrollbar from 'react-perfect-scrollbar'
import Editor from 'react-simple-code-editor'
// @ts-expect-error no type definition
import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-markup'
import 'prismjs/themes/prism.css'

// project imports
import { AnimateButton, TooltipWithParser } from 'ui-component'

// API
import { credentialApi, oauth2Api } from 'api'

// Hooks
import { useApi, useScriptRef } from 'hooks'

// icons
import { IconTrash, IconCopy } from '@tabler/icons'

//css
import './InputParameters.css'

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
})

const ADD_NEW_CREDENTIAL = '+ Add New Credential'

// ==============================|| CREDENTIAL INPUT ||============================== //

// CredentialInput.propTypes = {
//     initialParams: PropTypes.array,
//     paramsType: PropTypes.string,
//     initialValues: PropTypes.object,
//     initialValidation: PropTypes.object,
//     valueChanged: PropTypes.func,
//     paramsChanged: PropTypes.func,
//     onSubmit: PropTypes.func
// }

export const CredentialInput = ({
    initialParams,
    paramsType,
    initialValues,
    initialValidation,
    valueChanged,
    paramsChanged,
    onSubmit,
    ...others
}: {
    initialParams: NodeParams[]
    paramsType: ParamsType
    initialValues?: NodeData['credentials']
    initialValidation: Record<string, Yup.BaseSchema>
    valueChanged: (
        values: Record<string, unknown> & {
            submit?: boolean | null | undefined
        },
        paramType: ParamsType
    ) => void
    paramsChanged: (params: NodeParams[], paramsType: ParamsType) => void
    onSubmit: (
        values: Record<string, unknown> & {
            submit?: boolean | null | undefined
        },
        paramType: ParamsType
    ) => void
} & ComponentProps<'form'>) => {
    type CredentialOption =
        | {
              name: typeof ADD_NEW_CREDENTIAL
              _id: never // this is needed because exhaustive check doesn't work because name:string in another type
          }
        | credentialApi.Credential
    const scriptedRef = useScriptRef()
    const theme = useTheme()

    const [credentialValidation, setCredentialValidation] = useState<Record<string, Yup.BaseSchema>>({})
    const [credentialValues, setCredentialValues] = useState<NodeData['credentials']>({})
    const [nodeCredentialName, setNodeCredentialName] = useState('')
    const [credentialParams, setCredentialParams] = useState<NodeParams[]>([])
    const [credentialOptions, setCredentialOptions] = useState<CredentialOption[]>([])
    const [oAuth2RedirectURL, setOAuth2RedirectURL] = useState('')

    const getCredentialParamsApi = useApi(credentialApi.getCredentialParams)
    const getRegisteredCredentialsApi = useApi(credentialApi.getCredentials)
    const getSpecificCredentialApi = useApi(credentialApi.getSpecificCredential)

    const onChanged = (values: Record<string, unknown>) => {
        const updateValues: typeof values & { submit?: null | boolean } = values
        updateValues.submit = null
        valueChanged(updateValues, paramsType)
    }

    const getCredentialRequestBody = (values: NonNullable<NodeData['credentials']>) => {
        if (credentialParams.length === 0) throw new Error('Credential params empty')

        const credentialData: Record<string, unknown> = {}
        for (let i = 0; i < credentialParams.length; i += 1) {
            const credParamName = credentialParams[i]!.name
            if (credParamName in values) credentialData[credParamName] = values[credParamName]
        }
        delete credentialData.name

        const credBody = {
            name: values.name!,
            nodeCredentialName: values.credentialMethod!,
            credentialData
        }

        return credBody
    }

    const updateYupValidation = (inputName: string, validationKey: string) => {
        const updateValidation = {
            ...credentialValidation,
            [inputName]: Yup.object({ [validationKey]: Yup.string().required(`${inputName} is required`) })
        }
        setCredentialValidation(updateValidation)
    }

    const clearCredentialParams = () => {
        const updateParams = initialParams.filter((item) => credentialParams.every((paramItem) => item.name !== paramItem.name))
        setCredentialParams([])
        setOAuth2RedirectURL('')

        paramsChanged(updateParams, paramsType)
    }

    const clearCredentialParamsValues = (value: unknown) => {
        let updateValues = JSON.parse(JSON.stringify(credentialValues))

        for (let i = 0; i < credentialParams.length; i += 1) {
            const credParamName = credentialParams[i]!.name
            if (credParamName in updateValues) delete updateValues[credParamName]
        }
        updateValues = {
            ...updateValues,
            registeredCredential: value
        }
        valueChanged(updateValues, paramsType)
    }

    const onDeleteCredential = async (credentialId: string | undefined) => {
        // ! logic changed
        if (credentialId) {
            const response = await credentialApi.deleteCredential(credentialId)
            if (response.data) {
                clearCredentialParams()
                clearCredentialParamsValues('')
            }
        }
    }

    const openOAuth2PopUpWindow = (oAuth2PopupURL: string) => {
        const windowWidth = 500
        const windowHeight = 400
        const left = window.screenX + (window.outerWidth - windowWidth) / 2
        const top = window.screenY + (window.outerHeight - windowHeight) / 2.5
        const title = `Connect Credential`
        const url = oAuth2PopupURL
        const popup = window.open(url, title, `width=${windowWidth},height=${windowHeight},left=${left},top=${top}`)
        return popup
    }

    const findMatchingOptions = (options: NodeParams['options'], value: string) => options?.find((option) => option.name === value)

    const getDefaultOptionValue = () => ''

    // getRegisteredCredentialsApi successful
    useEffect(() => {
        if (getRegisteredCredentialsApi.data) {
            const credentialOptions: CredentialOption[] = []
            if (getRegisteredCredentialsApi.data.length) {
                for (let i = 0; i < getRegisteredCredentialsApi.data.length; i += 1) {
                    credentialOptions.push({
                        _id: getRegisteredCredentialsApi.data[i]!._id,
                        name: getRegisteredCredentialsApi.data[i]!.name
                    })
                }
            }
            // @ts-expect-error see reason stated in CredentialOption
            credentialOptions.push({
                name: ADD_NEW_CREDENTIAL
            })
            setCredentialOptions(credentialOptions)
            if (initialParams.find((prm) => prm.name === 'registeredCredential')) {
                updateYupValidation('registeredCredential', 'name')
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getRegisteredCredentialsApi.data])

    // getCredentialParamsApi successful
    useEffect(() => {
        if (getCredentialParamsApi.data) {
            const newCredentialParams = getCredentialParamsApi.data.credentials

            const credentialNameParam = {
                label: 'Credential Name',
                name: 'name',
                type: 'string' as const,
                default: ''
            }

            newCredentialParams.unshift(credentialNameParam)

            setCredentialParams(newCredentialParams)

            const updateParams = initialParams

            for (let i = 0; i < newCredentialParams.length; i += 1) {
                const credParamName = newCredentialParams[i]!.name
                if (initialParams.find((prm) => prm.name === credParamName) === undefined) {
                    updateParams.push(newCredentialParams[i]!)
                }
            }
            paramsChanged(updateParams, paramsType)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getCredentialParamsApi.data])

    // getSpecificCredentialApi successful
    useEffect(() => {
        if (getSpecificCredentialApi.data) {
            const updateValues = {
                ...credentialValues,
                ...getSpecificCredentialApi.data.credentialData,
                name: getSpecificCredentialApi.data.name
            }
            valueChanged(updateValues, paramsType)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getSpecificCredentialApi.data])

    // Initialize values
    useEffect(() => {
        setCredentialValues(initialValues)
        if (initialValues && initialValues.credentialMethod) {
            getRegisteredCredentialsApi.request(initialValues.credentialMethod)
            setNodeCredentialName(initialValues.credentialMethod)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialValues])

    // Initialize validation
    useEffect(() => {
        setCredentialValidation(initialValidation)
    }, [initialValidation])

    return (
        <>
            <Box sx={{ width: 400 }}>
                <Formik
                    enableReinitialize
                    initialValues={credentialValues || {}}
                    validationSchema={Yup.object().shape(credentialValidation)}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        try {
                            if (scriptedRef.current) {
                                const isAddNewCredential = values?.registeredCredential?.name === ADD_NEW_CREDENTIAL

                                if (!isAddNewCredential && (credentialParams.length === 0 || !values.credentialMethod)) {
                                    onSubmit(values.credentialMethod ? { ...values, submit: true } : { submit: true }, paramsType)
                                    setStatus({ success: true })
                                    setSubmitting(false)
                                } else {
                                    const body = getCredentialRequestBody(values)
                                    let response: { data: credentialApi.Credential } = undefined!
                                    if (isAddNewCredential) {
                                        response = await credentialApi.createNewCredential(body)
                                    } else {
                                        // @ts-expect-error check this later
                                        response = await credentialApi.updateCredential(values.registeredCredential?._id, body)
                                    }
                                    if (response.data) {
                                        // Open oAuth2 window
                                        if (values.credentialMethod?.toLowerCase().includes('oauth2')) {
                                            const oAuth2PopupURL = await oauth2Api.geOAuth2PopupURL(response.data._id)
                                            const popUpWindow = openOAuth2PopUpWindow(oAuth2PopupURL.data)

                                            const oAuth2Completed = async (event: MessageEvent<any>) => {
                                                if (event.data === 'success') {
                                                    window.removeEventListener('message', oAuth2Completed, false)

                                                    const submitValues = {
                                                        credentialMethod: values.credentialMethod,
                                                        registeredCredential: {
                                                            _id: response.data._id,
                                                            name: response.data.name
                                                        },
                                                        submit: true
                                                    }
                                                    clearCredentialParams()
                                                    onSubmit(submitValues, paramsType)
                                                    setStatus({ success: true })
                                                    setSubmitting(false)

                                                    if (popUpWindow) {
                                                        popUpWindow.close()
                                                    }
                                                }
                                            }
                                            window.addEventListener('message', oAuth2Completed, false)
                                            return
                                        }

                                        const submitValues = {
                                            credentialMethod: values.credentialMethod,
                                            registeredCredential: {
                                                _id: response.data._id,
                                                name: response.data.name
                                            },
                                            submit: true
                                        }
                                        clearCredentialParams()
                                        onSubmit(submitValues, paramsType)
                                        setStatus({ success: true })
                                        setSubmitting(false)
                                    } else {
                                        throw new Error(JSON.stringify(response))
                                    }
                                }
                            }
                        } catch (err) {
                            console.error(err)
                            if (scriptedRef.current) {
                                setStatus({ success: false })
                                setErrors({ submit: (err as { message: string }).message })
                                setSubmitting(false)
                            }
                        }
                    }}
                >
                    {({ errors, handleBlur, handleChange, handleSubmit, setFieldValue, isSubmitting, values }) => (
                        <form noValidate onSubmit={handleSubmit} {...others}>
                            <>
                                {initialParams.map((input) => {
                                    if (input.type === 'options') {
                                        const inputName = input.name
                                        const availableOptions = input.options || []

                                        return (
                                            <FormControl key={inputName} fullWidth sx={{ mb: 1, mt: 1 }}>
                                                <Stack direction='row'>
                                                    <Typography variant='overline'>{input.label}</Typography>
                                                    {input.description && <TooltipWithParser title={input.description} />}
                                                </Stack>
                                                <Autocomplete
                                                    id={inputName}
                                                    freeSolo
                                                    options={availableOptions}
                                                    value={
                                                        findMatchingOptions(availableOptions, values[inputName] as string) ||
                                                        getDefaultOptionValue()
                                                    }
                                                    onChange={(e, selection) => {
                                                        const value = selection
                                                            ? (selection as ElementOf<NonNullable<NodeParams['options']>>)?.name
                                                            : ''
                                                        setFieldValue(inputName, value)
                                                        const overwriteValues = {
                                                            [inputName]: value
                                                        }
                                                        onChanged(overwriteValues)
                                                        clearCredentialParams()
                                                        if (selection) {
                                                            getRegisteredCredentialsApi.request(value)
                                                            setNodeCredentialName(value)
                                                        } else {
                                                            setCredentialOptions([])
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
                                                        <Box component='li' {...props}>
                                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                <Typography sx={{ p: 1 }} variant='h5'>
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
                                                        <>*{errors[inputName]}</>
                                                    </span>
                                                )}
                                            </FormControl>
                                        )
                                    }
                                    return null
                                })}

                                {initialParams.find((prm) => prm.name === 'registeredCredential') && (
                                    <FormControl fullWidth sx={{ mb: 1, mt: 1 }}>
                                        <Stack direction='row'>
                                            <Typography variant='overline'>Registered Credential</Typography>
                                            <TooltipWithParser title='Select previously registered credential OR add new credential' />
                                        </Stack>
                                        <Autocomplete
                                            id='registered-credential'
                                            freeSolo
                                            options={credentialOptions}
                                            value={
                                                values.registeredCredential && values.credentialMethod ? values.registeredCredential : ' '
                                            }
                                            getOptionLabel={(option) => (option as CredentialOption).name || ' '}
                                            onChange={async (e, selectedCredential) => {
                                                setFieldValue(
                                                    'registeredCredential',
                                                    selectedCredential !== null ? selectedCredential : initialValues?.registeredCredential
                                                )
                                                const overwriteValues = {
                                                    ...values,
                                                    registeredCredential: selectedCredential
                                                }
                                                onChanged(overwriteValues)
                                                if (selectedCredential) {
                                                    const selectedCredential_ = selectedCredential as CredentialOption
                                                    if (selectedCredential_.name !== ADD_NEW_CREDENTIAL) {
                                                        getSpecificCredentialApi.request(selectedCredential_._id)
                                                    } else {
                                                        clearCredentialParamsValues(selectedCredential)
                                                    }
                                                    getCredentialParamsApi.request(nodeCredentialName)
                                                    if (values.credentialMethod?.toLowerCase().includes('oauth2')) {
                                                        const redirectURLResp = await oauth2Api.geOAuth2RedirectURL()
                                                        if (redirectURLResp.data) setOAuth2RedirectURL(redirectURLResp.data)
                                                    }
                                                }
                                            }}
                                            onInputChange={(e, value) => {
                                                if (!value) {
                                                    clearCredentialParams()
                                                    clearCredentialParamsValues('')
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
                                                <Box component='li' {...props}>
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <Typography sx={{ p: 1 }} variant='h5'>
                                                            {option.name}
                                                        </Typography>
                                                    </div>
                                                </Box>
                                            )}
                                        />
                                        {errors.registeredCredential && (
                                            <span style={{ color: 'red', fontSize: '0.7rem', fontStyle: 'italic' }}>
                                                *Registered Credential is required
                                            </span>
                                        )}
                                    </FormControl>
                                )}

                                {!!values.registeredCredential?._id && (
                                    <Button
                                        sx={{ mb: 2 }}
                                        size='small'
                                        variant='outlined'
                                        startIcon={<IconTrash size={15} />}
                                        onClick={() => onDeleteCredential(values.registeredCredential?._id)}
                                    >
                                        Delete Credential
                                    </Button>
                                )}

                                {oAuth2RedirectURL && (
                                    <div>
                                        <Typography variant='overline'>OAuth2 Redirect URL</Typography>
                                        <Stack direction='row'>
                                            <Typography
                                                sx={{
                                                    p: 1,
                                                    borderRadius: 10,
                                                    backgroundColor: theme.palette.primary.light,
                                                    width: 'max-content',
                                                    height: 'max-content'
                                                }}
                                                variant='h5'
                                            >
                                                {oAuth2RedirectURL}
                                            </Typography>
                                            <IconButton
                                                title='Copy URL'
                                                color='primary'
                                                onClick={() => navigator.clipboard.writeText(oAuth2RedirectURL)}
                                            >
                                                <IconCopy />
                                            </IconButton>
                                        </Stack>
                                    </div>
                                )}

                                {values.credentialMethod &&
                                    credentialParams.map((input) => {
                                        if (input.type === 'json') {
                                            const inputName = input.name

                                            return (
                                                <FormControl
                                                    key={inputName}
                                                    fullWidth
                                                    sx={{ mb: 1, mt: 1 }}
                                                    error={Boolean(errors[inputName])}
                                                >
                                                    <Stack direction='row'>
                                                        <Typography variant='overline'>{input.label}</Typography>
                                                        {input.description && <TooltipWithParser title={input.description} />}
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
                                                            value={(values[inputName] as string) || ''}
                                                            onBlur={(e) => {
                                                                const overwriteValues = {
                                                                    ...values,
                                                                    [inputName]: (e as React.FocusEvent<HTMLTextAreaElement, Element>)
                                                                        .target.value
                                                                }
                                                                onChanged(overwriteValues)
                                                            }}
                                                            onValueChange={(code) => {
                                                                setFieldValue(inputName, code)
                                                            }}
                                                            highlight={(code) => highlight(code, languages.json)}
                                                            padding={10}
                                                            style={{
                                                                fontSize: '0.875rem',
                                                                minHeight: '200px',
                                                                width: '100%'
                                                            }}
                                                            textareaClassName='editor__textarea'
                                                        />
                                                    </PerfectScrollbar>
                                                    {errors[inputName] && (
                                                        <span style={{ color: 'red', fontSize: '0.7rem', fontStyle: 'italic' }}>
                                                            *{errors[inputName]}
                                                        </span>
                                                    )}
                                                </FormControl>
                                            )
                                        }

                                        if (input.type === 'string' || input.type === 'password' || input.type === 'number') {
                                            const inputName = input.name

                                            return (
                                                <FormControl
                                                    key={inputName}
                                                    fullWidth
                                                    sx={{ mb: 1, mt: 1 }}
                                                    error={Boolean(errors[inputName])}
                                                >
                                                    <Stack direction='row'>
                                                        <Typography variant='overline'>{input.label}</Typography>
                                                        {input.description && <TooltipWithParser title={input.description} />}
                                                    </Stack>
                                                    <OutlinedInput
                                                        id={inputName}
                                                        type={input.type === 'string' || input.type === 'number' ? 'text' : input.type}
                                                        value={values[inputName] || ''}
                                                        placeholder={input.placeholder}
                                                        name={inputName}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            onChanged(values)
                                                        }}
                                                        onChange={handleChange}
                                                    />
                                                    {errors[inputName] && (
                                                        <span style={{ color: 'red', fontSize: '0.7rem', fontStyle: 'italic' }}>
                                                            *{errors[inputName]}
                                                        </span>
                                                    )}
                                                </FormControl>
                                            )
                                        }

                                        if (input.type === 'boolean') {
                                            const inputName = input.name

                                            return (
                                                <FormControl
                                                    key={inputName}
                                                    fullWidth
                                                    sx={{ mb: 1, mt: 1 }}
                                                    error={Boolean(errors[inputName])}
                                                >
                                                    <Stack direction='row'>
                                                        <Typography variant='overline'>{input.label}</Typography>
                                                        {input.description && <TooltipWithParser title={input.description} />}
                                                    </Stack>
                                                    <Switch
                                                        checked={!!values[inputName]}
                                                        onChange={(event) => {
                                                            setFieldValue(inputName, event.target.checked)
                                                            const overwriteValues = {
                                                                ...values,
                                                                [inputName]: event.target.checked
                                                            }
                                                            onChanged(overwriteValues)
                                                        }}
                                                        inputProps={{ 'aria-label': 'controlled' }}
                                                    />
                                                </FormControl>
                                            )
                                        }

                                        if (input.type === 'options') {
                                            const inputName = input.name
                                            const availableOptions = input.options || []

                                            return (
                                                <FormControl key={inputName} fullWidth sx={{ mb: 1, mt: 1 }}>
                                                    <Stack direction='row'>
                                                        <Typography variant='overline'>{input.label}</Typography>
                                                        {input.description && <TooltipWithParser title={input.description} />}
                                                    </Stack>
                                                    <Autocomplete
                                                        id={inputName}
                                                        freeSolo
                                                        options={availableOptions}
                                                        value={
                                                            findMatchingOptions(availableOptions, values[inputName] as string) ||
                                                            getDefaultOptionValue()
                                                        }
                                                        onChange={(e, selection) => {
                                                            const value = selection
                                                                ? (selection as ElementOf<NonNullable<NodeParams['options']>>).name
                                                                : ''
                                                            setFieldValue(inputName, value)
                                                            const overwriteValues = {
                                                                ...values,
                                                                [inputName]: value
                                                            }
                                                            onChanged(overwriteValues)
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
                                                            <Box component='li' {...props}>
                                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                    <Typography sx={{ p: 1 }} variant='h5'>
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
                                                </FormControl>
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
                                            size='large'
                                            type='submit'
                                            variant='contained'
                                            color='secondary'
                                        >
                                            {values &&
                                            values.registeredCredential &&
                                            (values.registeredCredential.name === ADD_NEW_CREDENTIAL || credentialParams.length)
                                                ? 'Save and Continue'
                                                : 'Continue'}
                                        </Button>
                                    </AnimateButton>
                                </Box>
                            </>
                        </form>
                    )}
                </Formik>
            </Box>
        </>
    )
}
