import { createTheme, Palette } from '@mui/material/styles'

// assets
import colors from 'assets/scss/_themes-vars.module.scss'

// project imports
import { componentStyleOverrides } from './compStyleOverride'
import { themePaletteCreator } from './palette'
import { themeTypographyCreator } from './typography'

/**
 * Represent theme style and structure as per Material-UI
 */

type Customization = { borderRadius: string; navType: Palette['mode']; fontFamily: string }
export type Theme = typeof themeOption & { customization: Customization }

export const themeOption = {
    colors,
    heading: colors.grey900,
    paper: colors.paper,
    backgroundDefault: colors.paper,
    background: colors.primaryLight,
    darkTextPrimary: colors.grey700,
    darkTextSecondary: colors.grey500,
    textDark: colors.grey900,
    menuSelected: colors.secondaryDark,
    menuSelectedBack: colors.secondaryLight,
    divider: colors.grey200
} as const

export const themeCreator = (customization: Customization) => {
    const themeOptionWithCustomization = { ...themeOption, customization }

    const themeOptionFinal = {
        direction: 'ltr',
        palette: themePaletteCreator(themeOptionWithCustomization),
        mixins: {
            toolbar: {
                minHeight: '48px',
                padding: '16px',
                '@media (min-width: 600px)': {
                    minHeight: '48px'
                }
            }
        },
        typography: themeTypographyCreator(themeOptionWithCustomization)
    } as const

    const themes = createTheme(themeOptionFinal)
    themes.components = componentStyleOverrides(themeOptionWithCustomization)

    return themes
}
