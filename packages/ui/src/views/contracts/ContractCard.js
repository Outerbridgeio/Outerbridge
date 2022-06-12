import PropTypes from 'prop-types';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Grid, Chip, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonWorkflowCard from 'ui-component/cards/Skeleton/WorkflowCard';

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

const BridgeCard = ({ isLoading, name, address, network }) => {
    const theme = useTheme();

    const chipSX = {
        height: 24,
        padding: '0 6px'
    };

    const networkSX = {
        ...chipSX,
        color: theme.palette.success.dark,
        backgroundColor: theme.palette.success.light
    };

    return (
        <>
            {isLoading ? (
                <SkeletonWorkflowCard />
            ) : (
                <CardWrapper border={false} content={false}>
                    <Box sx={{ p: 2.25 }}>
                        <Grid container direction="column">
                            <Grid item>
                                <Typography sx={{ fontSize: '1.5rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>{name}</Typography>
                            </Grid>
                            <Grid container direction="row">
                                <Grid item sx={{ flexGrow: 1 }}>
                                    <Typography
                                        sx={{
                                            fontSize: '1rem',
                                            fontWeight: 500,
                                            color: theme.palette.secondary[200],
                                            overflow: 'hidden',
                                            whiteSpace: 'nowrap',
                                            textOverflow: 'ellipsis',
                                            maxWidth: '150px'
                                        }}
                                    >
                                        {address}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Chip label={network} sx={networkSX} />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </CardWrapper>
            )}
        </>
    );
};

BridgeCard.propTypes = {
    isLoading: PropTypes.bool,
    name: PropTypes.string,
    address: PropTypes.string,
    network: PropTypes.string
};

export default BridgeCard;
