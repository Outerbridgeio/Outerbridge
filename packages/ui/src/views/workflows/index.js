import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
// material-ui
import { Grid, Button, Box, Stack, Tooltip } from '@mui/material'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import SwapVertIcon from '@mui/icons-material/SwapVert'
// project imports
import MainCard from 'ui-component/cards/MainCard'
import ItemCard from 'ui-component/cards/ItemCard'
import { gridSpacing } from 'store/constant'
import WorkflowEmptySVG from 'assets/images/workflow_empty.svg'
import { SET_LAYOUT } from 'store/actions'
// API
import workflowsApi from 'api/workflows'

// Hooks
import useApi from 'hooks/useApi'

// const
import { baseURL } from 'store/constant'

// ==============================|| WORKFLOWS ||============================== //

const Workflows = () => {
    const navigate = useNavigate()

    const [isLoading, setLoading] = useState(true)
    const [images, setImages] = useState({})

    const getAllWorkflowsApi = useApi(workflowsApi.getAllWorkflows)

    const addNew = () => {
        navigate('/canvas')
    }

    const goToCanvas = (selectedWorkflow) => {
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
                const images = {}

                for (let i = 0; i < workflows.length; i += 1) {
                    const flowDataStr = workflows[i].flowData
                    const flowData = JSON.parse(flowDataStr)
                    const nodes = flowData.nodes || []
                    images[workflows[i].shortId] = []

                    for (let j = 0; j < nodes.length; j += 1) {
                        const imageSrc = `${baseURL}/api/v1/node-icon/${nodes[j].data.name}`
                        if (!images[workflows[i].shortId].includes(imageSrc)) {
                            images[workflows[i].shortId].push(imageSrc)
                        }
                    }
                }
                setImages(images)
            } catch (e) {
                console.error(e)
            }
        }
    }, [getAllWorkflowsApi.data])

    // Horizontal - Vertical flow change
    const customization = useSelector((state) => state.customization)
    const [isHorizontal, setIsHorizontal] = useState(customization.isHorizontal)
    const dispatch = useDispatch()

    const handleSwapLayout = () => {
        dispatch({ type: SET_LAYOUT, isHorizontal: !isHorizontal })
        setIsHorizontal((isHorizontal) => !isHorizontal)
        localStorage.setItem('isHorizontal', !isHorizontal)
    }

    return (
        <MainCard>
            <Stack flexDirection='row'>
                <h1>Workflows</h1>
                <Tooltip title='Change workflow flow top to bottom or left to right'>
                    <Button variant='text' onClick={handleSwapLayout}>
                        {isHorizontal ? <SwapVertIcon stroke={1.5} size='1.3rem' /> : <SwapHorizIcon stroke={1.5} size='1.3rem' />}
                    </Button>
                </Tooltip>
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

export default Workflows
