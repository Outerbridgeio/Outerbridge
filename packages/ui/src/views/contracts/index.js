import { useEffect, useState } from 'react';

// material-ui
import { Grid, Button, Box, Stack } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import ContractCard from './ContractCard';
import ContractData from './data/placeholder_contract_data';

// const
import { gridSpacing } from 'store/constant';

// ==============================|| CONTRACTS ||============================== //

const Contracts = () => {
    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <MainCard>
            <Stack flexDirection="row">
                <h1>Contracts</h1>
                <Grid sx={{ mb: 1.25 }} container direction="row">
                    <Box sx={{ flexGrow: 1 }} />
                    <Grid item>
                        <Button variant="contained" sx={{ color: 'white' }}>
                            Add New
                        </Button>
                    </Grid>
                </Grid>
            </Stack>
            <Grid container spacing={gridSpacing}>
                {ContractData.map((data) => (
                    <Grid key={data.id} item lg={4} md={6} sm={6} xs={12}>
                        <ContractCard isLoading={isLoading} name={data.name} address={data.address} network={data.network} />
                    </Grid>
                ))}
            </Grid>
        </MainCard>
    );
};

export default Contracts;
