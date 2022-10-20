import { useState, useEffect, ComponentProps } from 'react'
import { useTheme } from 'themes'
import { reducer } from 'store'

// material-ui
import { Box, List, Paper, Popper } from '@mui/material'

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar'

// project imports
import { MainCard, Transitions } from 'ui-component'

import { NavItem } from 'layout/MainLayout/Sidebar/MenuList/NavItem'

import { settings, Settings as SettingsType } from 'menu-items'

// ==============================|| SETTINGS ||============================== //

export const Settings = ({
    workflow,
    isSettingsOpen,
    anchorEl,
    onSettingsItemClick,
    onUploadFile
}: {
    workflow?: reducer.canvas.WorkFlow
    isSettingsOpen: boolean
    anchorEl: ComponentProps<typeof Popper>['anchorEl']
    onSettingsItemClick: ComponentProps<typeof NavItem>['onClick']
    onUploadFile: ComponentProps<typeof NavItem>['onUploadFile']
}) => {
    const theme = useTheme()
    const [settingsMenu, setSettingsMenu] = useState<SettingsType['children']>([])

    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (workflow && !workflow.shortId) {
            const settingsMenu = settings.children.filter((menu) => menu.id === 'loadWorkflow')
            setSettingsMenu(settingsMenu)
        } else if (workflow && workflow.shortId) {
            const settingsMenu = settings.children
            setSettingsMenu(settingsMenu)
        }
    }, [workflow])

    useEffect(() => {
        setOpen(isSettingsOpen)
    }, [isSettingsOpen])

    // settings list items
    const items = settingsMenu.map((menu) => {
        return <NavItem key={menu.id} item={menu} level={1} navType='SETTINGS' onClick={onSettingsItemClick} onUploadFile={onUploadFile} />
    })

    return (
        <>
            <Popper
                placement='bottom-end'
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
    )
}
