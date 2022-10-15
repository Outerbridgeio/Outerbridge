import { useTheme as useTheme_, Theme as Theme_ } from '@mui/material/styles'
import { themePaletteCreator } from './palette'
import { themeTypographyCreator } from './typography'
import { Except } from 'type-fest'
import { SubTheme } from './theme'

// this type is not really good
// type-fest "merge deep" seem to be problematic
export type Theme = SubTheme & {
    typography: ReturnType<typeof themeTypographyCreator> & Theme_['typography']
    palette: ReturnType<typeof themePaletteCreator> & Theme_['palette']
    // cannot intersect with Theme_ because Theme_ is too big
    // will cause "Type instantiation is excessively deep and possibly infinite."
} & Except<Theme_, 'typography' | 'palette'>

export const useTheme = useTheme_<Theme>
