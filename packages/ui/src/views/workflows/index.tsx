import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// material-ui
import { Grid, Button, Box, Stack } from '@mui/material'

// project imports
import { MainCard, ItemCard } from 'ui-component'
import WorkflowEmptySVG from 'assets/images/workflow_empty.svg'

// API
import { workflowsApi } from 'api'

// Hooks
import { useApi, WorkFlowData } from 'hooks'

// const
import { constant } from 'store'

const { gridSpacing, baseURL } = constant

// ==============================|| WORKFLOWS ||============================== //

export const Workflows = () => {
    const navigate = useNavigate()

    const [isLoading, setLoading] = useState(true)
    const [images, setImages] = useState<Record<string, string[]>>({})

    const getAllWorkflowsApi = useApi(workflowsApi.getAllWorkflows)

    const addNew = () => {
        navigate('/canvas')
    }

    const goToCanvas = (selectedWorkflow: WorkFlowData) => {
        navigate(`/canvas/${selectedWorkflow.shortId}`)
    }

    useEffect(() => {
        getAllWorkflowsApi.request()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setLoading(getAllWorkflowsApi.loading)
    }, [getAllWorkflowsApi.loading])

    useEffect(() => {
        if (getAllWorkflowsApi.data) {
            try {
                const workflows = getAllWorkflowsApi.data
                const images: Record<string, string[]> = {}

                for (let i = 0; i < workflows.length; i += 1) {
                    const flowDataStr = workflows[i]!.flowData
                    const flowData = JSON.parse(flowDataStr)
                    const nodes = flowData.nodes || []
                    images[workflows[i]!.shortId] = []

                    for (let j = 0; j < nodes.length; j += 1) {
                        const imageSrc = `${baseURL}/api/v1/node-icon/${nodes[j].data.name}`
                        if (!images[workflows[i]!.shortId]?.includes(imageSrc)) {
                            images[workflows[i]!.shortId]?.push(imageSrc)
                        }
                    }
                }
                setImages(images)
            } catch (e) {
                console.error(e)
            }
        }
    }, [getAllWorkflowsApi.data])

    return (
        <MainCard>
            <Stack flexDirection='row'>
                <h1>Workflows</h1>
                <Grid sx={{ mb: 1.25 }} container direction='row'>
                    <Box sx={{ flexGrow: 1 }} />
                    <Grid item>
                        <Button variant='contained' sx={{ color: 'white' }} onClick={addNew}>
                            Add New
                        </Button>
                    </Grid>
                </Grid>
            </Stack>
            <Grid container spacing={gridSpacing}>
                {!isLoading &&
                    getAllWorkflowsApi.data &&
                    getAllWorkflowsApi.data.map((data, index) => (
                        <Grid key={index} item lg={4} md={6} sm={6} xs={12}>
                            <ItemCard onClick={() => goToCanvas(data)} data={data} images={images[data.shortId]} />
                        </Grid>
                    ))}
            </Grid>
            {!isLoading && (!getAllWorkflowsApi.data || getAllWorkflowsApi.data.length === 0) && (
                <Stack sx={{ alignItems: 'center', justifyContent: 'center' }} flexDirection='column'>
                    <Box sx={{ p: 2, height: 'auto' }}>
                        <img style={{ objectFit: 'cover', height: '30vh', width: 'auto' }} src={WorkflowEmptySVG} alt='WorkflowEmptySVG' />
                    </Box>
                    <div>No Workflows Yet</div>
                </Stack>
            )}
        </MainCard>
    )
}
