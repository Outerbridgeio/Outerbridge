import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { 
    enqueueSnackbar as enqueueSnackbarAction,
    closeSnackbar as closeSnackbarAction,
} from 'store/actions';

import {
    Avatar,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Box,
    Divider,
    Typography,
    Button, 
    Dialog, 
    DialogActions,
    DialogContent, 
    DialogTitle,
    Stack,
    IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@mui/material/styles';

// third-party
import * as Yup from 'yup';
import lodash from 'lodash';

// project imports
import InputParameters from 'views/inputs/InputParameters';
import CredentialInput from 'views/inputs/CredentialInput';

// Icons
import { IconCheck, IconX, IconArrowUpRightCircle, IconCopy, IconKey } from '@tabler/icons';

// API
import walletsApi from "api/wallets";

// Hooks
import useApi from "hooks/useApi";

// Const
import { wallet_details, networkExplorers, privateKeyField } from "store/constant";

// utils
import { handleCredentialParams, initializeNodeData } from 'utils/genericHelper';
import useNotifier from 'utils/useNotifier';

const WalletDialog = ({
    show,
    dialogProps,
    onCancel,
    onConfirm
}) => {

    const portalElement = document.getElementById('portal');

    const theme = useTheme();
    const dispatch = useDispatch();

    // ==============================|| Snackbar ||============================== //

    useNotifier();
    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args));
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args));

    const [walletDetails, setWalletDetails] = useState(wallet_details);
    const [walletData, setWalletData] = useState({});
    const [walletParams, setWalletParams] = useState([]);
    const [walletValues, setWalletValues] = useState({});
    const [walletValidation, setWalletValidation] = useState({});
    const [walletCredential, setWalletCredential] = useState({});
    const [expanded, setExpanded] = useState(false);
    const [isReadyToAdd, setIsReadyToAdd] = useState(false);
    const walletParamsType = ['networks', 'credentials', 'walletInfo'];

    const getSpecificWalletApi = useApi(walletsApi.getSpecificWallet);
    const getWalletCredentialApi = useApi(walletsApi.getWalletCredential);

    const handleAccordionChange = (expanded) => (event, isExpanded) => {
        setExpanded(isExpanded ? expanded : false);
    };

    const reset = () => {
        setWalletData({});
        setWalletParams([]);
        setWalletValues({});
        setWalletValidation({});
        setWalletCredential({});
        setIsReadyToAdd(false);
        setExpanded(false);
    }

    const checkIsReadyToAdd = () => {
        for (let i = 0; i < walletParamsType.length; i+= 1) {
            const paramType = walletParamsType[i];
            if (!walletData[paramType] || !walletData[paramType].submit) {
                setIsReadyToAdd(false);
                return;
            }
        }
        setIsReadyToAdd(true);
    };

    const addNewWallet = async(type) => {
        const createNewWalletBody = {
            network: walletData.networks.network,
            name: walletData.walletInfo.name,
            providerCredential: JSON.stringify(walletData.credentials)
        }
        if (type === 'IMPORT') createNewWalletBody.privateKey = walletData.walletInfo.privateKey;
        const createResp = await walletsApi.createNewWallet(createNewWalletBody);
        if (createResp.data) {
            enqueueSnackbar({
                message: 'New wallet added',
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'success',
                    action: key => (
                        <Button style={{color: 'white'}} onClick={() => closeSnackbar(key)}>
                            <IconX />
                        </Button>
                    ),
                },
            });
            onConfirm();
        } else {
            enqueueSnackbar({
                message: 'Failed to add new wallet',
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'error',
                    persist: true,
                    action: key => (
                        <Button style={{color: 'white'}} onClick={() => closeSnackbar(key)}>
                            <IconX />
                        </Button>
                    ),
                },
            });
            onCancel();
        }
    }

    const saveWallet = async() => {
        const saveWalletBody = {
            network: walletData.networks.network,
            name: walletData.walletInfo.name,
            providerCredential: JSON.stringify(walletData.credentials)
        }
        const saveResp = await walletsApi.updateWallet(dialogProps.id, saveWalletBody);
        if (saveResp.data) {
            enqueueSnackbar({
                message: 'Wallet saved',
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'success',
                    action: key => (
                        <Button style={{color: 'white'}} onClick={() => closeSnackbar(key)}>
                            <IconX />
                        </Button>
                    ),
                },
            });
            onConfirm();
        } else {
            enqueueSnackbar({
                message: 'Failed to save wallet',
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'error',
                    persist: true,
                    action: key => (
                        <Button style={{color: 'white'}} onClick={() => closeSnackbar(key)}>
                            <IconX />
                        </Button>
                    ),
                },
            });
            onCancel();
        }
    }

    const deleteWallet = async() => {
        const deleteResp = await walletsApi.deleteWallet(dialogProps.id);
        if (deleteResp.data) {
            enqueueSnackbar({
                message: 'Wallet deleted',
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'success',
                    action: key => (
                        <Button style={{color: 'white'}} onClick={() => closeSnackbar(key)}>
                            <IconX />
                        </Button>
                    ),
                },
            });
            onConfirm();
        } else {
            enqueueSnackbar({
                message: 'Failed to delete wallet',
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'error',
                    persist: true,
                    action: key => (
                        <Button style={{color: 'white'}} onClick={() => closeSnackbar(key)}>
                            <IconX />
                        </Button>
                    ),
                },
            });
            onCancel();
        }
    }

    const valueChanged = (formValues, paramsType) => {
        const updateWalletData = {
            ...walletData,
            [paramsType]: formValues
        };

        const index = walletParamsType.indexOf(paramsType);
        if (index >= 0 && index !== walletParamsType.length - 1) {
            for (let i = index+1; i < walletParamsType.length; i+= 1) {
                const paramType = walletParamsType[i];
                if (updateWalletData[paramType]) updateWalletData[paramType].submit = null;
            }
        }
        
        setWalletData(updateWalletData);
    };

    const paramsChanged = (formParams, paramsType) => {

        // Because formParams options can be changed due to show hide options, 
        // To avoid that, replace with original details options

        const credentialMethodParam = formParams.find((param) => param.name === 'credentialMethod');
        const credentialMethodParamIndex = formParams.findIndex((param) => param.name === 'credentialMethod');
        
        if (credentialMethodParam !== undefined) {
            const originalParam = walletDetails[paramsType].find((param) => param.name === 'credentialMethod');
            if (originalParam !== undefined) {
                formParams[credentialMethodParamIndex]['options'] = originalParam.options;
            }
        }

        const updateWalletDetails = {
            ...walletDetails,
            [paramsType]: formParams
        };
        setWalletDetails(updateWalletDetails);
    };

    const onSubmit = async(formValues, paramsType) => {
        const updateWalletData = {
            ...walletData,
            [paramsType]: formValues
        };
        setWalletData(updateWalletData);
        
        const index = walletParamsType.indexOf(paramsType);
        if (index >= 0 && index !== walletParamsType.length - 1) {
            setExpanded(walletParamsType[index+1]);
        } else if (index === walletParamsType.length - 1) {
            setExpanded(false);
        }
    };

    const showHideOptions = (displayType, options) => {
       
        let returnOptions = options;
        const toBeDeleteOptions = [];

        for (let i = 0; i < returnOptions.length; i+= 1) {
            const option = returnOptions[i];
            const displayOptions = option[displayType];

            if (displayOptions) {
                Object.keys(displayOptions).forEach((path) => {

                    const comparisonValue = displayOptions[path];
                    const groundValue = lodash.get(walletData, path, '');
                   
                    if (Array.isArray(comparisonValue)) {
                        if (displayType === 'show' && !comparisonValue.includes(groundValue)) {
                            toBeDeleteOptions.push(option);
                        }
                        if (displayType === 'hide' && comparisonValue.includes(groundValue)) {
                            toBeDeleteOptions.push(option);
                        }
                    }
                });
            }
        }

        for (let i = 0; i < toBeDeleteOptions.length; i+= 1) {
            returnOptions = returnOptions.filter((opt) => JSON.stringify(opt) !== JSON.stringify(toBeDeleteOptions[i]));
        }

        return returnOptions;
    }

    const displayOptions = (params) => {
      
        let clonedParams = params;

        for (let i = 0; i < clonedParams.length; i+= 1) {
            const input = clonedParams[i];
            if (input.type === 'options') {
                input.options = showHideOptions('show', input.options);
                input.options = showHideOptions('hide', input.options);
            }
        }
      
        return clonedParams;
    };

    const setYupValidation = (params) => {
        const validationSchema = {};
        for (let i = 0; i < params.length; i+= 1) {
            const input = params[i];
            if (input.type === 'string' && !input.optional) {
                validationSchema[input.name] = Yup.string().required(`${input.label} is required. Type: ${input.type}`);
            } else if (input.type === 'number' && !input.optional) {
                validationSchema[input.name] = Yup.number().required(`${input.label} is required. Type: ${input.type}`);
            } else if ((input.type === 'options' || input.type === 'asyncOptions') && !input.optional) {
                validationSchema[input.name] = Yup.string().required(`${input.label} is required. Type: ${input.type}`);
            }
        }
        return validationSchema;
    };

    const initializeFormValuesAndParams = (paramsType) => {

        const initialValues = {};
        let walletParams = displayOptions(lodash.cloneDeep(walletDetails[paramsType] || []));
        walletParams = handleCredentialParams(walletParams, paramsType, walletDetails[paramsType], walletData);

        if (dialogProps.type === 'IMPORT' && paramsType === 'walletInfo') {
            walletParams.push(...privateKeyField);
        }
  
        for (let i = 0; i < walletParams.length; i+= 1) {
            const input = walletParams[i];

            // Load from walletData values
            if (paramsType in walletData && input.name in walletData[paramsType]) {
                initialValues[input.name] = walletData[paramsType][input.name];
         
                // Check if option value is still available from the list of options
                if (input.type === 'options') {
                    const optionVal = input.options.find((option) => option.name === initialValues[input.name]);
                    if (!optionVal) delete initialValues[input.name];
                }
            } else {
                // Load from walletParams default values
                initialValues[input.name] = input.default || '';
            }
        }
        
        initialValues.submit = null;
        
        setWalletValues(initialValues);
        setWalletValidation(setYupValidation(walletParams));
        setWalletParams(walletParams);
    };

    const transformWalletResponse = (walletResponseData, walletDetails) => {
        const walletData = {
            networks: {},
            credentials: {},
            walletInfo: {}
        }

        if (walletResponseData) {
            walletData.networks = { network: walletResponseData.network, submit: true };
            walletData.walletInfo = { ...walletResponseData, submit: true };
            if (walletResponseData.providerCredential) {
                try {
                    walletData.credentials = JSON.parse(walletResponseData.providerCredential);
                } catch(e) { 
                    console.error(e); 
                }
            }
        } else {
            walletData.networks = initializeNodeData(walletDetails.networks);
            walletData.credentials = initializeNodeData(walletDetails.credentials);
            walletData.walletInfo = initializeNodeData(walletDetails.walletInfo);
        }
        return walletData;
    }

    // Get Wallet Details from API
    useEffect(() => {
        if (getSpecificWalletApi.data) {
            const walletResponseData = getSpecificWalletApi.data;
            setWalletData(transformWalletResponse(walletResponseData));
            setExpanded('networks');
        }

    }, [getSpecificWalletApi.data]); 


    // Get Wallet Credential from API
    useEffect(() => {
        if (getWalletCredentialApi.data) {
            const walletCredResponseData = getWalletCredentialApi.data;
            setWalletCredential(walletCredResponseData);
        }

    }, [getWalletCredentialApi.data]); 


    // Initialization
    useEffect(() => {
        if (show && (dialogProps.type === 'ADD' || dialogProps.type === 'IMPORT')) {
            reset();
            setWalletData(transformWalletResponse(null, walletDetails));
            setExpanded('networks');

        } else if (show && dialogProps.type === 'EDIT' && dialogProps.id) {
            reset();
            getSpecificWalletApi.request(dialogProps.id);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show, dialogProps]); 

    
    // Initialize Parameters Initial Values & Validation
    useEffect(() => {
        if (walletDetails && walletData && expanded) {
            initializeFormValuesAndParams(expanded);
            checkIsReadyToAdd();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [walletDetails, walletData, expanded]);


    const component = show ? (
        <Dialog
            open={show}
            onClose={onCancel}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle sx={{ fontSize: '1rem' }} id="alert-dialog-title">
                {dialogProps.title}
            </DialogTitle>
            <DialogContent>

                {walletData && walletData.walletInfo && walletData.walletInfo.address && dialogProps.type === 'EDIT' && 
                <Box sx={{ p: 2 }}>
                    <Typography sx={{ p: 1 }} variant="overline">BALANCE</Typography>
                    <Typography sx={{ p: 1, mb: 1 }} variant="h3">{walletData.walletInfo.balance}</Typography>
                    <Typography sx={{ p: 1 }} variant="overline">ADDRESS</Typography>
                    <Stack direction="row" sx={{ p: 1, mb: 1}}>
                        <Typography sx={{ p: 1, borderRadius: 10, backgroundColor: theme.palette.primary.light, width: 'max-content', height: 'max-content' }} variant="h5">{walletData.walletInfo.address}</Typography>
                        <IconButton title="Copy Address" color="primary" onClick={() => navigator.clipboard.writeText(walletData.walletInfo.address)}>
                            <IconCopy />
                        </IconButton>
                        <IconButton title="Open in Block Explorer" color="primary" onClick={() => window.open(`${networkExplorers[walletData.networks.network]}/address/${walletData.walletInfo.address}`, "_blank")}>
                            <IconArrowUpRightCircle />
                        </IconButton>
                    </Stack>
                    {walletCredential && walletCredential.privateKey && 
                    <>
                        <Typography sx={{ p: 1 }} variant="overline">PRIVATE KEY</Typography>
                        <Stack direction="row" sx={{ p: 1, mb: 1}}>
                            <Typography sx={{ p: 1, borderRadius: 10, backgroundColor: theme.palette.primary.light, width: 'max-content', height: 'max-content' }} variant="h5">{walletCredential.privateKey}</Typography>
                            <IconButton title="Copy Key" color="primary" onClick={() => navigator.clipboard.writeText(walletCredential.privateKey)}>
                                <IconCopy />
                            </IconButton>
                        </Stack>
                    </>}
                    {walletCredential && walletCredential.mnemonic && 
                    <>
                        <Typography sx={{ p: 1 }} variant="overline">mnemonic</Typography>
                        <Stack direction="row" sx={{ p: 1, mb: 1}}>
                            <Typography sx={{ p: 1, borderRadius: 10, backgroundColor: theme.palette.primary.light, width: 'max-content', height: 'max-content' }} variant="h5">{walletCredential.mnemonic}</Typography>
                            <IconButton title="Copy Mnemonic" color="primary" onClick={() => navigator.clipboard.writeText(walletCredential.mnemonic)}>
                                <IconCopy />
                            </IconButton>
                        </Stack>
                    </>}
                    {!Object.keys(walletCredential).length && <Button size="small" sx={{ml: 1}} variant="contained" startIcon={<IconKey />} onClick={() => getWalletCredentialApi.request(dialogProps.id)}>
                        View PrivateKey and Mnemonic
                    </Button>}
                </Box>}

                {/* networks */}
                <Box sx={{ p: 2 }}>
                    <Accordion expanded={expanded === 'networks'} onChange={handleAccordionChange('networks')}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="networks-content"
                            id="networks-header" 
                        >
                            <Typography variant="h4">
                                Networks
                            </Typography>
                            {walletData && walletData.networks && walletData.networks.submit &&
                            (<Avatar
                                variant="rounded"
                                sx={{
                                    ...theme.typography.smallAvatar,
                                    borderRadius: '50%',
                                    background: theme.palette.success.dark,
                                    color: 'white',
                                    ml: 2
                                }}
                            >
                                <IconCheck />
                            </Avatar>)}
                        </AccordionSummary>
                        <AccordionDetails>
                            <InputParameters 
                                paramsType="networks"
                                params={walletParams} 
                                initialValues={walletValues} 
                                nodeParamsValidation={walletValidation}
                                valueChanged={valueChanged}
                                onSubmit={onSubmit}
                                setVariableSelectorState={() => null}
                            />
                        </AccordionDetails>
                    </Accordion>
                    <Divider />
                </Box>

                {/* credentials */}
                <Box sx={{ p: 2 }}>
                    <Accordion expanded={expanded === 'credentials'} onChange={handleAccordionChange('credentials')}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="credentials-content"
                            id="credentials-header" 
                        >
                            <Typography variant="h4">
                                Credentials
                            </Typography>
                            {walletData && walletData.credentials && walletData.credentials.submit &&
                            (<Avatar
                                variant="rounded"
                                sx={{
                                    ...theme.typography.smallAvatar,
                                    borderRadius: '50%',
                                    background: theme.palette.success.dark,
                                    color: 'white',
                                    ml: 2
                                }}
                            >
                                <IconCheck />
                            </Avatar>)}
                        </AccordionSummary>
                        <AccordionDetails>
                            <CredentialInput 
                                paramsType="credentials"
                                initialParams={walletParams} 
                                initialValues={walletValues} 
                                initialValidation={walletValidation}
                                valueChanged={valueChanged}
                                paramsChanged={paramsChanged}
                                onSubmit={onSubmit}
                            />
                        </AccordionDetails>
                    </Accordion>
                    <Divider />
                </Box>

                {/* walletInfo */}
                <Box sx={{ p: 2 }}>
                    <Accordion expanded={expanded === 'walletInfo'} onChange={handleAccordionChange('walletInfo')}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="walletInfo-content"
                            id="walletInfo-header" 
                        >
                            <Typography variant="h4">
                                Wallet Details
                            </Typography>
                            {walletData && walletData.walletInfo && walletData.walletInfo.submit &&
                            (<Avatar
                                variant="rounded"
                                sx={{
                                    ...theme.typography.smallAvatar,
                                    borderRadius: '50%',
                                    background: theme.palette.success.dark,
                                    color: 'white',
                                    ml: 2
                                }}
                            >
                                <IconCheck />
                            </Avatar>)}
                        </AccordionSummary>
                        <AccordionDetails>
                            <InputParameters 
                                paramsType="walletInfo"
                                params={walletParams} 
                                initialValues={walletValues}
                                nodeParamsValidation={walletValidation}
                                valueChanged={valueChanged}
                                onSubmit={onSubmit}
                                setVariableSelectorState={() => null}
                            />
                        </AccordionDetails>
                    </Accordion>
                    <Divider />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>
                    {dialogProps.cancelButtonName}
                </Button>
                {dialogProps.type === 'EDIT' && <Button 
                    variant="contained"
                    color="error"
                    onClick={() => deleteWallet()}
                >
                    Delete
                </Button>}
                <Button 
                    variant="contained" 
                    disabled={!isReadyToAdd} 
                    onClick={() => (dialogProps.type === 'ADD' || dialogProps.type === 'IMPORT') ? addNewWallet(dialogProps.type) : saveWallet()}
                >
                    {dialogProps.confirmButtonName}
                </Button>
            </DialogActions>
        </Dialog>
    ) : null;

    return createPortal(component, portalElement);
}

WalletDialog.propTypes = {
    show: PropTypes.bool, 
    dialogProps: PropTypes.object,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func,
};

export default WalletDialog;

