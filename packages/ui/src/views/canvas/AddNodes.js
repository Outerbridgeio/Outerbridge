import { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'

// material-ui
import { useTheme } from '@mui/material/styles'
import {
    Box,
    Fab,
    ClickAwayListener,
    Divider,
    InputAdornment,
    List,
    ListItemButton,
    ListItem,
    ListItemAvatar,
    ListItemText,
    OutlinedInput,
    Paper,
    Popper,
    Stack,
    Typography
} from '@mui/material'

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar'

// project imports
import MainCard from 'ui-component/cards/MainCard'
import Transitions from 'ui-component/extended/Transitions'

// icons
import { IconPlus, IconSearch, IconMinus } from '@tabler/icons'

// const
import { baseURL } from 'store/constant'

// ==============================|| ADD NODES||============================== //

const AddNodes = ({ nodesData, node }) => {
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)

    const [searchValue, setSearchValue] = useState('')
    const [nodes, setNodes] = useState([])
    const [open, setOpen] = useState(false)

    const anchorRef = useRef(null)
    const prevOpen = useRef(open)

    const filterSearch = (value) => {
        setSearchValue(value)
        setTimeout(() => {
            if (value) {
                const returnData = nodesData.filter((nd) => nd.name.toLowerCase().includes(value.toLowerCase()))
                setNodes(returnData)
            } else if (value === '') {
                setNodes(nodesData)
            }
        }, 500)
    }

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return
        }
        setOpen(false)
    }

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen)
    }

    const onDragStart = (event, node) => {
        event.dataTransfer.setData('application/reactflow', JSON.stringify(node))
        event.dataTransfer.effectAllowed = 'move'
    }

    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus()
        }

        prevOpen.current = open
    }, [open])

    useEffect(() => {
        if (node) setOpen(false)
    }, [node])

    useEffect(() => {
        if (nodesData) setNodes(nodesData)
    }, [nodesData])

    return (
        <>
            <Fab
                sx={{ left: 20, top: 20 }}
                ref={anchorRef}
                size='small'
                color='primary'
                aria-label='add'
                title='Add Node'
                onClick={handleToggle}
            >
                {open ? <IconMinus /> : <IconPlus />}
            </Fab>
            <Popper
                placement='bottom-end'
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [-40, 14]
                            }
                        }
                    ]
                }}
                sx={{ zIndex: 1000 }}
            >
                {({ TransitionProps }) => (
                    <Transitions in={open} {...TransitionProps}>
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                    <Box sx={{ p: 2 }}>
                                        <Stack>
                                            <Typography variant='h4'>Add Nodes</Typography>
                                        </Stack>
                                        <OutlinedInput
                                            sx={{ width: '100%', pr: 1, pl: 2, my: 2 }}
                                            id='input-search-node'
                                            value={searchValue}
                                            onChange={(e) => filterSearch(e.target.value)}
                                            placeholder='Search nodes'
                                            startAdornment={
                                                <InputAdornment position='start'>
                                                    <IconSearch stroke={1.5} size='1rem' color={theme.palette.grey[500]} />
                                                </InputAdornment>
                                            }
                                            aria-describedby='search-helper-text'
                                            inputProps={{
                                                'aria-label': 'weight'
                                            }}
                                        />
                                        <Divider />
                                    </Box>
                                    <PerfectScrollbar style={{ height: '100%', maxHeight: 'calc(100vh - 250px)', overflowX: 'hidden' }}>
                                        <Box sx={{ p: 2 }}>
                                            <List
                                                sx={{
                                                    width: '100%',
                                                    maxWidth: 330,
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
                                                    <div key={node.name} onDragStart={(event) => onDragStart(event, node)} draggable>
                                                        <ListItemButton
                                                            sx={{ p: 0, borderRadius: `${customization.borderRadius}px`, cursor: 'move' }}
                                                        >
                                                            <ListItem alignItems='center'>
                                                                <ListItemAvatar>
                                                                    <div
                                                                        style={{
                                                                            width: 50,
                                                                            height: 50,
                                                                            borderRadius: '50%',
                                                                            backgroundColor: 'white'
                                                                        }}
                                                                    >
                                                                        <img
                                                                            style={{
                                                                                width: '100%',
                                                                                height: '100%',
                                                                                padding: 10,
                                                                                objectFit: 'contain'
                                                                            }}
                                                                            alt={node.name}
                                                                            src={`${baseURL}/api/v1/node-icon/${node.name}`}
                                                                        />
                                                                    </div>
                                                                </ListItemAvatar>
                                                                <ListItemText
                                                                    sx={{ ml: 1 }}
                                                                    primary={node.label}
                                                                    secondary={node.description}
                                                                />
                                                            </ListItem>
                                                        </ListItemButton>
                                                        <Divider />
                                                    </div>
                                                ))}
                                            </List>
                                        </Box>
                                    </PerfectScrollbar>
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
        </>
    )
}

AddNodes.propTypes = {
    nodesData: PropTypes.array,
    node: PropTypes.object
}

export default AddNodes
