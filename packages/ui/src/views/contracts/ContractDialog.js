import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { enqueueSnackbar as enqueueSnackbarAction, closeSnackbar as closeSnackbarAction } from 'store/actions'

import {
    Avatar,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Box,
    Divider,
    Chip,
    Typography,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    IconButton
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useTheme } from '@mui/material/styles'

// third-party
import * as Yup from 'yup'
import lodash from 'lodash'
import { ethers } from 'ethers'

// project imports
import InputParameters from 'views/inputs/InputParameters'
import CredentialInput from 'views/inputs/CredentialInput'
import EditVariableDialog from 'ui-component/dialog/EditVariableDialog'

// Icons
import { IconExclamationMark, IconCheck, IconX, IconArrowUpRightCircle, IconCopy } from '@tabler/icons'

// API
import contractsApi from 'api/contracts'

// Hooks
import useApi from 'hooks/useApi'

// Const
import { contract_details, networks, networkExplorers } from 'store/constant'

// utils
import { handleCredentialParams, initializeNodeData } from 'utils/genericHelper'
import useNotifier from 'utils/useNotifier'

const ContractDialog = ({ show, dialogProps, onCancel, onConfirm }) => {
    const portalElement = document.getElementById('portal')

    const theme = useTheme()
    const dispatch = useDispatch()

    // ==============================|| Snackbar ||============================== //

    useNotifier()
    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args))
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args))

    const [contractDetails, setContractDetails] = useState(contract_details)
    const [contractData, setContractData] = useState({})
    const [contractParams, setContractParams] = useState([])
    const [contractValues, setContractValues] = useState({})
    const [contractValidation, setContractValidation] = useState({})
    const [expanded, setExpanded] = useState(false)
    const [invalidAddress, setInvalidAddress] = useState(false)
    const [invalidABI, setInvalidABI] = useState('')
    const [isReadyToAdd, setIsReadyToAdd] = useState(false)
    const [isEditVariableDialogOpen, setEditVariableDialog] = useState(false)
    const [editVariableDialogProps, setEditVariableDialogProps] = useState({})
    const contractParamsType = ['networks', 'credentials', 'contractInfo']

    const getSpecificContractApi = useApi(contractsApi.getSpecificContract)

    const handleAccordionChange = (expanded) => (event, isExpanded) => {
        setExpanded(isExpanded ? expanded : false)
    }

    const reset = () => {
        setContractData({})
        setContractParams([])
        setContractValues({})
        setContractValidation({})
        setInvalidAddress(false)
        setInvalidABI('')
        setIsReadyToAdd(false)
        setExpanded(false)
    }

    const checkIsReadyToAdd = () => {
        for (let i = 0; i < contractParamsType.length; i += 1) {
            const paramType = contractParamsType[i]
            if (!contractData[paramType] || !contractData[paramType].submit) {
                setIsReadyToAdd(false)
                return
            }
        }
        setIsReadyToAdd(true)
    }

    const onEditVariableDialogOpen = (input, values, arrayItemBody) => {
        const dialogProps = {
            input,
            values,
            arrayItemBody,
            cancelButtonName: 'Cancel',
            confirmButtonName: 'Save',
            hideVariables: true
        }

        setEditVariableDialogProps(dialogProps)
        setEditVariableDialog(true)
    }

    const addNewContract = async () => {
        const createNewContractBody = {
            network: contractData.networks.network,
            name: contractData.contractInfo.name,
            abi: contractData.contractInfo.abi,
            address: contractData.contractInfo.address,
            providerCredential: JSON.stringify(contractData.credentials)
        }
        try {
            const createResp = await contractsApi.createNewContract(createNewContractBody)
            if (createResp.data) {
                enqueueSnackbar({
                    message: 'New contract added',
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'success',
                        action: (key) => (
                            <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                                <IconX />
                            </Button>
                        )
                    }
                })
                onConfirm()
            }
        } catch (error) {
            const errorData = error.response.data || `${error.response.status}: ${error.response.statusText}`
            enqueueSnackbar({
                message: `Failed to add new contract: ${errorData}`,
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'error',
                    persist: true,
                    action: (key) => (
                        <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                            <IconX />
                        </Button>
                    )
                }
            })
            onCancel()
        }
    }

    const saveContract = async () => {
        const saveContractBody = {
            network: contractData.networks.network,
            name: contractData.contractInfo.name,
            abi: contractData.contractInfo.abi,
            address: contractData.contractInfo.address,
            providerCredential: JSON.stringify(contractData.credentials)
        }
        try {
            const saveResp = await contractsApi.updateContract(dialogProps.id, saveContractBody)
            if (saveResp.data) {
                enqueueSnackbar({
                    message: 'Contract saved',
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'success',
                        action: (key) => (
                            <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                                <IconX />
                            </Button>
                        )
                    }
                })
                onConfirm()
            }
        } catch (error) {
            const errorData = error.response.data || `${error.response.status}: ${error.response.statusText}`
            enqueueSnackbar({
                message: `Failed to save contract: ${errorData}`,
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'error',
                    persist: true,
                    action: (key) => (
                        <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                            <IconX />
                        </Button>
                    )
                }
            })
            onCancel()
        }
    }

    const deleteContract = async () => {
        try {
            const deleteResp = await contractsApi.deleteContract(dialogProps.id)
            if (deleteResp.data) {
                enqueueSnackbar({
                    message: 'Contract deleted',
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'success',
                        action: (key) => (
                            <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                                <IconX />
                            </Button>
                        )
                    }
                })
                onConfirm()
            }
        } catch (error) {
            const errorData = error.response.data || `${error.response.status}: ${error.response.statusText}`
            enqueueSnackbar({
                message: `Failed to delete contract: ${errorData}`,
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'error',
                    persist: true,
                    action: (key) => (
                        <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                            <IconX />
                        </Button>
                    )
                }
            })
            onCancel()
        }
    }

    const fetchABI = async (formValues, paramsType) => {
        const selectedNetwork = networks.find((network) => network.name === contractData.networks.network)
        if (!selectedNetwork) return

        const body = {
            ...contractData,
            networks: {
                ...contractData.networks,
                uri: selectedNetwork.uri || ''
            }
        }

        const resp = await contractsApi.getContractABI(body)
        if (!resp.data) {
            const updateContractData = {
                ...contractData,
                [paramsType]: { ...formValues, submit: null }
            }
            setContractData(updateContractData)
            setInvalidABI('Unable to fetch ABI')
            return
        } else {
            const status = resp.data.status
            if (status === '0') {
                setInvalidABI('Unable to fetch ABI')
                return
            }
            const abi = resp.data.result
            setInvalidABI('')
            return abi === 'Invalid API Key' ? undefined : abi
        }
    }

    const valueChanged = (formValues, paramsType) => {
        const updateContractData = {
            ...contractData,
            [paramsType]: formValues
        }

        const index = contractParamsType.indexOf(paramsType)
        if (index >= 0 && index !== contractParamsType.length - 1) {
            for (let i = index + 1; i < contractParamsType.length; i += 1) {
                const paramType = contractParamsType[i]
                if (updateContractData[paramType]) updateContractData[paramType].submit = null
            }
        }

        setContractData(updateContractData)
    }

    const paramsChanged = (formParams, paramsType) => {
        // Because formParams options can be changed due to show hide options,
        // To avoid that, replace with original details options

        const credentialMethodParam = formParams.find((param) => param.name === 'credentialMethod')
        const credentialMethodParamIndex = formParams.findIndex((param) => param.name === 'credentialMethod')

        if (credentialMethodParam !== undefined) {
            const originalParam = contractDetails[paramsType].find((param) => param.name === 'credentialMethod')
            if (originalParam !== undefined) {
                formParams[credentialMethodParamIndex]['options'] = originalParam.options
            }
        }

        const updateContractDetails = {
            ...contractDetails,
            [paramsType]: formParams
        }
        setContractDetails(updateContractDetails)
    }

    const onSubmit = async (formValues, paramsType) => {
        if (formValues.address) {
            if (ethers.utils.isAddress(formValues.address)) {
                setInvalidAddress(false)
                const abi = await fetchABI(formValues, paramsType)
                if (abi) {
                    const updateFormValues = {
                        submit: true,
                        ...formValues
                    }
                    updateFormValues.abi = abi
                    const updateContractData = {
                        ...contractData,
                        [paramsType]: updateFormValues
                    }
                    setContractData(updateContractData)
                } else {
                    const updateContractData = {
                        ...contractData,
                        [paramsType]: { ...formValues, submit: null }
                    }
                    setContractData(updateContractData)
                }
            } else {
                setInvalidAddress(true)
                const updateContractData = {
                    ...contractData,
                    [paramsType]: { ...formValues, submit: null }
                }
                setContractData(updateContractData)
            }
        } else {
            const updateContractData = {
                ...contractData,
                [paramsType]: formValues
            }
            setContractData(updateContractData)
        }

        const index = contractParamsType.indexOf(paramsType)
        if (index >= 0 && index !== contractParamsType.length - 1) {
            setExpanded(contractParamsType[index + 1])
        }
    }

    const showHideOptions = (displayType, options) => {
        let returnOptions = options
        const toBeDeleteOptions = []

        for (let i = 0; i < returnOptions.length; i += 1) {
            const option = returnOptions[i]
            const displayOptions = option[displayType]

            if (displayOptions) {
                Object.keys(displayOptions).forEach((path) => {
                    const comparisonValue = displayOptions[path]
                    const groundValue = lodash.get(contractData, path, '')
                    if (Array.isArray(comparisonValue)) {
                        if (displayType === 'show' && !comparisonValue.includes(groundValue)) {
                            toBeDeleteOptions.push(option)
                        }
                        if (displayType === 'hide' && comparisonValue.includes(groundValue)) {
                            toBeDeleteOptions.push(option)
                        }
                    }
                })
            }
        }

        for (let i = 0; i < toBeDeleteOptions.length; i += 1) {
            returnOptions = returnOptions.filter((opt) => JSON.stringify(opt) !== JSON.stringify(toBeDeleteOptions[i]))
        }

        return returnOptions
    }

    const displayOptions = (params) => {
        let clonedParams = params

        for (let i = 0; i < clonedParams.length; i += 1) {
            const input = clonedParams[i]
            if (input.type === 'options') {
                input.options = showHideOptions('show', input.options)
                input.options = showHideOptions('hide', input.options)
            }
        }

        return clonedParams
    }

    const setYupValidation = (params) => {
        const validationSchema = {}
        for (let i = 0; i < params.length; i += 1) {
            const input = params[i]
            if (input.type === 'string' && !input.optional) {
                validationSchema[input.name] = Yup.string().required(`${input.label} is required. Type: ${input.type}`)
            } else if (input.type === 'number' && !input.optional) {
                validationSchema[input.name] = Yup.number().required(`${input.label} is required. Type: ${input.type}`)
            } else if ((input.type === 'options' || input.type === 'asyncOptions') && !input.optional) {
                validationSchema[input.name] = Yup.string().required(`${input.label} is required. Type: ${input.type}`)
            }
        }
        return validationSchema
    }

    const initializeFormValuesAndParams = (paramsType) => {
        const initialValues = {}
        let contractParams = displayOptions(lodash.cloneDeep(contractDetails[paramsType] || []))
        contractParams = handleCredentialParams(contractParams, paramsType, contractDetails[paramsType], contractData)

        for (let i = 0; i < contractParams.length; i += 1) {
            const input = contractParams[i]

            // Load from contractData values
            if (paramsType in contractData && input.name in contractData[paramsType]) {
                initialValues[input.name] = contractData[paramsType][input.name]

                // Check if option value is still available from the list of options
                if (input.type === 'options') {
                    const optionVal = input.options.find((option) => option.name === initialValues[input.name])
                    if (!optionVal) delete initialValues[input.name]
                }
            } else {
                // Load from contractParams default values
                initialValues[input.name] = input.default || ''
            }
        }

        initialValues.submit = null

        setContractValues(initialValues)
        setContractValidation(setYupValidation(contractParams))
        setContractParams(contractParams)
    }

    const transformContractResponse = (contractResponseData, contractDetails) => {
        const contractData = {
            networks: {},
            credentials: {},
            contractInfo: {}
        }

        if (contractResponseData) {
            contractData.networks = { network: contractResponseData.network, submit: true }
            contractData.contractInfo = { ...contractResponseData, submit: true }
            if (contractResponseData.providerCredential) {
                try {
                    contractData.credentials = JSON.parse(contractResponseData.providerCredential)
                } catch (e) {
                    console.error(e)
                }
            }
        } else {
            contractData.networks = initializeNodeData(contractDetails.networks)
            contractData.credentials = initializeNodeData(contractDetails.credentials)
            contractData.contractInfo = initializeNodeData(contractDetails.contractInfo)
        }
        return contractData
    }

    // Get Contract Details from API
    useEffect(() => {
        if (getSpecificContractApi.data) {
            const contractResponseData = getSpecificContractApi.data
            setContractData(transformContractResponse(contractResponseData))
            setExpanded('networks')
        }
    }, [getSpecificContractApi.data])

    // Initialization
    useEffect(() => {
        if (show && dialogProps.type === 'ADD') {
            reset()
            setContractData(transformContractResponse(null, contractDetails))
            setExpanded('networks')
        } else if (show && dialogProps.type === 'EDIT' && dialogProps.id) {
            reset()
            getSpecificContractApi.request(dialogProps.id)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show, dialogProps])

    // Initialize Parameters Initial Values & Validation
    useEffect(() => {
        if (contractDetails && contractData && expanded) {
            initializeFormValuesAndParams(expanded)
            checkIsReadyToAdd()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contractDetails, contractData, expanded])

    const component = show ? (
        <Dialog open={show} onClose={onCancel} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
            <DialogTitle sx={{ fontSize: '1rem' }} id='alert-dialog-title'>
                {dialogProps.title}
            </DialogTitle>
            <DialogContent>
                {dialogProps.type === 'ADD' && (
                    <Chip
                        sx={{ mb: 1 }}
                        icon={<IconExclamationMark />}
                        label='You can only add contract which has been publicly verified'
                        color='warning'
                    />
                )}

                {contractData && contractData.contractInfo && contractData.contractInfo.address && dialogProps.type === 'EDIT' && (
                    <Box sx={{ p: 2 }}>
                        <Typography sx={{ p: 1 }} variant='overline'>
                            ADDRESS
                        </Typography>
                        <Stack direction='row' sx={{ p: 1 }}>
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
                                {contractData.contractInfo.address}
                            </Typography>
                            <IconButton
                                title='Copy Address'
                                color='primary'
                                onClick={() => navigator.clipboard.writeText(contractData.contractInfo.address)}
                            >
                                <IconCopy />
                            </IconButton>
                            <IconButton
                                title='Open in Block Explorer'
                                color='primary'
                                onClick={() =>
                                    window.open(
                                        `${networkExplorers[contractData.networks.network]}/address/${contractData.contractInfo.address}`,
                                        '_blank'
                                    )
                                }
                            >
                                <IconArrowUpRightCircle />
                            </IconButton>
                        </Stack>
                    </Box>
                )}

                {/* networks */}
                <Box sx={{ p: 2 }}>
                    <Accordion expanded={expanded === 'networks'} onChange={handleAccordionChange('networks')}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='networks-content' id='networks-header'>
                            <Typography variant='h4'>Networks</Typography>
                            {contractData && contractData.networks && contractData.networks.submit && (
                                <Avatar
                                    variant='rounded'
                                    sx={{
                                        ...theme.typography.smallAvatar,
                                        borderRadius: '50%',
                                        background: theme.palette.success.dark,
                                        color: 'white',
                                        ml: 2
                                    }}
                                >
                                    <IconCheck />
                                </Avatar>
                            )}
                        </AccordionSummary>
                        <AccordionDetails>
                            <InputParameters
                                paramsType='networks'
                                params={contractParams}
                                initialValues={contractValues}
                                nodeParamsValidation={contractValidation}
                                valueChanged={valueChanged}
                                onSubmit={onSubmit}
                                setVariableSelectorState={() => null}
                                onEditVariableDialogOpen={onEditVariableDialogOpen}
                            />
                        </AccordionDetails>
                    </Accordion>
                    <Divider />
                </Box>

                {/* credentials */}
                <Box sx={{ p: 2 }}>
                    <Accordion expanded={expanded === 'credentials'} onChange={handleAccordionChange('credentials')}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='credentials-content' id='credentials-header'>
                            <Typography variant='h4'>Credentials</Typography>
                            {contractData && contractData.credentials && contractData.credentials.submit && (
                                <Avatar
                                    variant='rounded'
                                    sx={{
                                        ...theme.typography.smallAvatar,
                                        borderRadius: '50%',
                                        background: theme.palette.success.dark,
                                        color: 'white',
                                        ml: 2
                                    }}
                                >
                                    <IconCheck />
                                </Avatar>
                            )}
                        </AccordionSummary>
                        <AccordionDetails>
                            <CredentialInput
                                paramsType='credentials'
                                initialParams={contractParams}
                                initialValues={contractValues}
                                initialValidation={contractValidation}
                                valueChanged={valueChanged}
                                paramsChanged={paramsChanged}
                                onSubmit={onSubmit}
                            />
                        </AccordionDetails>
                    </Accordion>
                    <Divider />
                </Box>

                {/* contractInfo */}
                <Box sx={{ p: 2 }}>
                    <Accordion expanded={expanded === 'contractInfo'} onChange={handleAccordionChange('contractInfo')}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='contractInfo-content' id='contractInfo-header'>
                            <Typography variant='h4'>Contract Details</Typography>
                            {contractData && contractData.contractInfo && contractData.contractInfo.submit && (
                                <Avatar
                                    variant='rounded'
                                    sx={{
                                        ...theme.typography.smallAvatar,
                                        borderRadius: '50%',
                                        background: theme.palette.success.dark,
                                        color: 'white',
                                        ml: 2
                                    }}
                                >
                                    <IconCheck />
                                </Avatar>
                            )}
                        </AccordionSummary>
                        <AccordionDetails>
                            <InputParameters
                                paramsType='contractInfo'
                                params={contractParams}
                                initialValues={contractValues}
                                nodeParamsValidation={contractValidation}
                                valueChanged={valueChanged}
                                onSubmit={onSubmit}
                                setVariableSelectorState={() => null}
                                onEditVariableDialogOpen={onEditVariableDialogOpen}
                            />
                            {invalidAddress && (
                                <Chip sx={{ mt: 2, mb: 1 }} icon={<IconX />} label='Invalid Contract Address' color='error' />
                            )}
                            {invalidABI && (
                                <Chip sx={{ mt: 2, mb: 1, ml: invalidAddress ? 2 : 0 }} icon={<IconX />} label={invalidABI} color='error' />
                            )}
                        </AccordionDetails>
                    </Accordion>
                    <Divider />
                </Box>
                <EditVariableDialog
                    key={JSON.stringify(editVariableDialogProps)}
                    show={isEditVariableDialogOpen}
                    dialogProps={editVariableDialogProps}
                    onCancel={() => setEditVariableDialog(false)}
                    onConfirm={(updateValues) => {
                        valueChanged(updateValues, expanded)
                        setEditVariableDialog(false)
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>{dialogProps.cancelButtonName}</Button>
                {dialogProps.type === 'EDIT' && (
                    <Button variant='contained' color='error' onClick={() => deleteContract()}>
                        Delete
                    </Button>
                )}
                <Button
                    variant='contained'
                    disabled={!isReadyToAdd}
                    onClick={() => (dialogProps.type === 'ADD' ? addNewContract() : saveContract())}
                >
                    {dialogProps.confirmButtonName}
                </Button>
            </DialogActions>
        </Dialog>
    ) : null

    return createPortal(component, portalElement)
}

ContractDialog.propTypes = {
    show: PropTypes.bool,
    dialogProps: PropTypes.object,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func
}

export default ContractDialog
