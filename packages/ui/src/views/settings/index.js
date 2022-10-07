import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, List, Paper, Popper } from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import NavItem from 'layout/MainLayout/Sidebar/MenuList/NavItem';

import settings from 'menu-items/settings';

// ==============================|| SETTINGS ||============================== //

const Settings = ({ workflow, isSettingsOpen, anchorEl, onSettingsItemClick, onUploadFile }) => {
    const theme = useTheme();
    const [settingsMenu, setSettingsMenu] = useState([]);

    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (workflow && !workflow.shortId) {
            const settingsMenu = settings.children.filter((menu) => menu.id === 'loadWorkflow');
            setSettingsMenu(settingsMenu);
        } else if (workflow && workflow.shortId) {
            const settingsMenu = settings.children;
            setSettingsMenu(settingsMenu);
        }
    }, [workflow]);

    useEffect(() => {
        setOpen(isSettingsOpen);
    }, [isSettingsOpen]);

    // settings list items
    const items = settingsMenu.map((menu) => {
        return (
            <NavItem
                key={menu.id}
                item={menu}
                level={1}
                navType="SETTINGS"
                onClick={(id) => onSettingsItemClick(id)}
                onUploadFile={onUploadFile}
            />
        );
    });

    return (
        <>
            <Popper
                placement="bottom-end"
                open={open}
                anchorEl={anchorEl}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [170, 20]
                            }
                        }
                    ]
                }}
                sx={{ zIndex: 1000 }}
            >
                {({ TransitionProps }) => (
                    <Transitions in={open} {...TransitionProps}>
                        <Paper>
                            <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                <PerfectScrollbar style={{ height: '100%', maxHeight: 'calc(100vh - 250px)', overflowX: 'hidden' }}>
                                    <Box sx={{ p: 2 }}>
                                        <List>{items}</List>
                                    </Box>
                                </PerfectScrollbar>
                            </MainCard>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
        </>
    );
};

Settings.propTypes = {
    workflow: PropTypes.object,
    isSettingsOpen: PropTypes.bool,
    anchorEl: PropTypes.any,
    onSettingsItemClick: PropTypes.func,
    onUploadFile: PropTypes.func
};

export default Settings;
