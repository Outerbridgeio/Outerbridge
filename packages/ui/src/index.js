// third party
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { SnackbarProvider } from 'notistack'
import ConfirmContextProvider from 'store/context/ConfirmContextProvider'

// project imports
import * as serviceWorker from 'serviceWorker'
import App from 'App'
import { store } from 'store'

import { createRoot } from 'react-dom/client'
const container = document.getElementById('root')
const root = createRoot(container) // createRoot(container!) if you use TypeScript

// style + assets
import 'assets/scss/style.scss'

// ==============================|| REACT DOM RENDER  ||============================== //

root.render(
    <Provider store={store}>
        <BrowserRouter>
            <SnackbarProvider>
                <ConfirmContextProvider>
                    <App />
                </ConfirmContextProvider>
            </SnackbarProvider>
        </BrowserRouter>
    </Provider>
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
