import { useEffect, useState, PropsWithChildren } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from 'themes'

// material-ui
import { Box, Card, Divider, Grid, Typography } from '@mui/material'
import { Breadcrumbs } from '@mui/material'

// project imports
import { config } from 'config'
import { gridSpacing } from 'store/constant'

// assets
import { IconTallymark1, TablerIcon } from '@tabler/icons'
import { AccountTreeTwoTone, Home, HomeTwoTone } from '@mui/icons-material'

const linkSX = {
    display: 'flex',
    color: 'grey.900',
    textDecoration: 'none',
    alignContent: 'center',
    alignItems: 'center'
}
type Menu = { type?: 'collapse' | 'group' | 'item'; title: string; icon: TablerIcon; children: Menu[]; url: string; breadcrumbs: boolean }
// ==============================|| BREADCRUMBS ||============================== //
export const AppBreadcrumbs = ({
    card,
    divider,
    icon,
    icons,
    maxItems,
    navigation,
    rightAlign,
    separator: SeparatorIcon,
    title,
    titleBottom,
    ...others
}: PropsWithChildren<{
    card: boolean
    divider: boolean
    icon: boolean
    icons: boolean
    maxItems: number
    navigation?: { items?: Menu[] }
    rightAlign: boolean
    separator?: TablerIcon
    title: boolean
    titleBottom: boolean
}>) => {
    const theme = useTheme()

    const iconStyle = {
        marginRight: theme.spacing(0.75),
        marginTop: `-${theme.spacing(0.25)}`,
        width: '1rem',
        height: '1rem',
        color: theme.palette.secondary.main
    }

    const [main, setMain] = useState<Menu>()
    const [item, setItem] = useState<Menu>()

    // set active item state
    const getCollapse = (menu: Menu) => {
        if (menu.children) {
            menu.children.filter((collapse) => {
                if (collapse.type && collapse.type === 'collapse') {
                    getCollapse(collapse)
                } else if (collapse.type && collapse.type === 'item') {
                    if (document.location.pathname === config.basename + collapse.url) {
                        setMain(menu)
                        setItem(collapse)
                    }
                }
                return false
            })
        }
    }

    useEffect(() => {
        navigation?.items?.map((menu) => {
            if (menu.type === 'group') {
                getCollapse(menu)
            }
            return false
        })
    })

    // item separator
    const separatorIcon = SeparatorIcon ? <SeparatorIcon stroke={1.5} size='1rem' /> : <IconTallymark1 stroke={1.5} size='1rem' />

    let mainContent
    let itemContent
    let breadcrumbContent = <Typography />
    let itemTitle = ''
    let CollapseIcon
    let ItemIcon

    // collapse item
    if (main?.type === 'collapse') {
        CollapseIcon = main.icon ? main.icon : AccountTreeTwoTone
        mainContent = (
            <Typography component={Link} to='#' variant='subtitle1' sx={linkSX}>
                {icons && <CollapseIcon style={iconStyle} />}
                {main.title}
            </Typography>
        )
    }

    // items
    if (item?.type === 'item') {
        itemTitle = item.title

        ItemIcon = item.icon ? item.icon : AccountTreeTwoTone
        itemContent = (
            <Typography
                variant='subtitle1'
                sx={{
                    display: 'flex',
                    textDecoration: 'none',
                    alignContent: 'center',
                    alignItems: 'center',
                    color: 'grey.500'
                }}
            >
                {icons && <ItemIcon style={iconStyle} />}
                {itemTitle}
            </Typography>
        )

        // main
        if (item.breadcrumbs !== false) {
            breadcrumbContent = (
                <Card
                    sx={{
                        border: 'none'
                    }}
                    {...others}
                >
                    <Box sx={{ p: 2, pl: card === false ? 0 : 2 }}>
                        <Grid
                            container
                            direction={rightAlign ? 'row' : 'column'}
                            justifyContent={rightAlign ? 'space-between' : 'flex-start'}
                            alignItems={rightAlign ? 'center' : 'flex-start'}
                            spacing={1}
                        >
                            {title && !titleBottom && (
                                <Grid item>
                                    <Typography variant='h3' sx={{ fontWeight: 500 }}>
                                        {item.title}
                                    </Typography>
                                </Grid>
                            )}
                            <Grid item>
                                <Breadcrumbs
                                    sx={{ '& .MuiBreadcrumbs-separator': { width: 16, ml: 1.25, mr: 1.25 } }}
                                    aria-label='breadcrumb'
                                    maxItems={maxItems || 8}
                                    separator={separatorIcon}
                                >
                                    <Typography component={Link} to='/' color='inherit' variant='subtitle1' sx={linkSX}>
                                        {icons ? (
                                            <>
                                                <HomeTwoTone sx={iconStyle} />
                                                <Home sx={{ ...iconStyle, mr: 0 }} />
                                            </>
                                        ) : (
                                            'Dashboard'
                                        )}
                                    </Typography>
                                    {mainContent}
                                    {itemContent}
                                </Breadcrumbs>
                            </Grid>
                            {title && titleBottom && (
                                <Grid item>
                                    <Typography variant='h3' sx={{ fontWeight: 500 }}>
                                        {item.title}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    </Box>
                    {card === false && divider !== false && <Divider sx={{ borderColor: theme.palette.primary.main, mb: gridSpacing }} />}
                </Card>
            )
        }
    }

    return breadcrumbContent
}
