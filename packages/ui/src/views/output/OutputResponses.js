import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

// material-ui
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Stack,
    Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// third party
import ReactJson from 'react-json-view'
import socketIOClient from "socket.io-client";

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import AttachmentDialog from 'ui-component/dialog/AttachmentDialog';
import HTMLDialog from 'ui-component/dialog/HTMLDialog';

// API
import nodesApi from "api/nodes";
import workflowsApi from "api/workflows";

// Hooks
import useApi from "hooks/useApi";

// icons
import { IconExclamationMark, IconCopy, IconArrowUpRightCircle, IconX } from '@tabler/icons';

// const
import { baseURL } from 'store/constant';
import { SET_WORKFLOW, REMOVE_DIRTY } from 'store/actions';

// ==============================|| OUTPUT RESPONSES ||============================== //

const OutputResponses = ({ nodeId, nodeParamsType, nodeFlowData, nodes, workflow, rfInstance, onSubmit }) => {

    const theme = useTheme();
    const dispatch = useDispatch();

    const [outputResponse, setOutputResponse] = useState([]);
    const [errorResponse, setErrorResponse] = useState(null);
    const [nodeName, setNodeName] = useState(null);
    const [nodeType, setNodeType] = useState(null);
    const [isTestNodeBtnDisabled, disableTestNodeBtn] = useState(true);
    const [testNodeLoading, setTestNodeLoading] = useState(null);
    const [showHTMLDialog, setShowHTMLDialog] = useState(false);
    const [HTMLDialogProps, setHTMLDialogProps] = useState({});
    const [showAttachmentDialog, setShowAttachmentDialog] = useState(false);
    const [attachmentDialogProps, setAttachmentDialogProps] = useState({});

    const testNodeApi = useApi(nodesApi.testNode);

    const onTestWebhookClick = () => {
        setTestNodeLoading(true);
        try {
            const socket = socketIOClient(baseURL);
            socket.on('connect', async() => {
            
                const rfInstanceObject = rfInstance.toObject();
                const flowData = JSON.stringify(rfInstanceObject);
                
                let savedWorkflowResponse;
                // For webhook, workflow must be saved/created first
                if (!workflow.shortId) {
                    const newWorkflowBody = {
                        name: workflow.name,
                        deployed: false,
                        flowData
                    };
                    const response = await workflowsApi.createNewWorkflow(newWorkflowBody)
                    savedWorkflowResponse = response.data;
                    dispatch({ type: SET_WORKFLOW, workflow: savedWorkflowResponse });

                } else {

                    // If workflow is already deployed, stop it first
                    if (workflow.deployed) {
                        setTestNodeLoading(false);
                        alert('Testing webhook requires stopping workflow. Please stop workflow first');
                        return;
                    }

                    const updateBody = {
                        flowData
                    };
                    const response = await workflowsApi.updateWorkflow(workflow.shortId, updateBody)
                    savedWorkflowResponse = response.data;
                    dispatch({ type: SET_WORKFLOW, workflow: savedWorkflowResponse });
                }

                dispatch({ type: REMOVE_DIRTY });

                // Test webhook
                const testNodeBody = {
                    ...nodeFlowData,
                    nodeId,
                    workflowShortId: savedWorkflowResponse.shortId
                };
                testNodeApi.request(nodeFlowData.name, { nodeData: testNodeBody, nodes, clientId: socket.id });
            });
        
            socket.on('testNodeResponse', (data) => {
                setOutputResponse(data);
                setTestNodeLoading(false);
                const formValues = {
                    submit: true,
                    needRetest: null,
                    output: data,
                };
                onSubmit(formValues, 'outputResponses');
                socket.disconnect();
            });

        } catch(error) {
            setTestNodeLoading(false);
            setOutputResponse([]);
            setErrorResponse(error);
            console.error(error);
        }
    }

    const onTestNodeClick = () => {
        const testNodeBody = {
            ...nodeFlowData,
            nodeId
        };
        testNodeApi.request(nodeFlowData.name, { nodeData: testNodeBody, nodes });
    };

    const checkIfTestNodeValid = () => {
        const paramsTypes = nodeParamsType.filter((type) => type !== 'outputResponses');
        for (let i = 0; i < paramsTypes.length; i+= 1) {
            const paramType = paramsTypes[i];

            if (!nodeFlowData[paramType] || !nodeFlowData[paramType].submit) {
                return true;
            }
        }
        return false;
    };

    const openAttachmentDialog = (outputResponse) => {
        const dialogProp = {
            title: 'Attachments',
            executionData: outputResponse
        };
        setAttachmentDialogProps(dialogProp);
        setShowAttachmentDialog(true);
    };

    const openHTMLDialog = (executionData) => {
        const dialogProp = {
            title: 'HTML',
            executionData
        };
        setHTMLDialogProps(dialogProp);
        setShowHTMLDialog(true);
    };

    useEffect(() => {
        if (nodeFlowData && nodeFlowData.outputResponses && nodeFlowData.outputResponses.output) {
            setOutputResponse(nodeFlowData.outputResponses.output);
        } else {
            setOutputResponse([]);
        }

        disableTestNodeBtn(checkIfTestNodeValid());

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nodeFlowData, nodeParamsType]);


    useEffect(() => {
        if (nodes && nodeId) {
            const selectedNode = nodes.find((nd) => nd.id === nodeId);
            if (selectedNode) {
                setNodeName(selectedNode.data.name);
                setNodeType(selectedNode.data.type);
            }
        }

    }, [nodes, nodeId]);


    // Test node successful
    useEffect(() => {
        if (testNodeApi.data && nodeType && nodeType !== 'webhook') {
            const testNodeData = testNodeApi.data;
            setOutputResponse(testNodeData);
            setErrorResponse(null);
            const formValues = {
                submit: true,
                needRetest: null,
                output: testNodeData,
            };
            onSubmit(formValues, 'outputResponses')
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [testNodeApi.data]);


    // Test node error
    useEffect(() => {
        if (testNodeApi.error && nodeType && nodeType !== 'webhook') {

            let errorMessage = 'Unexpected Error.';

            if (testNodeApi.error.response && testNodeApi.error.response.data) {
                errorMessage = testNodeApi.error.response.data;

            } else if (testNodeApi.error.message) {
                errorMessage = testNodeApi.error.message;
            }
            
            setErrorResponse(errorMessage);
            setOutputResponse([]);
            const formValues = {
                submit: null,
                needRetest: null,
                output: [],
            };
            onSubmit(formValues, 'outputResponses')
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [testNodeApi.error]);


    // Test node loading
    useEffect(() => {
        if (nodeType && nodeType !== 'webhook') setTestNodeLoading(testNodeApi.loading);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [testNodeApi.loading]);

    return (
        <>
        <Box sx={{ width: 400 }}>
            {nodeFlowData && nodeFlowData.outputResponses && nodeFlowData.outputResponses.needRetest && (
                <Chip sx={{mb: 2}} icon={<IconExclamationMark />} label="Retest the node for updated parameters" color="warning" />
            )}
            {nodeName && nodeName === 'webhook' && (
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h5" sx={{ mb: 1 }}>{`${baseURL}/api/v1/webhook/${nodeFlowData.webhookEndpoint}`}</Typography>
                    <Stack direction="row" spacing={2}>
                        <Button size="small" variant="outlined" startIcon={<IconCopy />} onClick={() => navigator.clipboard.writeText(`${baseURL}/api/v1/webhook/${nodeFlowData.webhookEndpoint}`)}>
                            Copy URL
                        </Button>
                        <Button size="small" variant="outlined" startIcon={<IconArrowUpRightCircle />} onClick={() => window.open(`${baseURL}/api/v1/webhook/${nodeFlowData.webhookEndpoint}`, "_blank")}>
                            Open in New Tab
                        </Button>
                    </Stack>
                </Box>
            )}
            {errorResponse && (<Box sx={{mb: 2}}>
                <Chip sx={{mb: 2}} icon={<IconX />} label="Error" color="error" />
                <div style={{color: 'red'}}>{errorResponse}</div>
            </Box>)}
            <Box>
                <ReactJson collapsed src={outputResponse} />
                <div>
                    {outputResponse.map((respObj, respObjIndex) =>
                        <div key={respObjIndex}>

                            {respObj.html && (
                            <Typography sx={{p: 1, mt: 2}} variant="h5">
                                HTML
                            </Typography>)}
                            {respObj.html && <div style={{ width: '100%', height: '100%', maxHeight: 400, overflow: 'auto', backgroundColor: 'white', borderRadius: 5 }} dangerouslySetInnerHTML={{ __html: respObj.html }} />}
                            {respObj.html && <Button sx={{ mt: 1}} size="small" variant="contained" onClick={() => openHTMLDialog(outputResponse)}>View HTML</Button>}

                            {respObj.attachments && (
                            <Typography sx={{p: 1, mt: 2, pb: 0}} variant="h5">
                                Attachments
                            </Typography>)}
                            {respObj.attachments && respObj.attachments.map((attachment, attchIndex) =>
                                <div key={attchIndex}>
                                    <Typography sx={{p: 1}} variant="h6">
                                        Item {respObjIndex} | {attachment.filename ? attachment.filename : `Attachment ${attchIndex}`}
                                    </Typography>
                                    <embed
                                        src={attachment.content}
                                        width="100%"
                                        height="100%"
                                        style={{ borderStyle: "solid" }}
                                        type={attachment.contentType}
                                    />
                                    <Button size="small" variant="contained" onClick={() => openAttachmentDialog(outputResponse)}>View Attachment</Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Box>
            <Box sx={{ mt: 2, position: 'relative' }}>
                <AnimateButton>
                    <Button
                        disableElevation
                        disabled={isTestNodeBtnDisabled || testNodeLoading}
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        color="secondary"
                        onClick={() => nodeType === 'webhook' ? onTestWebhookClick() : onTestNodeClick()}
                    >
                        {nodeType === 'webhook' ? 'Save & Test Webhook' : 'Test Node'}
                    </Button>
                </AnimateButton >
                {testNodeLoading && (<CircularProgress
                    size={24} 
                    sx={{
                        color: theme.palette.secondary.main,
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        marginTop: '-12px',
                        marginLeft: '-12px',
                    }}
                />)}
            </Box>
        </Box>
        <AttachmentDialog
            show={showAttachmentDialog}
            dialogProps={attachmentDialogProps}
            onCancel={() => setShowAttachmentDialog(false)}
        ></AttachmentDialog>
        <HTMLDialog
            show={showHTMLDialog}
            dialogProps={HTMLDialogProps}
            onCancel={() => setShowHTMLDialog(false)}
        ></HTMLDialog>
        </>
    );
};

OutputResponses.propTypes = {
    nodeId: PropTypes.string, 
    nodeParamsType: PropTypes.array,
    nodeFlowData: PropTypes.object,
    nodes: PropTypes.array, 
    workflow: PropTypes.object,
    rfInstance: PropTypes.any,
    onSubmit: PropTypes.func,
};

export default OutputResponses;
