import { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'

// material-ui
import { useTheme } from '@mui/material/styles'
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
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
    Typography,
    Tabs,
    Tab
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

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
function TabPanel(props) {
    const { children, value, index, ...other } = props
    return (
        <div
            role='tabpanel'
            hidden={value !== index}
            id={`attachment-tabpanel-${index}`}
            aria-labelledby={`attachment-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
        </div>
    )
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired
}

function a11yProps(index) {
    return {
        id: `nodes-tab-${index}`,
        'aria-controls': `nodes-tabpanel-${index}`
    }
}

const AddNodes = ({ nodesData, node }) => {
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)

    const [searchValue, setSearchValue] = useState('')
    const [nodes, setNodes] = useState({})
    const [open, setOpen] = useState(false)
    const [tabValue, setTabValue] = useState(0)
    const [categoryExpanded, setCategoryExpanded] = useState({})

    const anchorRef = useRef(null)
    const prevOpen = useRef(open)
    const ps = useRef()

    const scrollTop = () => {
        const curr = ps.current
        if (curr) {
            curr.scrollTop = 0
        }
    }

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
        let returnData = []
        switch (newValue) {
            case 0:
                returnData = nodesData
                break
            case 1:
                returnData = nodesData.filter((nd) => nd.type.toLowerCase() === 'trigger')
                break
            case 2:
                returnData = nodesData.filter((nd) => nd.type.toLowerCase() === 'webhook')
                break
            case 3:
                returnData = nodesData.filter((nd) => nd.type.toLowerCase() === 'action')
                break
        }
        groupByCategory(returnData)
        scrollTop()
    }

    const filterSearch = (value) => {
        setSearchValue(value)
        setTimeout(() => {
            if (value) {
                const returnData = nodesData.filter((nd) => nd.name.toLowerCase().includes(value.toLowerCase()))
                groupByCategory(returnData, true)
                setTabValue(0)
                scrollTop()
            } else if (value === '') {
                groupByCategory(nodesData)
                scrollTop()
            }
        }, 500)
    }

    const groupByCategory = (nodes, isFilter) => {
        const accordianCategories = {}
        const result = nodes.reduce(function (r, a) {
            r[a.category] = r[a.category] || []
            r[a.category].push(a)
            accordianCategories[a.category] = isFilter ? true : false
            return r
        }, Object.create(null))
        setNodes(result)
        setCategoryExpanded(accordianCategories)
    }

    const handleAccordionChange = (category) => (event, isExpanded) => {
        const accordianCategories = { ...categoryExpanded }
        accordianCategories[category] = isExpanded
        setCategoryExpanded(accordianCategories)
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
        if (nodesData) groupByCategory(nodesData)
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
                                    <Tabs variant='fullWidth' value={tabValue} onChange={handleTabChange} aria-label='nodes tabs'>
                                        <Tab key={0} label='All' {...a11yProps(0)} />
                                        <Tab key={1} label='Trigger' {...a11yProps(1)} />
                                        <Tab key={2} label='Webhook' {...a11yProps(2)} />
                                        <Tab key={3} label='Action' {...a11yProps(3)} />
                                    </Tabs>
                                    <PerfectScrollbar
                                        containerRef={(el) => {
                                            ps.current = el
                                        }}
                                        style={{ height: '100%', maxHeight: 'calc(100vh - 375px)', overflowX: 'hidden' }}
                                    >
                                        <Box sx={{ p: 2 }}>
                                            <List
                                                sx={{
                                                    width: '100%',
                                                    maxWidth: 370,
                                                    py: 0,
                                                    borderRadius: '10px',
                                                    [theme.breakpoints.down('md')]: {
                                                        maxWidth: 370
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
                                                {Object.keys(nodes)
                                                    .sort()
                                                    .map((category) => (
                                                        <Accordion
                                                            expanded={categoryExpanded[category] || false}
                                                            onChange={handleAccordionChange(category)}
                                                            key={category}
                                                        >
                                                            <AccordionSummary
                                                                expandIcon={<ExpandMoreIcon color='primary' />}
                                                                aria-controls={`nodes-accordian-${category}`}
                                                                id={`nodes-accordian-header-${category}`}
                                                            >
                                                                <Typography variant='h5'>{category}</Typography>
                                                            </AccordionSummary>
                                                            <AccordionDetails>
                                                                {nodes[category].map((node, index) => (
                                                                    <div
                                                                        key={node.name}
                                                                        onDragStart={(event) => onDragStart(event, node)}
                                                                        draggable
                                                                    >
                                                                        <ListItemButton
                                                                            sx={{
                                                                                p: 0,
                                                                                borderRadius: `${customization.borderRadius}px`,
                                                                                cursor: 'move'
                                                                            }}
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
                                                                        {index === nodes[category].length - 1 ? null : <Divider />}
                                                                    </div>
                                                                ))}
                                                            </AccordionDetails>
                                                        </Accordion>
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
