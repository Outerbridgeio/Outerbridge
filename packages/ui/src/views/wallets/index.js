import { useEffect, useState } from 'react';

// material-ui
import { Grid, Button, Box, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import ItemCard from 'ui-component/cards/ItemCard';
import WalletDialog from './WalletDialog';
import WalletEmptySVG from 'assets/images/wallet_empty.svg';

// const
import { gridSpacing } from 'store/constant';

// API
import walletsApi from 'api/wallets';

// Hooks
import useApi from 'hooks/useApi';

// ==============================|| WALLETS ||============================== //

const Wallets = () => {
    const theme = useTheme();

    const [isLoading, setLoading] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [dialogProps, setDialogProps] = useState({});

    const getAllWalletsApi = useApi(walletsApi.getAllWallets);

    const addNew = () => {
        const dialogProp = {
            title: 'Add New Wallet',
            type: 'ADD',
            cancelButtonName: 'Cancel',
            confirmButtonName: 'Add'
        };
        setDialogProps(dialogProp);
        setShowDialog(true);
    };

    const importNew = () => {
        const dialogProp = {
            title: 'Import Wallet',
            type: 'IMPORT',
            cancelButtonName: 'Cancel',
            confirmButtonName: 'IMPORT'
        };
        setDialogProps(dialogProp);
        setShowDialog(true);
    };

    const edit = (id) => {
        const dialogProp = {
            title: 'Edit Wallet',
            type: 'EDIT',
            cancelButtonName: 'Cancel',
            confirmButtonName: 'Save',
            id
        };
        setDialogProps(dialogProp);
        setShowDialog(true);
    };

    const onConfirm = () => {
        setShowDialog(false);
        getAllWalletsApi.request();
    };

    useEffect(() => {
        getAllWalletsApi.request();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setLoading(getAllWalletsApi.loading);
    }, [getAllWalletsApi.loading]);

    return (
        <>
            <MainCard>
                <Stack flexDirection="row">
                    <h1>Wallets</h1>
                    <Grid sx={{ mb: 1.25 }} container direction="row">
                        <Box sx={{ flexGrow: 1 }} />
                        <Grid item>
                            <Button variant="contained" sx={{ color: 'white', mr: 2 }} onClick={addNew}>
                                Add New
                            </Button>
                            <Button
                                variant="contained"
                                sx={{ color: 'white', backgroundColor: theme.palette.secondary.main }}
                                onClick={importNew}
                            >
                                Import Wallet
                            </Button>
                        </Grid>
                    </Grid>
                </Stack>
                <Grid container spacing={gridSpacing}>
                    {!isLoading &&
                        getAllWalletsApi.data &&
                        getAllWalletsApi.data.map((data, index) => (
                            <Grid key={index} item lg={4} md={6} sm={6} xs={12}>
                                <ItemCard isLoading={isLoading} onClick={() => edit(data._id)} data={data} />
                            </Grid>
                        ))}
                </Grid>
                {!isLoading && (!getAllWalletsApi.data || getAllWalletsApi.data.length === 0) && (
                    <Stack sx={{ alignItems: 'center', justifyContent: 'center' }} flexDirection="column">
                        <Box sx={{ p: 2, height: 'auto' }}>
                            <img style={{ objectFit: 'cover', height: '30vh', width: 'auto' }} src={WalletEmptySVG} alt="WalletEmptySVG" />
                        </Box>
                        <div>No Wallets Yet</div>
                    </Stack>
                )}
            </MainCard>
            <WalletDialog
                show={showDialog}
                dialogProps={dialogProps}
                onCancel={() => setShowDialog(false)}
                onConfirm={onConfirm}
            ></WalletDialog>
        </>
    );
};

export default Wallets;
