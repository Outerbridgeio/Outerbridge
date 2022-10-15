import { Suspense, FC, PropsWithChildren } from 'react'
// project imports
import { Loader } from './Loader'

// ==============================|| LOADABLE - LAZY LOADING ||============================== //

export const Loadable = <T extends PropsWithChildren>(Component: FC<T>) =>
    function WithLoader(props: T) {
        return (
            <Suspense fallback={<Loader />}>
                <Component {...props} />
            </Suspense>
        )
    }
