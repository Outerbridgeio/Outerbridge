import { forwardRef, ComponentProps, ReactNode } from 'react'
import { useTheme, AppTheme } from 'themes'

// material-ui
import { Card, CardContent, CardHeader, Divider, Typography, SxProps } from '@mui/material'

// constant
const headerSX = {
    '& .MuiCardHeader-action': { mr: 0 }
}

// ==============================|| CUSTOM MAIN CARD ||============================== //

export const MainCard = forwardRef<
    HTMLDivElement,
    ComponentProps<typeof Card> & {
        border?: boolean
        boxShadow?: boolean
        content?: boolean
        contentClass?: string
        shadow?: string
        darkTitle?: boolean
        contentSX?: SxProps<AppTheme>
        secondary?: ReactNode
    }
>(function MainCard(
    {
        border = true,
        boxShadow,
        children,
        content = true,
        contentClass = '',
        contentSX = {},
        darkTitle,
        secondary,
        shadow,
        sx = {},
        title,
        ...others
    },
    ref
) {
    const theme = useTheme()

    return (
        <Card
            ref={ref}
            {...others}
            sx={{
                border: border ? '1px solid' : 'none',
                borderColor: theme.palette.primary[200] + 75,
                ':hover': {
                    boxShadow: boxShadow ? shadow || '0 2px 14px 0 rgb(32 40 45 / 8%)' : 'inherit'
                },
                ...sx
            }}
        >
            {title && (
                <>
                    {/* card header and action */}
                    <CardHeader
                        sx={headerSX}
                        title={darkTitle ? <Typography variant='h3'>{title}</Typography> : title}
                        action={secondary}
                    />
                    {/* content & header divider */}
                    <Divider />
                </>
            )}

            {/* card content */}
            {content ? (
                <CardContent
                    // @ts-expect-error card content sx is not dynamic
                    sx={contentSX}
                    className={contentClass}
                >
                    {children}
                </CardContent>
            ) : (
                children
            )}
        </Card>
    )
})
