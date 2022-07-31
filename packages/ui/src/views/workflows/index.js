import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { Grid, Button, Box, Stack } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import ItemCard from 'ui-component/cards/ItemCard';
import { gridSpacing } from 'store/constant';
import WorkflowEmptySVG from 'assets/images/workflow_empty.svg';

// API
import workflowsApi from "api/workflows";

// Hooks
import useApi from "hooks/useApi";

// ==============================|| WORKFLOWS ||============================== //

const Workflows = () => {
    const navigate = useNavigate();

    const [isLoading, setLoading] = useState(true);
 
    const getAllWorkflowsApi = useApi(workflowsApi.getAllWorkflows);

    const addNew = () => {
        navigate('/canvas');
    };

    const goToCanvas = (selectedWorkflow) => {
        navigate(`/canvas/${selectedWorkflow.shortId}`);
    };

    useEffect(() => {
        getAllWorkflowsApi.request();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setLoading(getAllWorkflowsApi.loading);
    }, [getAllWorkflowsApi.loading]);

    return (
        <MainCard>
            <Stack flexDirection="row">
                <h1>Workflows</h1>
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
                {!isLoading && getAllWorkflowsApi.data && getAllWorkflowsApi.data.map((data, index) => (
                    <Grid key={index} item lg={4} md={6} sm={6} xs={12}>
                        <ItemCard 
                            onClick={() => goToCanvas(data)} 
                            data={data}
                        />
                    </Grid>
                ))}
            </Grid>
            {!isLoading && (!getAllWorkflowsApi.data || getAllWorkflowsApi.data.length === 0) && (
                <Stack sx={{ alignItems: 'center', justifyContent: 'center' }} flexDirection="column">
                    <Box sx={{ p: 2, height: 'auto' }}>
                        <img style={{ objectFit: 'cover', height: '30vh', width: 'auto' }} src={WorkflowEmptySVG} alt="WorkflowEmptySVG" />
                    </Box>
                    <div>No Workflows Yet</div>
                </Stack>
            )}
        </MainCard>
    );
};

export default Workflows;
