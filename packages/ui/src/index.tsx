import { render } from 'react-dom'

// third party
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { SnackbarProvider } from 'notistack'
import { context } from 'store'

// project imports
import { unregister } from 'serviceWorker'
import { App } from 'App'
import { store } from 'store'

// style + assets
import 'assets/scss/style.scss'

// ==============================|| REACT DOM RENDER  ||============================== //

render(
    <Provider store={store}>
        <BrowserRouter>
            <SnackbarProvider>
                <context.ConfirmContextProvider>
                    <App />
                </context.ConfirmContextProvider>
            </SnackbarProvider>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
unregister()
