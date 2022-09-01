import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

import { 
    Dialog, 
    DialogContent, 
    DialogTitle,
    Box,
    Divider,
    InputAdornment,
    List,
    ListItemButton,
    ListItem,
    ListItemAvatar,
    ListItemText,
    OutlinedInput,
    Stack
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// icons
import { IconSearch } from '@tabler/icons';

// const
import { baseURL } from 'store/constant';

const TestWorkflowDialog = ({
    show,
    dialogProps,
    onCancel,
    onItemClick,
}) => {

    const portalElement = document.getElementById('portal');
    const theme = useTheme();
    const customization = useSelector((state) => state.customization);

    const [searchValue, setSearchValue] = useState('');
    const [nodes, setNodes] = useState([]);

    const filterSearch = (value) => {
        setSearchValue(value);
        setTimeout(() => {
            if (value) {
                const returnData = dialogProps.nodes.filter((nd) => nd.data.label.toLowerCase().includes(value.toLowerCase()));
                setNodes(returnData);

            } else if (value === '') {
                setNodes(dialogProps.nodes);
            }
        }, 500);
    }

    useEffect(() => {
        if (dialogProps.nodes) {
            setNodes(dialogProps.nodes);
        }
    }, [dialogProps]);

    const component = show ? (
        <Dialog
            open={show}
            fullWidth
            maxWidth="md"
            onClose={onCancel}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle sx={{ fontSize: '1rem' }} id="alert-dialog-title">
                {dialogProps.title}
            </DialogTitle>
            <DialogContent>
                <Stack>
                    <span>Select a starting point to test from. Workflow will be executed from the starting point till the end.</span>
                </Stack>
                <Box sx={{ p: 2 }}>
                    <OutlinedInput
                        sx={{ width: '100%', pr: 1, pl: 2, my: 2 }}
                        id="input-search-node"
                        value={searchValue}
                        onChange={(e) => filterSearch(e.target.value)}
                        placeholder="Search nodes"
                        startAdornment={
                            <InputAdornment position="start">
                                <IconSearch stroke={1.5} size="1rem" color={theme.palette.grey[500]} />
                            </InputAdornment>
                        }
                        aria-describedby="search-helper-text"
                        inputProps={{
                            'aria-label': 'weight'
                        }}
                    />
                    <Divider />
                </Box>
                <div>
                    <Box sx={{ p: 2 }}>
                        <List
                            sx={{
                                width: '100%',
                                py: 0,
                                borderRadius: '10px',
                                [theme.breakpoints.down('md')]: {
                                    maxWidth: 300
                                },
                                '& .MuiListItemSecondaryAction-root': {
                                    top: 22
                                },
                                '& .MuiDivider-root': {
                                    my: 0
                                },
                                '& .list-container': {
                                    pl: 7
                                }
                            }}
                        >
                            {nodes.map((node) => (
                                <div key={node.id}>
                                    <ListItemButton
                                        sx={{ p: 0, borderRadius: `${customization.borderRadius}px` }}
                                        onClick={() => onItemClick(node.id)}
                                    >
                                        <ListItem alignItems="center">
                                            <ListItemAvatar>
                                                <div style={{ width: 50, height: 50, borderRadius: '50%', backgroundColor: 'white' }}>
                                                    <img style={{ width: '100%', height: '100%', padding: 10, objectFit: 'contain' }} alt={node.data.name} src={`${baseURL}/api/v1/node-icon/${node.data.name}`} />
                                                </div>
                                            </ListItemAvatar>
                                            <ListItemText sx={{ ml: 1 }} primary={node.data.label} secondary={node.data.description} />
                                        </ListItem>
                                    </ListItemButton>
                                    <Divider />
                                </div>
                            ))}
                        </List>
                    </Box>
                </div>
            </DialogContent>
        </Dialog>
    ) : null;

    return createPortal(component, portalElement);
}

TestWorkflowDialog.propTypes = {
    show: PropTypes.bool, 
    dialogProps: PropTypes.object,
    onCancel: PropTypes.func,
    onItemClick: PropTypes.func,
};

export default TestWorkflowDialog;

