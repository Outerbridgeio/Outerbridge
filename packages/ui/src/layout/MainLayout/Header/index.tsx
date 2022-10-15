import { useTheme } from 'themes'
// material-ui
import { Avatar, Box, ButtonBase } from '@mui/material'

// project imports
import { LogoSection } from '../LogoSection'

// assets
import { IconMenu2 } from '@tabler/icons'

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

export const Header = ({ handleLeftDrawerToggle }: { handleLeftDrawerToggle: (...arg: any[]) => void }) => {
    const theme = useTheme()

    return (
        <>
            {/* logo & toggler button */}
            <Box
                sx={{
                    width: 228,
                    display: 'flex',
                    [theme.breakpoints.down('md')]: {
                        width: 'auto'
                    }
                }}
            >
                <Box component='span' sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
                    <LogoSection />
                </Box>
                <ButtonBase sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                    <Avatar
                        variant='rounded'
                        sx={{
                            ...theme.typography.commonAvatar,
                            ...theme.typography.mediumAvatar,
                            transition: 'all .2s ease-in-out',
                            background: theme.palette.secondary.light,
                            color: theme.palette.secondary.dark,
                            '&:hover': {
                                background: theme.palette.secondary.dark,
                                color: theme.palette.secondary.light
                            }
                        }}
                        onClick={handleLeftDrawerToggle}
                        color='inherit'
                    >
                        <IconMenu2 stroke={1.5} size='1.3rem' />
                    </Avatar>
                </ButtonBase>
            </Box>
        </>
    )
}
