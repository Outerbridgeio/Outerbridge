import { forwardRef, useEffect, ElementType, ChangeEvent, ComponentProps } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'store'
import { useTheme } from 'themes'
import { TablerIcon } from '@tabler/icons'
// material-ui
import { Avatar, Chip, ListItemButton, ListItemIcon, ListItemText, Typography, useMediaQuery } from '@mui/material'

// project imports
import { MENU_OPEN, SET_MENU } from 'store/actions'
import { config } from 'config'

// assets
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'

// ==============================|| SIDEBAR MENU LIST ITEMS ||============================== //

type ID = 'loadWorkflow' | 'workflows' | 'contracts' | 'exportWorkflow' | 'deleteWorkflow' | 'wallets' | 'dashboard' | 'settings'

export type Item = {
    icon?: TablerIcon
    id: ID
    target?: string
    url?: string
    external?: string
    disabled?: boolean
    title: string
    caption?: string
    chip?: ComponentProps<typeof Chip>
}

export const NavItem = ({
    item,
    level,
    navType,
    onClick,
    onUploadFile
}: {
    item: Item
    level: number
    navType?: 'SETTINGS' | 'MENU'
    onClick?: (arg: string) => void
    onUploadFile?: (arg: string | ArrayBuffer) => void
}) => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const customization = useSelector((state) => state.customization)
    const matchesSM = useMediaQuery(theme.breakpoints.down('lg'))

    const Icon = item.icon
    const itemIcon = Icon ? (
        <Icon stroke={1.5} size='1.3rem' />
    ) : (
        <FiberManualRecordIcon
            sx={{
                width: customization.isOpen.findIndex((id) => id === item.id) > -1 ? 8 : 6,
                height: customization.isOpen.findIndex((id) => id === item.id) > -1 ? 8 : 6
            }}
            fontSize={level > 0 ? 'inherit' : 'medium'}
        />
    )

    let itemTarget = '_self'
    if (item.target) {
        itemTarget = '_blank'
    }

    let listItemProps: { component: ElementType; href?: string; target?: string } = {
        component: forwardRef(function ListItemPropsComponent(props, ref) {
            return <Link ref={ref} {...props} to={`${config.basename}${item.url}`} target={itemTarget} />
        })
    }
    if (item.external) {
        listItemProps = { component: 'a', href: item.url, target: itemTarget }
    }
    if (item.id === 'loadWorkflow') {
        listItemProps.component = 'label'
    }

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return

        const file = e.target.files[0]!

        const reader = new FileReader()
        reader.onload = (evt) => {
            if (!evt?.target?.result) {
                return
            }
            const { result } = evt.target
            onUploadFile && onUploadFile(result)
        }
        reader.readAsText(file)
    }

    const itemHandler = (id: ID) => {
        if (navType === 'SETTINGS' && id !== 'loadWorkflow') {
            onClick && onClick(id)
        } else {
            dispatch({ type: MENU_OPEN, id })
            if (matchesSM) dispatch({ type: SET_MENU, opened: false })
        }
    }

    // active menu item on page load
    useEffect(() => {
        if (navType === 'MENU') {
            const currentIndex = document.location.pathname
                .toString()
                .split('/')
                .findIndex((id) => id === item.id)
            if (currentIndex > -1) {
                dispatch({ type: MENU_OPEN, id: item.id })
            }
            if (!document.location.pathname.toString().split('/')[1]) {
                itemHandler('workflows')
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navType])

    return (
        <ListItemButton
            {...listItemProps}
            disabled={item.disabled}
            sx={{
                borderRadius: `${customization.borderRadius}px`,
                mb: 0.5,
                alignItems: 'flex-start',
                backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
                py: level > 1 ? 1 : 1.25,
                pl: `${level * 24}px`
            }}
            selected={customization.isOpen.findIndex((id) => id === item.id) > -1}
            onClick={() => itemHandler(item.id)}
        >
            {item.id === 'loadWorkflow' && <input type='file' hidden accept='.json' onChange={(e) => handleFileUpload(e)} />}
            <ListItemIcon sx={{ my: 'auto', minWidth: !item.icon ? 18 : 36 }}>{itemIcon}</ListItemIcon>
            <ListItemText
                primary={
                    <Typography variant={customization.isOpen.findIndex((id) => id === item.id) > -1 ? 'h5' : 'body1'} color='inherit'>
                        {item.title}
                    </Typography>
                }
                secondary={
                    item.caption && (
                        <Typography variant='caption' sx={{ ...theme.typography.subMenuCaption }} display='block' gutterBottom>
                            {item.caption}
                        </Typography>
                    )
                }
            />
            {item.chip && (
                <Chip
                    color={item.chip.color}
                    variant={item.chip.variant}
                    size={item.chip.size}
                    label={item.chip.label}
                    avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
                />
            )}
        </ListItemButton>
    )
}
