import ReactDOM from 'react-dom'

// third party
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { SnackbarProvider } from 'notistack'
import ConfirmContextProvider from 'store/context/ConfirmContextProvider'

// project imports
import * as serviceWorker from 'serviceWorker'
import App from 'App'
import { store } from 'store'

// style + assets
import 'assets/scss/style.scss'

// ==============================|| REACT DOM RENDER  ||============================== //

ReactDOM.render(
    <Provider store={store.store}>
        <BrowserRouter>
            <SnackbarProvider>
                <ConfirmContextProvider>
                    <App />
                </ConfirmContextProvider>
            </SnackbarProvider>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
