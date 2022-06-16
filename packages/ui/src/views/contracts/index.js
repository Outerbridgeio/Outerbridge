import { useEffect, useState } from 'react';

// material-ui
import { Grid, Button, Box, Stack } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import ContractCard from './ContractCard';
import ContractDialog from './ContractDialog';
import ContractEmptySVG from 'assets/images/contract_empty.svg';

// const
import { gridSpacing } from 'store/constant';

// API
import contractsApi from "api/contracts";

// Hooks
import useApi from "hooks/useApi";

// ==============================|| CONTRACTS ||============================== //

const Contracts = () => {

    const [isLoading, setLoading] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [dialogProps, setDialogProps] = useState({});

    const getAllContractsApi = useApi(contractsApi.getAllContracts);

    const addNew = () => {
        const dialogProp = {
            title: 'Add New Contract',
            type: 'ADD',
            cancelButtonName: 'Cancel',
            confirmButtonName: 'Add'
        };
        setDialogProps(dialogProp);
        setShowDialog(true);
    };

    const edit = (id) => {
        const dialogProp = {
            title: 'Edit Contract',
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
        getAllContractsApi.request();
    }

    useEffect(() => {
        getAllContractsApi.request();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setLoading(getAllContractsApi.loading);
    }, [getAllContractsApi.loading]);


    return (
        <>
        <MainCard>
            <Stack flexDirection="row">
                <h1>Contracts</h1>
                <Grid sx={{ mb: 1.25 }} container direction="row">
                    <Box sx={{ flexGrow: 1 }} />
                    <Grid item>
                        <Button variant="contained" sx={{ color: 'white' }} onClick={addNew}>
                            Add New
                        </Button>
                    </Grid>
                </Grid>
            </Stack>
            <Grid container spacing={gridSpacing}>
                {!isLoading && getAllContractsApi.data && getAllContractsApi.data.map((data, index) => (
                    <Grid key={index} item lg={4} md={6} sm={6} xs={12}>
                        <ContractCard 
                            isLoading={isLoading}
                            onClick={() => edit(data._id)} 
                            name={data.name} 
                            address={data.address} 
                            network={data.network}
                        />
                    </Grid>
                ))}
            </Grid>
            {!isLoading && (!getAllContractsApi.data || getAllContractsApi.data.length === 0) && (
                <Stack sx={{ alignItems: 'center', justifyContent: 'center' }} flexDirection="column">
                    <Box sx={{ p: 2, height: 'auto' }}>
                        <img style={{ objectFit: 'cover', height: '30vh', width: 'auto' }} src={ContractEmptySVG} alt="WorkflowEmptySVG" />
                    </Box>
                    <div>No Contracts Yet</div>
                </Stack>
            )}
        </MainCard>
        <ContractDialog
            show={showDialog}
            dialogProps={dialogProps}
            onCancel={() => setShowDialog(false)}
            onConfirm={onConfirm}
        >
        </ContractDialog>
        </>
    );
};

export default Contracts;
