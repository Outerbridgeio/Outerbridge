import { useTheme as useTheme_, Theme as Theme_ } from '@mui/material/styles'
import { themePaletteCreator } from './palette'
import { themeTypographyCreator } from './typography'
import { Except } from 'type-fest'
import { SubTheme } from './theme'

// this type is fragile
// want to use type-fest "merge deep" but it seem buggy
export type AppTheme = SubTheme & {
    typography: ReturnType<typeof themeTypographyCreator> & Theme_['typography']
    palette: ReturnType<typeof themePaletteCreator> & Theme_['palette']
} & Except<Theme_, 'typography' | 'palette'>

export const useTheme = useTheme_<AppTheme>
