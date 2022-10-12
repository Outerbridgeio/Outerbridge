import { useRoutes } from 'react-router-dom'

// routes
import { MainRoutes } from './MainRoutes'
import { CanvasRoutes } from './CanvasRoutes'
import { config } from 'config'

// ==============================|| ROUTING RENDER ||============================== //

export function ThemeRoutes() {
    return useRoutes([MainRoutes, CanvasRoutes], config.basename)
}
