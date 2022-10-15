import { useSelector } from 'store'

import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline, StyledEngineProvider } from '@mui/material'

// routing
import { ThemeRoutes } from 'routes'

// defaultTheme
import { themeCreator } from 'themes'

// project imports
import { NavigationScroll } from 'layout/NavigationScroll'

// ==============================|| APP ||============================== //

export const App = () => {
    const customization = useSelector((state) => state.customization)

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={themeCreator(customization)}>
                <CssBaseline />
                <NavigationScroll>
                    <ThemeRoutes />
                </NavigationScroll>
            </ThemeProvider>
        </StyledEngineProvider>
    )
}
