import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { enqueueSnackbar as enqueueSnackbarAction, closeSnackbar as closeSnackbarAction } from 'store/actions'

// material-ui
import { Button, Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material'
import { useTheme } from '@mui/material/styles'

// project imports
import MainCard from 'ui-component/cards/MainCard'
import APIKeyDialog from './APIKeyDialog'
import { TooltipWithParser } from 'ui-component/TooltipWithParser'
import { StyledButton } from 'ui-component/StyledButton'

// API
import apiKeyApi from 'api/apikey'

// Hooks
import useApi from 'hooks/useApi'

// utils
import useNotifier from 'utils/useNotifier'

// Icons
import { IconTrash, IconEdit, IconCopy, IconX } from '@tabler/icons'
import APIEmptySVG from 'assets/images/api_empty.svg'

// ==============================|| APIKey ||============================== //

const APIKey = () => {
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)

    const dispatch = useDispatch()
    useNotifier()

    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args))
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args))

    const [showDialog, setShowDialog] = useState(false)
    const [dialogProps, setDialogProps] = useState({})
    const [apiKeys, setAPIKeys] = useState([])

    const getAllAPIKeysApi = useApi(apiKeyApi.getAllAPIKeys)

    const addNew = () => {
        const dialogProp = {
            title: 'Add New API Key',
            type: 'ADD',
            cancelButtonName: 'Cancel',
            confirmButtonName: 'Add'
        }
        setDialogProps(dialogProp)
        setShowDialog(true)
    }

    const edit = (key) => {
        const dialogProp = {
            title: 'Edit API Key',
            type: 'EDIT',
            cancelButtonName: 'Cancel',
            confirmButtonName: 'Save',
            key
        }
        setDialogProps(dialogProp)
        setShowDialog(true)
    }

    const deleteKey = async (key) => {
        try {
            const deleteResp = await apiKeyApi.deleteAPI(key.id)
            if (deleteResp.data) {
                enqueueSnackbar({
                    message: 'API key deleted',
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
                message: `Failed to delete API key: ${errorData}`,
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

    const onConfirm = () => {
        setShowDialog(false)
        getAllAPIKeysApi.request()
    }

    useEffect(() => {
        getAllAPIKeysApi.request()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (getAllAPIKeysApi.data) {
            setAPIKeys(getAllAPIKeysApi.data)
        }
    }, [getAllAPIKeysApi.data])

    return (
        <>
            <MainCard sx={{ background: customization.isDarkMode ? theme.palette.common.black : '' }}>
                <Stack flexDirection='row'>
                    <h1>API Keys&nbsp;</h1>
                    <TooltipWithParser title='Include API key as header when turning workflow into HTTP call' />
                    <Box sx={{ flexGrow: 1 }} />

                    <StyledButton variant='contained' sx={{ color: 'white', mr: 1, height: 37 }} onClick={addNew}>
                        Add New
                    </StyledButton>
                </Stack>
                {apiKeys.length <= 0 && (
                    <Stack sx={{ alignItems: 'center', justifyContent: 'center' }} flexDirection='column'>
                        <Box sx={{ p: 2, height: 'auto' }}>
                            <img style={{ objectFit: 'cover', height: '30vh', width: 'auto' }} src={APIEmptySVG} alt='APIEmptySVG' />
                        </Box>
                        <div>No API Keys Yet</div>
                    </Stack>
                )}
                {apiKeys.length > 0 && (
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Key Name</TableCell>
                                    <TableCell>API Key</TableCell>
                                    <TableCell>Created</TableCell>
                                    <TableCell> </TableCell>
                                    <TableCell> </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {apiKeys.map((key, index) => (
                                    <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component='th' scope='row'>
                                            {key.keyName}
                                        </TableCell>
                                        <TableCell>
                                            {key.apiKey}
                                            <IconButton
                                                title='Copy'
                                                color='success'
                                                onClick={() => navigator.clipboard.writeText(key.apiKey)}
                                            >
                                                <IconCopy />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell>{key.createdAt}</TableCell>
                                        <TableCell>
                                            <IconButton title='Edit' color='primary' onClick={() => edit(key)}>
                                                <IconEdit />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell>
                                            <IconButton title='Delete' color='error' onClick={() => deleteKey(key)}>
                                                <IconTrash />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </MainCard>
            <APIKeyDialog
                show={showDialog}
                dialogProps={dialogProps}
                onCancel={() => setShowDialog(false)}
                onConfirm={onConfirm}
            ></APIKeyDialog>
        </>
    )
}

export default APIKey
