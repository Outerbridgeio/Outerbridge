import PropTypes from 'prop-types';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Grid, Chip, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonWorkflowCard from 'ui-component/cards/Skeleton/WorkflowCard';

// Const
import { networks } from "store/constant";

import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';

const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: '#ffffff',
    color: theme.darkTextPrimary,
    overflow: 'hidden',
    position: 'relative',
    boxShadow: '0 2px 14px 0 rgb(32 40 45 / 8%)',
    cursor: 'pointer',
    '&:hover': {
        boxShadow: '0 2px 14px 0 rgb(32 40 45 / 20%)'
    }
}));

// ===========================|| CONTRACT CARD ||=========================== //

const ItemCard = ({ isLoading, data, images, onClick }) => {
    const theme = useTheme();

    const chipSX = {
        height: 24,
        padding: '0 6px'
    };

    const activeWorkflowSX = {
        ...chipSX,
        color: theme.palette.success.dark,
        backgroundColor: theme.palette.success.light
    };

    const getNetworkItem = (network) => {
        return networks.find((ntw) => ntw.name === network);
    }

    return (
        <>
            {isLoading ? (
                <SkeletonWorkflowCard />
            ) : (
                <CardWrapper border={false} content={false} onClick={onClick}>
                    <Box sx={{ p: 2.25 }}>
                        <Grid container direction="column">
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                {data.address && <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: 'white', marginRight: 10 }}>
                                    <Jazzicon diameter={40} seed={jsNumberForAddress(data.address)} />
                                </div>}
                                <Typography sx={{ fontSize: '1.5rem', fontWeight: 500 }}>{data.name}</Typography>
                            </div>
                            <Grid sx={{ mt: 1, mb: 1 }} container direction="row">
                                <Grid item sx={{ flexGrow: 1 }}>
                                    {data.address && (
                                    <Typography
                                        sx={{
                                            fontSize: '1rem',
                                            fontWeight: 500,
                                            color: theme.palette.secondary[200],
                                            overflow: 'hidden',
                                            whiteSpace: 'nowrap',
                                            textOverflow: 'ellipsis',
                                            maxWidth: 250
                                        }}
                                    >
                                        {`${data.address.substring(0,8)}...${data.address.slice(-4)}`}
                                    </Typography>)}
                                    {data.flowData && (
                                    <Typography
                                        sx={{
                                            fontSize: '1rem',
                                            fontWeight: 500,
                                            color: theme.palette.secondary[200]
                                        }}
                                    >
                                        Total Executions: {data.executionCount || '0'}
                                    </Typography>)}
                                </Grid>
                                {data.deployed && (
                                    <Grid item>
                                        <Chip label="Deployed" sx={activeWorkflowSX} />
                                    </Grid>
                                )}
                            </Grid>
                            {data.network && (
                                <Grid item>
                                    <Chip label={getNetworkItem(data.network).label} sx={{...chipSX, backgroundColor: getNetworkItem(data.network).color, color: 'white' }} />
                                </Grid>
                            )}
                            {images && <div style={{ display: 'flex', flexDirection: 'row', marginTop: 10 }}>
                                {images.map((img) => (
                                    <div key={img} style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: 'white' }}>
                                        <img style={{ width: '100%', height: '100%', padding: 5, objectFit: 'contain' }} alt='' src={img} />
                                    </div>
                                ))}
                            </div>}
                            
                        </Grid>
                    </Box>
                </CardWrapper>
            )}
        </>
    );
};

ItemCard.propTypes = {
    isLoading: PropTypes.bool,
    data: PropTypes.object,
    images: PropTypes.array,
    onClick: PropTypes.func
};

export default ItemCard;
